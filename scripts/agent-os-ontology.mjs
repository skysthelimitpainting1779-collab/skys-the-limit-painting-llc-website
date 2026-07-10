#!/usr/bin/env node
/**
 * Agent OS ontology runtime — validate, purge bloat, proactive health, improve.
 *
 *   node scripts/agent-os-ontology.mjs status
 *   node scripts/agent-os-ontology.mjs validate
 *   node scripts/agent-os-ontology.mjs purge
 *   node scripts/agent-os-ontology.mjs health
 *   node scripts/agent-os-ontology.mjs improve   # health + recommend + optional evolve dry
 *   node scripts/agent-os-ontology.mjs cold-start  # print what agents should load
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  rmSync,
} from 'node:fs';
import { join, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createClient } from '@libsql/client';
import { config as loadDotenv } from 'dotenv';

const ROOT = process.cwd();
const AGENTS = join(ROOT, '.agents');
const MANIFEST_PATH = join(AGENTS, 'ontology.manifest.json');

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    if (existsSync(join(ROOT, f))) loadDotenv({ path: join(ROOT, f), override: false });
  }
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing ${MANIFEST_PATH}`);
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

function dirSize(p) {
  if (!existsSync(p)) return { files: 0, bytes: 0 };
  const st = statSync(p);
  if (!st.isDirectory()) return { files: 1, bytes: st.size };
  let files = 0;
  let bytes = 0;
  const walk = (d) => {
    for (const name of readdirSync(d, { withFileTypes: true })) {
      const fp = join(d, name.name);
      if (name.isDirectory()) walk(fp);
      else {
        files += 1;
        try {
          bytes += statSync(fp).size;
        } catch {
          /* skip */
        }
      }
    }
  };
  walk(p);
  return { files, bytes };
}

function validate(manifest) {
  const issues = [];
  const ok = [];
  for (const rel of manifest.required_files || []) {
    const p = join(ROOT, rel);
    if (existsSync(p)) ok.push(rel);
    else issues.push({ level: 'error', msg: `missing required ${rel}` });
  }
  for (const rel of manifest.kernel_paths || []) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) issues.push({ level: 'warn', msg: `kernel path missing: ${rel}` });
  }
  if (existsSync(join(AGENTS, '_archive'))) {
    issues.push({ level: 'error', msg: '.agents/_archive exists — run npm run agentos:purge (hard delete)' });
  }
  if (existsSync(join(AGENTS, 'dashboard.html'))) {
    issues.push({ level: 'warn', msg: 'dashboard.html still active — run purge' });
  }
  const sessionDirs = readdirSync(AGENTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => /m1_m5|orchestrator|victory_|challenger|reviewer_|worker_|auditor_|sentinel|_archive/.test(n));
  if (sessionDirs.length) {
    issues.push({
      level: 'warn',
      msg: `session residue dirs still active: ${sessionDirs.join(', ')} — run purge`,
    });
  }
  return {
    ok: issues.filter((i) => i.level === 'error').length === 0,
    issues,
    present: ok,
    version: manifest.version,
  };
}

/**
 * Hard-delete ontology violations / bloat. No archives — gone means gone.
 */
