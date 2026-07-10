#!/usr/bin/env node
/**
 * Pull Entire platform data → codify into Agent OS reusable assets:
 *   - errors / learnings (learning-loop)
 *   - skills (.agents/skills/from-entire/)
 *   - workflows (.agents/workflows/from-entire/)
 *   - rules (.agents/governance/FROM_ENTIRE_RULES.md + PREVENTION_RULES)
 *
 * Also supports auto-commit of codified artifacts so Entire git hooks fire.
 *
 * ── ANTI-FAKE POLICY (hard) ─────────────────────────────────────────────
 * NEVER invent Entire lessons/skills from git commit subjects alone.
 * Skills/workflows require real Entire signals: checkpoint | search | error
 * with substantive body. Git log is evidence/audit only (dispatch doc).
 * Honest empty > fake skills. See assertNoFakeEntireLessons + tests.
 *
 * Usage:
 *   node scripts/entire-to-agentos.mjs              # pull + codify
 *   node scripts/entire-to-agentos.mjs --commit     # codify + auto-commit
 *   node scripts/entire-to-agentos.mjs --dry-run
 *   node scripts/entire-to-agentos.mjs --since 14d
 *
 * Env:
 *   ENTIRE_BIN           path to entire.exe
 *   ENTIRE_AUTO_COMMIT=1 same as --commit
 *   ENTIRE_SYNC_SKIP=1   no-op (for hooks)
 */

/** Kinds that may become skills/workflows. Git is never on this list. */
export const SKILL_WORTHY_KINDS = new Set(['checkpoint', 'error']);

/** Kinds allowed in the learning-loop as Entire-sourced incidents. */
export const LEARNING_WORTHY_KINDS = new Set(['checkpoint', 'error']);

/** Forbidden id prefixes — historical fake channel. */
export const FORBIDDEN_LESSON_ID_PREFIXES = ['git-', 'git_'];

import { execFileSync, execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  appendFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recordFailure, rebuildMarkdownViews } from './learning-loop.mjs';
import { shouldPublishSkill } from './evaluate-skills.mjs';

const ROOT = process.cwd();
const STATE_PATH = join(ROOT, '.agents', 'entire-sync-state.json');
const SKILLS_DIR = join(ROOT, '.agents', 'skills', 'from-entire');
const SKILLS_QUARANTINE_DIR = join(SKILLS_DIR, '_quarantine');
const WORKFLOWS_DIR = join(ROOT, '.agents', 'workflows', 'from-entire');
const RULES_PATH = join(ROOT, '.agents', 'governance', 'FROM_ENTIRE_RULES.md');
const PREVENTION_PATH = join(ROOT, '.agents', 'governance', 'PREVENTION_RULES.md');
const DISPATCH_DIR = join(ROOT, '.agents', 'evidence', 'entire');

function parseArgs(argv) {
  const out = { _: [], commit: false, dryRun: false, since: '14d' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--commit') out.commit = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--since') out.since = argv[++i] || '14d';
    else out._.push(a);
  }
  if (process.env.ENTIRE_AUTO_COMMIT === '1' || process.env.ENTIRE_AUTO_COMMIT === 'true') {
    out.commit = true;
  }
  return out;
}

function entireBin() {
  if (process.env.ENTIRE_BIN && existsSync(process.env.ENTIRE_BIN)) {
    return process.env.ENTIRE_BIN;
  }
  const win = join(process.env.USERPROFILE || '', '.local', 'bin', 'entire.exe');
  if (existsSync(win)) return win;
  return 'entire';
}

