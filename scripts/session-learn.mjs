#!/usr/bin/env node
/**
 * Session learn/evaluate closer — automates what agents forget.
 *
 * Full close (default when --close):
 *   1) agentos:health snapshot
 *   2) resolve known fixed incidents (optional --resolve-open with prevention map)
 *   3) domain:sync all → Turso
 *   4) learning-loop compact + status
 *   5) learn-pipeline --skip-entire (unless ENTIRE available) + recommend
 *   6) optional skill evaluate dry-run
 *   7) write .learnings/SESSION_CLOSE_<iso>.json + latest SESSION_CLOSE.md
 *
 * Manifest-driven close:
 *   node scripts/session-learn.mjs --close --manifest .learnings/session-manifest.json
 *
 * Manifest shape:
 * {
 *   "title": "optional session title",
 *   "successes": [{ "domain": "agent-os", "title": "...", "detail": "..." }],
 *   "failures": [{ "title": "...", "error": "...", "command": "...", "prevention": "..." }],
 *   "resolve": [{ "id": "ERR-...", "prevention": "..." }]
 * }
 *
 * Automation:
 *   - npm run learn:session:close
 *   - hooks post-session (debounced) when SESSION_LEARN_AUTO=1
 *   - CI: learn-pipeline.yml already runs after CI; this is for local agent sessions
 *
 * Env:
 *   SESSION_LEARN_SKIP=1
 *   SESSION_LEARN_AUTO=1          enable auto-close from hooks
 *   SESSION_LEARN_SKIP_EVALUATE=1 skip skill evaluate dry-run
 *   SESSION_LEARN_SKIP_PIPELINE=1 skip learn-pipeline
 */
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from 'node:fs';
import { join } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { resolveFailure, recordFailure, getStatus, rebuildMarkdownViews } from './learning-loop.mjs';

const ROOT = process.cwd();
const LEARNINGS = join(ROOT, '.learnings');

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    if (existsSync(join(ROOT, f))) loadDotenv({ path: join(ROOT, f), override: false });
  }
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    timeout: opts.timeout || 180_000,
    env: { ...process.env, ...opts.env },
  });
  return {
    ok: r.status === 0,
    status: r.status,
    stdout: r.stdout || '',
    stderr: r.stderr || '',
    error: r.error?.message || null,
  };
}

function runNode(scriptRel, args = [], opts = {}) {
  return run(process.execPath, [join(ROOT, scriptRel), ...args], opts);
}

function parseArgs(argv) {
  const out = {
    close: false,
    manifest: null,
    title: null,
    skipEvaluate: process.env.SESSION_LEARN_SKIP_EVALUATE === '1',
    skipPipeline: process.env.SESSION_LEARN_SKIP_PIPELINE === '1',
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--close') out.close = true;
    else if (a === '--manifest') out.manifest = argv[++i];
    else if (a === '--title') out.title = argv[++i];
    else if (a === '--skip-evaluate') out.skipEvaluate = true;
    else if (a === '--skip-pipeline') out.skipPipeline = true;
    else if (a === '--dry-run') out.dryRun = true;
  }
  return out;
}

function loadManifest(path) {
  if (!path || !existsSync(path)) return { successes: [], failures: [], resolve: [] };
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    return { successes: [], failures: [], resolve: [], error: e.message };
  }
}

function domainSuccess(domain, title, detail = '', command = '') {
  const args = ['scripts/domain-agent.mjs', 'success', domain, '--title', title];
  if (detail) args.push('--detail', detail);
  if (command) args.push('--command', command);
  return runNode(args[0], args.slice(1));
}

/**
 * Built-in closeout for this product's known fixed incidents (idempotent).
 */