function purge(manifest, { dryRun = false } = {}) {
  const deleted = [];
  const skipped = [];

  // Never keep an archive tree
  const archivePath = join(AGENTS, '_archive');
  if (existsSync(archivePath)) {
    const size = dirSize(archivePath);
    if (!dryRun) rmSync(archivePath, { recursive: true, force: true });
    deleted.push({ name: '_archive', bytes: size.bytes, files: size.files, action: 'rm' });
  }

  for (const name of manifest.bloat_globs || []) {
    const src = join(AGENTS, name);
    if (!existsSync(src)) {
      skipped.push({ name, reason: 'absent' });
      continue;
    }
    if (name === 'AGENTS.md' || name === 'ONTOLOGY.md' || name === 'ontology.manifest.json') {
      skipped.push({ name, reason: 'protected' });
      continue;
    }
    const size = dirSize(src);
    if (dryRun) {
      deleted.push({ name, bytes: size.bytes, files: size.files, dry: true });
      continue;
    }
    rmSync(src, { recursive: true, force: true });
    deleted.push({ name, bytes: size.bytes, files: size.files, action: 'rm' });
  }

  // wiki: keep only README
  const wiki = join(AGENTS, 'wiki');
  if (existsSync(wiki)) {
    for (const ent of readdirSync(wiki, { withFileTypes: true })) {
      if (ent.name === 'README.md') continue;
      const src = join(wiki, ent.name);
      const size = dirSize(src);
      if (!dryRun) rmSync(src, { recursive: true, force: true });
      deleted.push({ name: `wiki/${ent.name}`, bytes: size.bytes, files: size.files, action: 'rm', dry: dryRun });
    }
  }

  // learnings archive (legacy megadumps)
  const learnArch = join(ROOT, '.learnings', 'archive');
  if (existsSync(learnArch)) {
    const size = dirSize(learnArch);
    if (!dryRun) rmSync(learnArch, { recursive: true, force: true });
    deleted.push({ name: '.learnings/archive', bytes: size.bytes, files: size.files, action: 'rm' });
  }

  const totalBytes = deleted.reduce((s, m) => s + (m.bytes || 0), 0);
  return {
    at: new Date().toISOString(),
    dry_run: dryRun,
    mode: 'hard_delete',
    deleted_count: deleted.length,
    total_bytes: totalBytes,
    total_mb: Math.round((totalBytes / 1e6) * 100) / 100,
    deleted,
    skipped,
  };
}