function runEntire(args, { json = false, allowFail = true } = {}) {
  const bin = entireBin();
  try {
    const out = execFileSync(bin, args, {
      encoding: 'utf8',
      cwd: ROOT,
      timeout: 120_000,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (json) {
      try {
        return JSON.parse(out);
      } catch {
        // Some commands print non-json when empty
        if (String(out).trim() === '[]' || !String(out).trim()) return [];
        return { raw: out };
      }
    }
    return out;
  } catch (err) {
    const stderr = err.stderr ? String(err.stderr) : err.message;
    if (!allowFail) throw err;
    return json ? { error: stderr, raw: err.stdout ? String(err.stdout) : '' } : `[entire error] ${stderr}`;
  }
}

function loadState() {
  if (!existsSync(STATE_PATH)) {
    return { version: 1, seen: {}, last_sync: null, codified: [] };
  }
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { version: 1, seen: {}, last_sync: null, codified: [] };
  }
}

function saveState(state) {
  mkdirSync(dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function slugify(s) {
  return String(s || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'item';
}

function fp(text) {
  return createHash('sha256').update(String(text)).digest('hex').slice(0, 16);
}

function ensureDir(d) {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

/**
 * Auth is only true with an explicit positive signal from `entire auth status`.
 * Ambiguous / empty / status-only "Enabled" is treated as logged out.
 */
export function isAuthOkFromText(authStatus) {
  const s = String(authStatus || '').trim();
  if (!s) return { auth: false, detail: 'empty auth status' };
  if (/not logged in|no auth context|run ['`]?entire login/i.test(s)) {
    return { auth: false, detail: s };
  }
  // Positive signals only
  if (
    /logged in as|authenticated as|active context|token valid|email:\s*\S+@/i.test(s) ||
    (/logged in/i.test(s) && !/not logged in/i.test(s))
  ) {
    return { auth: true, detail: s.slice(0, 200) };
  }
  return { auth: false, detail: `ambiguous auth (fail closed): ${s.slice(0, 200)}` };
}

function isAuthOk() {
  const authStatus = String(runEntire(['auth', 'status'], { json: false }) || '');
  return isAuthOkFromText(authStatus);
}

export function isOneOffCommitSubject(subject) {
  const s = String(subject || '');
  return (
    /\bbump\b.+\bfrom\b.+\bto\b/i.test(s) ||
    /chore\(deps/i.test(s) ||
    /chore\(actions\)\(deps\)/i.test(s) ||
    /dependabot/i.test(s) ||
    /\bfrom\s+v?\d+\.\d+.*\bto\s+v?\d+\.\d+/i.test(s)
  );
}

/**
 * True if this lesson looks like the historical fake: git commit → skill.
 */
export function isFakeEntireLesson(lesson) {
  if (!lesson || typeof lesson !== 'object') return true;
  const id = String(lesson.id || '');
  const kind = String(lesson.kind || '');
  const tags = Array.isArray(lesson.tags) ? lesson.tags.map(String) : [];
  const body = String(lesson.body || '');
  const title = String(lesson.title || '');

  if (FORBIDDEN_LESSON_ID_PREFIXES.some((p) => id.startsWith(p))) return true;
  if (kind === 'git-weak' || kind === 'git') return true;
  if (kind === 'workflow' && (tags.includes('git') || tags.includes('entire-linked'))) return true;
  if (tags.includes('git') && !tags.includes('checkpoint') && !tags.includes('search')) return true;
  if (tags.includes('entire-linked') || tags.includes('no-entire')) return true;
  // Commit-stub body only (old writeSkill evidence)
  if (/^Commit\s+[a-f0-9]{7,}/i.test(body.trim()) && body.length < 400) return true;
  if (/^Commit\s+[a-f0-9]{7,}/i.test(body.trim()) && /SHA:\s*[a-f0-9]{40}/i.test(body) && !/(error|fail|fix:|stack|traceback)/i.test(body)) {
    // Subject + SHA only, no failure substance
    if (body.split('\n').filter((l) => l.trim()).length <= 4) return true;
  }
  if (isOneOffCommitSubject(title) || isOneOffCommitSubject(id)) return true;
  return false;
}

/**
 * Skill publication requires kind + explicit flag + not fake.
 */
export function isSkillWorthyLesson(lesson) {
  if (!lesson) return false;
  if (isFakeEntireLesson(lesson)) return false;
  if (lesson.publish_skill === false) return false;
  if (!SKILL_WORTHY_KINDS.has(String(lesson.kind))) return false;
  if (String(lesson.body || '').trim().length < 80) return false;
  return true;
}

/**
 * Hard guard: throw if any lesson is a git-fake. Call before write/record.
 * @param {object[]} lessons
 * @param {{ throwOnFake?: boolean }} [opts]
 */
export function assertNoFakeEntireLessons(lessons, opts = {}) {
  const throwOnFake = opts.throwOnFake !== false;
  const list = Array.isArray(lessons) ? lessons : [];
  const fakes = list.filter((l) => isFakeEntireLesson(l));
  if (fakes.length && throwOnFake) {
    const sample = fakes
      .slice(0, 5)
      .map((l) => `${l.id}:${l.kind}:${String(l.title || '').slice(0, 40)}`)
      .join('; ');
    throw new Error(
      `[anti-fake] Refusing ${fakes.length} fake Entire lesson(s) (git/commit stubs). Sample: ${sample}`
    );
  }
  return { ok: fakes.length === 0, fake_count: fakes.length, fakes };
}

/**
 * Collect platform signals from Entire.
 * Git is evidence-only fallback — never the primary "lesson" source for skills.
 */
function collectPlatform({ since }) {
  const sources = {
    status: null,
    auth_detail: null,
    sessions: [],
    checkpoints: [],
    dispatch: null,
    search_hits: [],
    git_log: [],
    auth: false,
    errors: [],
  };

  const auth = isAuthOk();
  sources.auth = auth.auth;
  sources.auth_detail = auth.detail;

  const statusText = runEntire(['status'], { json: false });
  sources.status = String(statusText);

  // Sessions (local, may work offline)
  const sessions = runEntire(['session', 'list', '--json'], { json: true });
  if (Array.isArray(sessions)) sources.sessions = sessions;
  else if (sessions?.error) sources.errors.push(`session list: ${sessions.error}`);

  // Checkpoints: list has NO --json flag — text only; explain/search use auth
  const cpList = String(runEntire(['checkpoint', 'list', '--no-pager'], { json: false }) || '');
  if (/no auth context|not logged in/i.test(cpList)) {
    sources.auth = false;
    sources.errors.push('checkpoint list: needs auth');
  } else if (/checkpoints\s+0|No checkpoints found/i.test(cpList)) {
    sources.checkpoints = [];
  } else if (cpList && !/^\s*\[entire error\]/i.test(cpList)) {
    // Keep raw listing for dispatch artifact; structured items come from search when authed
    sources.checkpoints = [{ raw: cpList.slice(0, 8000) }];
  }

  // Dispatch + recap require API auth
  if (sources.auth) {
    const dispatch = runEntire(['dispatch', '--since', since], { json: false });
    sources.dispatch = String(dispatch || '');
    if (/no auth context|not logged in|reading credentials/i.test(sources.dispatch)) {
      sources.auth = false;
      sources.errors.push('dispatch: auth failed at API');
    }

    for (const q of ['error', 'fix', 'failed', 'bug', 'regression', 'learning']) {
      const hits = runEntire(
        ['checkpoint', 'search', q, '--json', '--limit', '10'],
        { json: true }
      );
      if (Array.isArray(hits)) {
        sources.search_hits.push(...hits.map((h) => ({ ...h, query: q })));
      } else if (hits?.results && Array.isArray(hits.results)) {
        sources.search_hits.push(...hits.results.map((h) => ({ ...h, query: q })));
      } else if (hits?.error) {
        sources.errors.push(`search ${q}: ${hits.error}`);
      }
    }
  } else {
    sources.dispatch = null;
    sources.errors.push(
      'Entire not logged in — no cloud checkpoints/search/dispatch. Run: entire login'
    );
  }

  // Git log = audit trail only (not skill fodder)
  try {
    const log = execFileSync(
      'git',
      ['log', '-30', '--pretty=format:%H%x7c%h%x7c%cI%x7c%s'],
      {
        encoding: 'utf8',
        cwd: ROOT,
        windowsHide: true,
      }
    ).trim();
    sources.git_log = log
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [sha, short, date, ...rest] = line.split('|');
        return { sha, short, date, subject: rest.join('|') };
      });
  } catch (err) {
    sources.errors.push(`git log: ${err.message}`);
  }

  return sources;
}

/**
 * Turn Entire signals into discrete lessons worth codifying.
 *
 * HARD RULES:
 *   - NEVER create lessons from git_log / commit subjects
 *   - Require real checkpoint/search body
 *   - Without Entire signals → empty array (honest zero)
 */
export function extractLessons(sources) {
  const lessons = [];
  const src = sources || {};

  // From dispatch prose (authenticated) — documentation only, never a skill
  if (
    src.auth &&
    src.dispatch &&
    !/^\s*\[entire error\]|no auth context|reading credentials/i.test(src.dispatch)
  ) {
    const text = String(src.dispatch).trim();
    if (text.length > 80) {
      lessons.push({
        kind: 'dispatch',
        id: `dispatch-${fp(text)}`,
        title: 'Entire dispatch summary',
        body: text.slice(0, 8000),
        tags: ['dispatch', 'entire'],
        publish_skill: false,
      });
    }
  }

  // Structured checkpoints only (skip raw text list stubs)
  for (const cp of src.checkpoints || []) {
    if (cp?.raw && typeof cp.raw === 'string') continue;
    const id = cp.id || cp.checkpoint_id || cp.sha || fp(JSON.stringify(cp));
    // Never use bare git short-sha as checkpoint identity for skills without body
    const title =
      cp.title || cp.summary || cp.message || cp.subject || `Checkpoint ${String(id).slice(0, 12)}`;
    if (isOneOffCommitSubject(title)) continue;
    const body =
      cp.summary ||
      cp.description ||
      cp.prompt ||
      cp.transcript_excerpt ||
      (cp.body ? String(cp.body) : '');
    // Reject JSON.stringify dump of {sha, subject} only — need real fields
    if (!body || String(body).trim().length < 80) continue;
    if (isFakeEntireLesson({ id: `cp-${id}`, kind: 'checkpoint', title, body, tags: ['checkpoint'] })) {
      continue;
    }
    lessons.push({
      kind: 'checkpoint',
      id: `cp-${String(id).slice(0, 24)}`,
      title: String(title).slice(0, 160),
      body: String(body),
      tags: ['checkpoint', 'entire', cp.agent || 'agent'].filter(Boolean),
      meta: cp,
      publish_skill: true,
    });
  }

  // Search hits (requires auth) — primary lesson channel
  for (const hit of src.search_hits || []) {
    const id = hit.id || hit.checkpoint_id || hit.sha || hit.commit || fp(JSON.stringify(hit));
    const title = hit.title || hit.subject || hit.snippet || hit.query || 'Search hit';
    if (isOneOffCommitSubject(title)) continue;
    const body =
      hit.snippet || hit.summary || hit.content || hit.explanation || '';
    if (!body || String(body).trim().length < 80) continue;
    const isError = /error|fail|fix|bug|regression/i.test(`${title} ${body} ${hit.query || ''}`);
    const lesson = {
      kind: isError ? 'error' : 'insight',
      id: `hit-${String(id).slice(0, 24)}`,
      title: String(title).slice(0, 160),
      body: String(body),
      tags: ['search', 'entire', hit.query, isError ? 'error' : 'insight'].filter(Boolean),
      meta: hit,
      publish_skill: isError,
    };
    if (isFakeEntireLesson(lesson)) continue;
    lessons.push(lesson);
  }

  // Sessions: evidence only (never skills). Require real summary text, not JSON dump of ids.
  for (const sess of src.sessions || []) {
    const id = sess.id || sess.session_id || fp(JSON.stringify(sess));
    const title = sess.title || sess.summary || sess.branch || `Session ${String(id).slice(0, 12)}`;
    const body = sess.summary || sess.description || sess.last_message || '';
    if (!body || String(body).trim().length < 80) continue;
    if (isOneOffCommitSubject(title)) continue;
    lessons.push({
      kind: 'session',
      id: `sess-${String(id).slice(0, 24)}`,
      title: String(title).slice(0, 160),
      body: String(body),
      tags: ['session', 'entire'],
      meta: sess,
      publish_skill: false,
    });
  }

  // ═══ GIT LOG IS NEVER A LESSON SOURCE ═══
  // sources.git_log may exist for dispatch audit only. Do not push lessons from it.
  void src.git_log;

  // De-dupe by id, strip any fakes that slipped through
  const map = new Map();
  for (const l of lessons) {
    if (isFakeEntireLesson(l)) continue;
    if (!map.has(l.id)) map.set(l.id, l);
  }
  const out = [...map.values()];
  // Final hard assert (throws if something reintroduced git fakes)
  assertNoFakeEntireLessons(out);
  return out;
}

function writeSkill(lesson, { dryRun }) {
  if (!isSkillWorthyLesson(lesson)) {
    console.warn(
      `[entire-to-agentos] anti-fake: refuse skill for ${lesson?.id || '?'} kind=${lesson?.kind}`
    );
    return null;
  }
  ensureDir(SKILLS_DIR);
  const slug = slugify(lesson.title);
  const title = lesson.title;
  const description = `Use when work matches: ${String(title).slice(0, 120)}`;
  const body = `## When to use

Apply this skill when work matches the original session/checkpoint pattern described below.

## Procedure

1. Read the context in **Evidence**.
2. Reproduce the failing or target state if this is a fix.
3. Apply the prevention / approach encoded here.
4. Verify with \`npm run lint\` / \`npm test\` as appropriate.
5. Commit so Entire checkpoint hooks capture the verification.

## Evidence

\`\`\`text
${String(lesson.body).slice(0, 6000)}
\`\`\`

## Prevention

- Prefer this path over rediscovering from scratch.
- Link new failures via \`node scripts/learning-loop.mjs record\`.
`;

  // Quality gate: one-offs / pure templates go to quarantine, not active load path
  const gate = shouldPublishSkill({
    slug,
    title,
    description,
    body: `# ${title}\n\n${body}`,
  });
  const targetRoot = gate.ok ? SKILLS_DIR : SKILLS_QUARANTINE_DIR;
  const dir = join(targetRoot, slug);
  if (!dryRun) ensureDir(dir);
  const skillPath = join(dir, 'SKILL.md');
  const verdict = gate.evaluation?.verdict || (gate.ok ? 'warn' : 'quarantine');
  const score = gate.evaluation?.score ?? 0;
  const content = `---
name: entire-${slug}
description: ${JSON.stringify(description)}
source: entire
entire_id: ${lesson.id}
quality_score: ${score}
quality_verdict: ${verdict}
status: ${gate.ok ? 'active' : 'quarantined'}
tags: [${(lesson.tags || []).map((t) => JSON.stringify(t)).join(', ')}]
---

# ${title}

**Source:** Entire platform · kind=\`${lesson.kind}\` · id=\`${lesson.id}\`

${body}
`;
  if (!dryRun) writeFileSync(skillPath, content, 'utf8');
  if (!gate.ok) {
    console.warn(
      `[entire-to-agentos] quarantined skill ${slug} (score=${score}, ${verdict}): ${(gate.evaluation?.hard_fails || [])[0] || 'quality gate'}`
    );
  }
  return skillPath;
}

function writeWorkflow(lesson, { dryRun }) {
  if (!isSkillWorthyLesson(lesson)) {
    console.warn(
      `[entire-to-agentos] anti-fake: refuse workflow for ${lesson?.id || '?'} kind=${lesson?.kind}`
    );
    return null;
  }
  ensureDir(WORKFLOWS_DIR);
  const slug = slugify(lesson.title);
  const path = join(WORKFLOWS_DIR, `${slug}.md`);
  const content = `---
type: workflow
title: ${JSON.stringify(lesson.title)}
source: entire
entire_id: ${lesson.id}
tags: [entire, workflow, ${(lesson.tags || []).join(', ')}]
---

# Workflow: ${lesson.title}

## Trigger

Entire codified signal \`${lesson.id}\` (${lesson.kind}).

## Steps

1. **Pull context** — \`node scripts/entire-to-agentos.mjs\` (or \`entire checkpoint list\`).
2. **Open evidence** — see body below.
3. **Execute** — perform the same class of change safely.
4. **Verify** — \`npm run lint && npm test\`.
5. **Commit** — conventional commit so Entire auto-hooks capture checkpoint.
6. **Codify** — if new failure, learning-loop records prevention.

## Evidence

\`\`\`text
${String(lesson.body).slice(0, 5000)}
\`\`\`
`;
  if (!dryRun) writeFileSync(path, content, 'utf8');
  return path;
}

function writeRules(lessons, { dryRun }) {
  ensureDir(dirname(RULES_PATH));
  const header = `---
type: policy
title: Rules codified from Entire
description: Auto-generated reusable rules from Entire checkpoints, dispatch, and commits.
tags: [entire, governance, auto]
---

# Rules from Entire

_Updated by \`scripts/entire-to-agentos.mjs\`. Do not hand-edit durable lessons here without also updating PREVENTION_RULES._

`;
  const blocks = lessons
    .filter((l) => l.kind === 'error' || /fix|fail|error/i.test(l.title))
    .slice(0, 40)
    .map((l) => {
      const rule =
        l.kind === 'error'
          ? `When seeing "${l.title.slice(0, 80)}", consult skill/workflow from Entire id \`${l.id}\` before retrying.`
          : `Reuse workflow for: ${l.title.slice(0, 100)}`;
      return `<!-- entire:${l.id} -->
### ${l.id}
- **Title**: ${l.title}
- **Rule**: ${rule}
- **Tags**: ${(l.tags || []).join(', ')}
`;
    });

  const body = header + (blocks.length ? blocks.join('\n') : '_No error-class lessons yet. Commit agent work so Entire can capture checkpoints._\n');
  if (!dryRun) writeFileSync(RULES_PATH, body, 'utf8');

  // Mirror high-signal into PREVENTION_RULES (dedupe by entire id marker)
  if (!dryRun && existsSync(PREVENTION_PATH) === false) {
    writeFileSync(
      PREVENTION_PATH,
      `---
type: policy
title: Prevention Rules
description: Deduped prevention rules
tags: [governance, prevention]
---

# Prevention Rules

`,
      'utf8'
    );
  }
  if (!dryRun && existsSync(PREVENTION_PATH)) {
    let prev = readFileSync(PREVENTION_PATH, 'utf8');
    for (const l of lessons.filter((x) => x.kind === 'error').slice(0, 20)) {
      const marker = `<!-- entire:${l.id} -->`;
      if (prev.includes(marker)) continue;
      prev += `
${marker}
### entire/${l.id}
- **When**: ${l.title}
- **Rule**: Reuse \`.agents/skills/from-entire/${slugify(l.title)}/SKILL.md\` or re-run learning-loop after verifying the fix.
`;
    }
    writeFileSync(PREVENTION_PATH, prev, 'utf8');
  }

  return RULES_PATH;
}

function recordErrors(lessons, { dryRun }) {
  const recorded = [];
  for (const l of (lessons || []).slice(0, 25)) {
    if (!LEARNING_WORTHY_KINDS.has(String(l.kind))) continue;
    if (isFakeEntireLesson(l)) {
      console.warn(`[entire-to-agentos] anti-fake: refuse learning-loop record for ${l.id}`);
      continue;
    }
    if (String(l.body || '').trim().length < 80) continue;
    if (dryRun) {
      recorded.push({ id: l.id, dry: true });
      continue;
    }
    const result = recordFailure({
      title: `[entire] ${l.title}`.slice(0, 200),
      error: String(l.body).slice(0, 2000),
      command: 'entire-to-agentos',
      area: 'entire',
      step: l.id,
    });
    recorded.push(result);
  }
  return recorded;
}

function writeDispatchArtifact(sources, { dryRun }) {
  ensureDir(DISPATCH_DIR);
  const path = join(DISPATCH_DIR, `dispatch-${new Date().toISOString().replace(/[:.]/g, '-')}.md`);
  const content = `# Entire → Agent OS pull

**At:** ${new Date().toISOString()}
**Auth:** ${sources.auth ? 'yes' : 'NO (login required for cloud search/dispatch)'}

## Status
\`\`\`
${sources.status}
\`\`\`

## Dispatch
\`\`\`
${String(sources.dispatch || '').slice(0, 10000)}
\`\`\`

## Sessions
\`\`\`json
${JSON.stringify(sources.sessions, null, 2).slice(0, 5000)}
\`\`\`

## Checkpoints
\`\`\`json
${JSON.stringify(sources.checkpoints, null, 2).slice(0, 5000)}
\`\`\`

## Errors during pull
${(sources.errors || []).map((e) => `- ${e}`).join('\n') || '_none_'}
`;
  if (!dryRun) writeFileSync(path, content, 'utf8');
  return path;
}

function autoCommit(paths, { dryRun }) {
  if (!paths.length) return { committed: false, reason: 'nothing to commit' };
  if (dryRun) return { committed: false, reason: 'dry-run' };

  // Avoid recursive hook storms
  process.env.ENTIRE_SYNC_SKIP = '1';
  process.env.GRAPHIFY_SKIP_HOOK = '1';

  try {
    for (const p of paths) {
      try {
        execSync(`git add -- "${p}"`, { cwd: ROOT, stdio: 'pipe' });
      } catch {
        /* untracked path ok */
      }
    }
    // Stage common dirs
    for (const d of [
      '.agents/skills/from-entire',
      '.agents/workflows/from-entire',
      '.agents/governance',
      '.agents/evidence/entire',
      '.learnings',
    ]) {
      try {
        execSync(`git add -A -- "${d}"`, { cwd: ROOT, stdio: 'pipe' });
      } catch {
        /* ignore */
      }
    }

    const staged = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf8' }).trim();
    if (!staged) return { committed: false, reason: 'nothing staged' };

    const msg =
      'chore(agent-os): codify Entire sessions into skills, workflows, rules, and learnings\n\n' +
      'Auto-generated by scripts/entire-to-agentos.mjs so reusable Agent OS assets stay in sync.\n';

    // Allow empty trailers from entire prepare-commit-msg
    execSync('git commit --no-verify -m ' + JSON.stringify(msg), {
      cwd: ROOT,
      stdio: 'pipe',
      env: {
        ...process.env,
        ENTIRE_SYNC_SKIP: '1',
        GRAPHIFY_SKIP_HOOK: '1',
      },
    });

    // Manually invoke Entire post-commit so checkpoint still captures (since --no-verify skips husky)
    try {
      const bin = entireBin();
      execFileSync(bin, ['hooks', 'git', 'post-commit'], {
        cwd: ROOT,
        stdio: 'ignore',
        windowsHide: true,
      });
    } catch {
      /* non-fatal */
    }

    return { committed: true, files: staged.split(/\r?\n/).filter(Boolean) };
  } catch (err) {
    return { committed: false, reason: err.message, stderr: err.stderr ? String(err.stderr) : '' };
  }
}

export async function syncEntireToAgentOs(options = {}) {
  if (process.env.ENTIRE_SYNC_SKIP === '1') {
    return { ok: true, skipped: true };
  }

  const args = {
    commit: !!options.commit,
    dryRun: !!options.dryRun,
    since: options.since || '14d',
  };

  const state = loadState();
  const sources = collectPlatform({ since: args.since });
  // extractLessons never uses git; assertNoFakeEntireLessons throws if fakes appear
  let lessons = [];
  try {
    lessons = extractLessons(sources).filter((l) => !state.seen[l.id]);
    assertNoFakeEntireLessons(lessons);
  } catch (err) {
    console.error('[entire-to-agentos]', err.message);
    return {
      ok: false,
      auth: sources.auth,
      auth_detail: sources.auth_detail,
      error: err.message,
      blockers: ['anti_fake_guard'],
      new_lessons: 0,
      skill_worthy: 0,
      skills_written: 0,
      note: err.message,
    };
  }

  const written = [];
  const dispatchPath = writeDispatchArtifact(sources, args);
  if (dispatchPath) written.push(dispatchPath);

  const skillWorthy = lessons.filter((l) => isSkillWorthyLesson(l));
  const errorLessons = lessons.filter(
    (l) => LEARNING_WORTHY_KINDS.has(l.kind) && !isFakeEntireLesson(l)
  );

  let skillsWritten = 0;
  for (const lesson of skillWorthy) {
    const sp = writeSkill(lesson, args);
    const wp = writeWorkflow(lesson, args);
    if (sp) {
      written.push(sp);
      skillsWritten += 1;
    }
    if (wp) written.push(wp);
    state.seen[lesson.id] = {
      at: new Date().toISOString(),
      kind: lesson.kind,
      title: lesson.title,
      skill: Boolean(sp),
    };
    if (sp) state.codified.push(lesson.id);
  }

  // Track non-skill lessons as seen (dispatch/session) without publishing skills
  for (const lesson of lessons.filter((l) => !skillWorthy.includes(l))) {
    if (isFakeEntireLesson(lesson)) continue; // never mark fakes as codified success
    state.seen[lesson.id] = {
      at: new Date().toISOString(),
      kind: lesson.kind,
      title: lesson.title,
      skill: false,
    };
  }

  const rulesPath = writeRules(errorLessons, args);
  if (rulesPath) written.push(rulesPath);

  // Only real error/checkpoint lessons enter learning-loop
  const recorded = recordErrors(errorLessons, args);
  try {
    rebuildMarkdownViews();
  } catch {
    /* non-fatal */
  }

  state.last_sync = new Date().toISOString();
  state.last_auth = sources.auth;
  state.last_auth_detail = sources.auth_detail;
  state.last_lesson_count = lessons.length;
  state.last_skill_worthy = skillWorthy.length;
  state.skills_written = skillsWritten;
  state.anti_fake = true;
  state.policy = 'no-git-skills-v3';
  state.last_errors = sources.errors;
  state.checkpoints_found = sources.checkpoints.length;
  state.sessions_found = sources.sessions.length;
  state.search_hits = sources.search_hits.length;
  // Never persist git_* seen keys as successful codify
  for (const k of Object.keys(state.seen || {})) {
    if (FORBIDDEN_LESSON_ID_PREFIXES.some((p) => k.startsWith(p))) {
      state.seen[k] = {
        ...(state.seen[k] || {}),
        skill: false,
        fake: true,
        blocked_by: 'anti-fake-v3',
      };
    }
  }
  if (!args.dryRun) saveState(state);

  let commitResult = { committed: false, reason: 'not requested' };
  if (args.commit) {
    commitResult = autoCommit(written.filter(Boolean), args);
  }

  const blockers = [];
  if (!sources.auth) blockers.push('entire_not_logged_in');
  if (
    sources.auth &&
    sources.sessions.length === 0 &&
    sources.search_hits.length === 0 &&
    !(sources.checkpoints || []).some((c) => c && !c.raw)
  ) {
    blockers.push('no_checkpoints_or_sessions');
  }
  if (skillWorthy.length === 0) blockers.push('no_skill_worthy_lessons');

  return {
    ok: true,
    auth: sources.auth,
    auth_detail: sources.auth_detail,
    anti_fake: true,
    policy: 'no-git-skills-v3',
    new_lessons: lessons.length,
    skill_worthy: skillWorthy.length,
    skills_written: skillsWritten,
    skills_dir: SKILLS_DIR,
    workflows_dir: WORKFLOWS_DIR,
    rules: rulesPath,
    dispatch: dispatchPath,
    recorded: recorded.length,
    blockers,
    entire_errors: sources.errors,
    sessions: sources.sessions.length,
    search_hits: sources.search_hits.length,
    git_log_count: (sources.git_log || []).length,
    git_used_as_lessons: false,
    commit: commitResult,
    lessons: lessons.map((l) => ({
      id: l.id,
      kind: l.kind,
      title: l.title,
      publish_skill: isSkillWorthyLesson(l),
    })),
    note: sources.auth
      ? skillsWritten
        ? 'Entire cloud data available; skills codified from real signals only.'
        : 'Logged in but no skill-worthy checkpoints/search hits — empty is correct. Git commits are not lessons.'
      : 'BLOCKED: not logged in. Zero fake git lessons. Run `entire login`, use hooked agents, commit so checkpoints exist.',
  };
}

// CLI
const isMain =
  process.argv[1] &&
  (fileURLToPath(import.meta.url) === process.argv[1] ||
    String(process.argv[1]).replace(/\\/g, '/').endsWith('scripts/entire-to-agentos.mjs'));

if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  syncEntireToAgentOs(opts)
    .then((r) => {
      console.log(JSON.stringify(r, null, 2));
      if (!r.auth) {
        console.error('\n[entire-to-agentos] Tip: entire login  # then re-run for full checkpoint/search pull');
      }
    })
    .catch((err) => {
      console.error('[entire-to-agentos] failed:', err.message);
      process.exit(1);
    });
}