function resolveKnownFixed() {
  const known = [
    {
      id: 'ERR-20260710-28e9',
      prevention:
        'ROOT CAUSE: bare bash was WSL System32 before Git. Fix: Admin scripts/fix-windows-bash-path.ps1 prepends Git\\bin to Machine PATH. Verify where bash + agentos:health bash.ok. Policy ROOT_CAUSE.md.',
    },
    {
      id: 'ERR-20260710-1770',
      prevention:
        'After Machine PATH fix, fully restart IDE/agent shells. agentos:health uses registry PATH for bash.ok. Stale process PATH is expected until restart.',
    },
    {
      id: 'ERR-20260710-87d7',
      prevention:
        'Semgrep Guardian blocks Write/Edit when not logged in. Log into guardian MCP for real scans, or accept non-blocking policy with explicit product decision — do not leave unexplained permanent disable.',
    },
  ];
  const results = [];
  for (const k of known) {
    results.push(
      resolveFailure({
        id: k.id,
        prevention: k.prevention,
        note: 'session-learn known-fixed auto-resolve',
      }),
    );
  }
  return results;
}

export async function closeSession(options = {}) {
  loadEnv();
  if (process.env.SESSION_LEARN_SKIP === '1') {
    return { ok: true, skipped: 'SESSION_LEARN_SKIP' };
  }

  const started = new Date().toISOString();
  const report = {
    started,
    title: options.title || 'session-learn close',
    steps: [],
    ok: true,
  };

  function step(name, fn) {
    if (options.dryRun) {
      report.steps.push({ name, dryRun: true });
      return null;
    }
    try {
      const result = fn();
      report.steps.push({ name, ok: result?.ok !== false, result: summarize(result) });
      if (result?.ok === false) report.ok = false;
      return result;
    } catch (e) {
      report.ok = false;
      report.steps.push({ name, ok: false, error: e.message });
      return null;
    }
  }

  function summarize(r) {
    if (r == null) return null;
    if (typeof r === 'string') return r.slice(0, 500);
    if (r.message) return { message: r.message, ...(r.resolved != null ? { resolved: r.resolved } : {}) };
    if (r.stdout || r.stderr) {
      return {
        ok: r.ok,
        status: r.status,
        out: String(r.stdout || '').slice(0, 400),
        err: String(r.stderr || '').slice(0, 200),
      };
    }
    try {
      return JSON.parse(JSON.stringify(r));
    } catch {
      return String(r);
    }
  }

  // 1) Health
  step('agentos:health', () => runNode('scripts/agent-os-ontology.mjs', ['health']));

  // 2) Manifest ingest
  const manifest = loadManifest(options.manifest);
  if (manifest.error) {
    report.steps.push({ name: 'manifest', ok: false, error: manifest.error });
  }

  step('manifest.failures', () => {
    const outs = [];
    for (const f of manifest.failures || []) {
      outs.push(
        recordFailure({
          title: f.title || 'session failure',
          error: f.error || f.detail || '',
          command: f.command || '',
          area: f.area || f.domain || 'general',
          prevention: f.prevention || null,
          category: f.category || null,
        }),
      );
    }
    return { ok: true, count: outs.length, outs };
  });

  step('manifest.successes', () => {
    const outs = [];
    for (const s of manifest.successes || []) {
      const domain = s.domain || 'agent-os';
      outs.push(domainSuccess(domain, s.title || 'session success', s.detail || '', s.command || ''));
    }
    return { ok: true, count: outs.length };
  });

  step('manifest.resolve', () => {
    const outs = [];
    for (const r of manifest.resolve || []) {
      outs.push(
        resolveFailure({
          id: r.id,
          fingerprint: r.fingerprint,
          prevention: r.prevention,
          note: r.note || 'manifest resolve',
        }),
      );
    }
    return { ok: true, count: outs.length, outs };
  });

  // 3) Known fixed from this product session themes
  step('resolve.known_fixed', () => {
    const outs = resolveKnownFixed();
    return { ok: true, outs };
  });

  // 4) Domain sync → Turso
  step('domain:sync all', () => runNode('scripts/domain-agent.mjs', ['sync', 'all'], { timeout: 120_000 }));

  // 5) Compact + status
  step('learning-loop compact', () => runNode('scripts/learning-loop.mjs', ['compact']));
  // Rebuild agent-facing inject so next session cannot re-fail logged lessons
  step('active-prevention rebuild', () =>
    runNode('scripts/active-prevention.mjs', ['rebuild'])
  );
  step('learning-loop status', () => {
    const r = runNode('scripts/learning-loop.mjs', ['status']);
    try {
      report.learning_status = JSON.parse(r.stdout);
    } catch {
      /* ignore */
    }
    return r;
  });

  // 6) Pipeline + recommend
  if (!options.skipPipeline) {
    step('learn-pipeline', () =>
      runNode(
        'scripts/learn-pipeline.mjs',
        ['--conclusion', 'success', '--pipeline', 'session', '--job', 'session-learn', '--skip-entire'],
        { timeout: 180_000 },
      ),
    );
    step('learn:recommend', () => runNode('scripts/learn-pipeline.mjs', ['--recommend', 'general']));
  }

  // 7) Skill evaluate dry-run (does not quarantine unless apply)
  if (!options.skipEvaluate) {
    step('learn:evaluate:dry', () => runNode('scripts/evaluate-skills.mjs', [], { timeout: 120_000 }));
  }

  // 8) Write reports
  if (!existsSync(LEARNINGS)) mkdirSync(LEARNINGS, { recursive: true });
  report.ended = new Date().toISOString();
  report.learning_status = report.learning_status || getStatus();

  const stamp = report.ended.replace(/[:.]/g, '-');
  const jsonPath = join(LEARNINGS, `SESSION_CLOSE_${stamp}.json`);
  const mdPath = join(LEARNINGS, 'SESSION_CLOSE.md');
  if (!options.dryRun) {
    writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
    writeFileSync(
      mdPath,
      [
        '---',
        'type: report',
        'title: Session learn close (latest)',
        `description: Auto-written by scripts/session-learn.mjs at ${report.ended}`,
        'tags: [learning, session, agent-os]',
        '---',
        '',
        `# Session learn close`,
        '',
        `**Title:** ${report.title}`,
        `**Started:** ${report.started}`,
        `**Ended:** ${report.ended}`,
        `**OK:** ${report.ok}`,
        '',
        '## Learning status',
        '',
        '```json',
        JSON.stringify(report.learning_status, null, 2),
        '```',
        '',
        '## Steps',
        '',
        ...report.steps.map(
          (s) =>
            `- **${s.name}**: ${s.ok === false ? 'FAIL' : s.dryRun ? 'dry-run' : 'ok'}${s.error ? ` — ${s.error}` : ''}`,
        ),
        '',
        '## Automation',
        '',
        '- `npm run learn:session:close` — full close',
        '- Hooks: post-session when `SESSION_LEARN_AUTO=1`',
        '- Policy: `.agents/governance/ROOT_CAUSE.md` · iron law 12',
        '',
        `Full JSON: \`.learnings/SESSION_CLOSE_${stamp}.json\``,
        '',
      ].join('\n'),
      'utf8',
    );
    report.report_json = jsonPath;
    report.report_md = mdPath;
  }

  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.close && !args.manifest) {
    console.log(`Usage:
  node scripts/session-learn.mjs --close [--manifest path] [--title "..."]
  node scripts/session-learn.mjs --close --skip-evaluate --skip-pipeline
  npm run learn:session:close
`);
    process.exit(0);
  }

  closeSession({
    title: args.title,
    manifest: args.manifest,
    skipEvaluate: args.skipEvaluate,
    skipPipeline: args.skipPipeline,
    dryRun: args.dryRun,
  }).then((report) => {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.ok || report.skipped ? 0 : 1);
  });
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('session-learn.mjs') ||
    process.argv[1].replace(/\\/g, '/').endsWith('/session-learn.mjs'));
if (isMain) main();