async function tursoHealth() {
  loadEnv();
  const url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || '';
  if (!url) return { ok: false, mode: 'none', msg: 'no TURSO_DATABASE_URL' };
  try {
    const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
    const isFile = String(url).startsWith('file:');
    const client = createClient({
      url,
      ...(authToken && !isFile ? { authToken } : {}),
    });
    let lessons = 0;
    try {
      const r = await client.execute('SELECT COUNT(*) AS n FROM learn_lessons');
      lessons = Number(r.rows[0]?.n || 0);
    } catch {
      lessons = -1;
    }
    return {
      ok: true,
      mode: isFile ? 'file' : 'remote',
      url_host: isFile ? url : String(url).replace(/^libsql:\/\//, '').split('/')[0],
      lessons,
    };
  } catch (err) {
    return { ok: false, mode: 'error', msg: err.message };
  }
}

function graphHealth() {
  const g = join(ROOT, 'graphify-out', 'graph.json');
  if (!existsSync(g)) return { ok: false, msg: 'graph.json missing — npm run graph:update' };
  const st = statSync(g);
  const ageH = (Date.now() - st.mtimeMs) / 36e5;
  let nodes = null;
  try {
    const raw = JSON.parse(readFileSync(g, 'utf8'));
    nodes = Array.isArray(raw.nodes) ? raw.nodes.length : raw.graph?.nodes?.length || null;
  } catch {
    /* ignore */
  }
  return {
    ok: true,
    bytes: st.size,
    age_hours: Math.round(ageH * 10) / 10,
    stale: ageH > 72,
    nodes,
    policy: 'use npm run graph:query — never dump report',
  };
}

function entireAuthHealth() {
  const r = spawnSync('entire', ['auth', 'status'], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  const text = `${r.stdout || ''}${r.stderr || ''}`;
  const loggedIn = /logged in/i.test(text) && !/not logged in/i.test(text);
  return {
    ok: loggedIn,
    detail: text.trim().slice(0, 160) || 'entire not available',
    note: loggedIn
      ? 'checkpoints may feed real lessons'
      : 'not logged in — do NOT invent git skills; use Turso + learning-loop only',
  };
}

/**
 * Root-cause toolchain check: bare `bash` must be real Git Bash, not WSL System32 stub.
 * Symptom wrappers are not a substitute — see .agents/governance/ROOT_CAUSE.md
 *
 * On Windows, prefer Machine+User registry PATH (login truth) over a stale process PATH
 * (agents/IDEs often inherit a pre-fix environment).
 */
function bashHealth() {
  if (process.platform !== 'win32') {
    const r = spawnSync('bash', ['--version'], {
      encoding: 'utf8',
      windowsHide: true,
    });
    const out = `${r.stdout || ''}${r.stderr || ''}`;
    return {
      ok: r.status === 0 && /GNU bash/i.test(out),
      resolved: 'bash (PATH)',
      version: out.split(/\n/)[0]?.trim() || null,
      note: r.status === 0 ? 'ok' : 'bash missing or broken on PATH',
    };
  }

  // Login-environment PATH (Machine then User) — the root-cause surface for new shells/Claude
  let registryPath = process.env.Path || process.env.PATH || '';
  try {
    const { spawnSync: sp } = { spawnSync };
    const ps = sp(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        "[Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')",
      ],
      { encoding: 'utf8', windowsHide: true, timeout: 8000 },
    );
    if (ps.status === 0 && (ps.stdout || '').trim()) {
      registryPath = ps.stdout.trim();
    }
  } catch {
    /* keep process path */
  }

  const env = { ...process.env, Path: registryPath, PATH: registryPath };
  const where = spawnSync('where.exe', ['bash'], {
    encoding: 'utf8',
    windowsHide: true,
    env,
  });
  const lines = (where.stdout || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const first = lines[0] || '';
  const bad =
    /\\system32\\bash\.exe$/i.test(first) ||
    /\\windowsapps\\bash\.exe$/i.test(first) ||
    /\\syswow64\\bash\.exe$/i.test(first);
  const ver = spawnSync('bash', ['--version'], {
    encoding: 'utf8',
    windowsHide: true,
    env,
  });
  const vOut = `${ver.stdout || ''}${ver.stderr || ''}`;
  const gnu = /GNU bash/i.test(vOut);
  const ok = Boolean(first) && !bad && gnu && ver.status === 0;
  return {
    ok,
    resolved: first || null,
    all: lines.slice(0, 5),
    version: vOut.split(/\n/)[0]?.trim() || null,
    note: ok
      ? 'bare bash is real Git Bash (Machine PATH lists Git\\bin before System32)'
      : 'ROOT CAUSE: bare bash is WSL/WindowsApps stub or broken — Admin: scripts/fix-windows-bash-path.ps1; then restart shells; never soft-skip hooks',
    policy: '.agents/governance/ROOT_CAUSE.md',
  };
}

function recommendationsSnippet() {
  const p = join(ROOT, '.learnings', 'RECOMMENDATIONS.md');
  if (!existsSync(p)) return null;
  const text = readFileSync(p, 'utf8');
  return text.split(/\n/).slice(0, 40).join('\n');
}

function domainAgentsHealth() {
  const regPath = join(AGENTS, 'domains', 'REGISTRY.json');
  if (!existsSync(regPath)) return { ok: false, msg: 'domains/REGISTRY.json missing' };
  let reg;
  try {
    reg = JSON.parse(readFileSync(regPath, 'utf8'));
  } catch {
    return { ok: false, msg: 'REGISTRY.json invalid' };
  }
  const agents = [];
  for (const a of reg.agents || []) {
    const dir = join(ROOT, String(a.path || '').replace(/\//g, sep));
    const statePath = join(dir, 'state.json');
    const promptPath = join(dir, 'SYSTEM_PROMPT.md');
    const errorsPath = join(dir, 'learnings', 'errors.json');
    const successesPath = join(dir, 'learnings', 'successes.json');
    let state = null;
    if (existsSync(statePath)) {
      try {
        state = JSON.parse(readFileSync(statePath, 'utf8'));
      } catch {
        state = null;
      }
    }
    agents.push({
      id: a.id,
      has_prompt: existsSync(promptPath),
      has_state: existsSync(statePath),
      has_errors: existsSync(errorsPath),
      has_successes: existsSync(successesPath),
      status: state?.status || 'unknown',
      errors: state?.counters?.errors ?? null,
      successes: state?.counters?.successes ?? null,
      last_synced_at: state?.last_synced_at || null,
    });
  }
  const incomplete = agents.filter((x) => !x.has_prompt || !x.has_state || !x.has_errors || !x.has_successes);
  return {
    ok: incomplete.length === 0,
    count: agents.length,
    incomplete: incomplete.map((x) => x.id),
    agents,
  };
}

async function health(manifest) {
  const v = validate(manifest);
  const graph = graphHealth();
  const turso = await tursoHealth();
  const entire = entireAuthHealth();
  const bash = bashHealth();
  const domains = domainAgentsHealth();
  const agentsSize = dirSize(AGENTS);
  const archiveSize = dirSize(join(AGENTS, '_archive'));

  const actions = [];
  if (!v.ok) actions.push('fix required ontology files');
  if (v.issues.some((i) => /purge|residue|dashboard/i.test(i.msg))) {
    actions.push('npm run agentos:purge');
  }
  if (!domains.ok) actions.push('npm run domain:scaffold');
  if (!graph.ok || graph.stale) actions.push('npm run graph:update');
  if (!turso.ok) actions.push('set TURSO_* or accept file:./.agents/agent-os.db');
  if (!bash.ok) {
    actions.push(
      'ROOT CAUSE: fix bash PATH — powershell -ExecutionPolicy Bypass -File scripts/fix-windows-bash-path.ps1 (Admin); never soft-skip hooks',
    );
  }
  if (!entire.ok) actions.push('optional: entire login (never fake lessons without it)');
  actions.push('npm run domain:sync -- all');
  actions.push('npm run learn:recommend');

  return {
    at: new Date().toISOString(),
    ontology_version: manifest.version,
    validate: v,
    graph,
    turso,
    entire,
    bash,
    domains,
    footprint: {
      agents_mb: Math.round((agentsSize.bytes / 1e6) * 100) / 100,
      agents_files: agentsSize.files,
      archive_mb: Math.round((archiveSize.bytes / 1e6) * 100) / 100,
    },
    proactive_actions: actions,
    cold_start: manifest.cold_start,
    orchestrator: '.agents/domains/ORCHESTRATOR.md',
    governance: {
      root_cause: '.agents/governance/ROOT_CAUSE.md',
      iron_law: 12,
    },
  };
}

async function improve(manifest) {
  const h = await health(manifest);
  // optional: run learn recommend if script exists
  const rec = spawnSync(
    process.execPath,
    [join(ROOT, 'scripts/learn-pipeline.mjs'), '--recommend'],
    { cwd: ROOT, encoding: 'utf8', windowsHide: true, timeout: 120000 }
  );
  const evolveDry = spawnSync(
    process.execPath,
    [join(ROOT, 'scripts/evolve-skills.mjs'), '--dry-run'],
    { cwd: ROOT, encoding: 'utf8', windowsHide: true, timeout: 60000 }
  );
  const evalDry = spawnSync(
    process.execPath,
    [join(ROOT, 'scripts/evaluate-skills.mjs'), '--dry-run'],
    { cwd: ROOT, encoding: 'utf8', windowsHide: true, timeout: 60000 }
  );

  return {
    health: h,
    recommend_ok: rec.status === 0,
    recommend_tail: (rec.stdout || rec.stderr || '').slice(-800),
    evolve_dry_tail: (evolveDry.stdout || evolveDry.stderr || '').slice(-400),
    evaluate_dry_tail: (evalDry.stdout || evalDry.stderr || '').slice(-400),
    next: h.proactive_actions,
  };
}

function coldStart(manifest) {
  return {
    version: manifest.version,
    load_only: [
      '.agents/AGENTS.md (kernel)',
      '.agents/ONTOLOGY.md (if unsure where truth lives)',
      '.learnings/ERRORS_INDEX.md',
      'npm run graph:query -- "<task>"',
      'npm run learn:recommend',
    ],
    never_load: [
      'graphify-out/GRAPH_REPORT.md',
      'bulk .agents/wiki',
      'vendor skill packs wholesale',
      'hub_db full task dump unless executing harness',
      'any _archive or session residue dirs (must not exist)',
    ],
    loops: manifest.loops,
  };
}

async function main() {
  const cmd = process.argv[2] || 'status';
  const dry = process.argv.includes('--dry-run');
  const manifest = loadManifest();

  if (cmd === 'validate') {
    const r = validate(manifest);
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  }
  if (cmd === 'purge') {
    const r = purge(manifest, { dryRun: dry });
    console.log(JSON.stringify(r, null, 2));
    return;
  }
  if (cmd === 'health' || cmd === 'status') {
    const r = await health(manifest);
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.validate.ok ? 0 : 1);
  }
  if (cmd === 'improve') {
    const r = await improve(manifest);
    console.log(JSON.stringify(r, null, 2));
    return;
  }
  if (cmd === 'cold-start') {
    console.log(JSON.stringify(coldStart(manifest), null, 2));
    return;
  }
  console.error(
    'Usage: agent-os-ontology.mjs <status|validate|purge|health|improve|cold-start> [--dry-run]'
  );
  process.exit(2);
}

main().catch((err) => {
  console.error('[ontology]', err);
  process.exit(1);
});
