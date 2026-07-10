#!/usr/bin/env node
/**
 * Domain agents — specialist packages with state, errors, successes + Turso sync.
 *
 *   node scripts/domain-agent.mjs list|scaffold|compile [id|all]
 *   node scripts/domain-agent.mjs show|prompt|status <id>
 *   node scripts/domain-agent.mjs route <path>
 *   node scripts/domain-agent.mjs enforce <id> --files a,b
 *   node scripts/domain-agent.mjs error <id> --title t --error e [--command c]
 *   node scripts/domain-agent.mjs success <id> --title t [--detail d] [--command c]
 *   node scripts/domain-agent.mjs learn <id> ...   (alias of error)
 *   node scripts/domain-agent.mjs state <id> [--set key=value ...]
 *   node scripts/domain-agent.mjs sync [id|all]    push local → Turso
 *   node scripts/domain-agent.mjs pull [id|all]    pull Turso → local
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from 'node:fs';
import { join, sep } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { createClient } from '@libsql/client';
import { config as loadDotenv } from 'dotenv';
import { applyLearningSchema } from './turso-learning-schema.mjs';

const ROOT = process.cwd();
const REGISTRY_PATH = join(ROOT, '.agents', 'domains', 'REGISTRY.json');

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    if (existsSync(join(ROOT, f))) loadDotenv({ path: join(ROOT, f), override: false });
  }
}

function loadRegistry() {
  if (!existsSync(REGISTRY_PATH)) throw new Error('Missing .agents/domains/REGISTRY.json');
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
}

function normPath(p) {
  return String(p || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\//, '');
}

function matchGlob(pattern, filePath) {
  const pat = normPath(pattern);
  const file = normPath(filePath);
  if (pat === file) return true;
  let re = '^';
  for (let i = 0; i < pat.length; i++) {
    const c = pat[i];
    if (c === '*' && pat[i + 1] === '*') {
      re += '.*';
      i++;
      if (pat[i + 1] === '/') {
        i++;
        re += '.*?';
      }
    } else if (c === '*') {
      re += '[^/]*';
    } else if ('.+^${}()|[]\\'.includes(c)) {
      re += '\\' + c;
    } else {
      re += c;
    }
  }
  re += '$';
  re = re.replace(/\.\*\.\*\?\//g, '(?:.*/)?');
  try {
    return new RegExp(re).test(file);
  } catch {
    return false;
  }
}

function pathAllowed(agent, filePath) {
  const file = normPath(filePath);
  const j = agent.jurisdiction || {};
  for (const g of j.deny_globs || []) {
    if (matchGlob(g, file)) return { ok: false, reason: `denied by ${g}` };
  }
  const allow = j.allow_globs || [];
  if (!allow.length) return { ok: false, reason: 'no allow_globs' };
  for (const g of allow) {
    if (matchGlob(g, file)) return { ok: true, reason: `allowed by ${g}` };
  }
  return { ok: false, reason: 'outside jurisdiction' };
}

function findOwners(registry, filePath) {
  const owners = [];
  for (const a of registry.agents) {
    const r = pathAllowed(a, filePath);
    if (r.ok) owners.push({ id: a.id, name: a.name, ...r });
  }
  return owners;
}

function agentDir(agent) {
  return join(ROOT, agent.path.replace(/\//g, sep));
}

function nowIso() {
  return new Date().toISOString();
}

function defaultState(agent) {
  return {
    domain_id: agent.id,
    name: agent.name,
    status: 'idle',
    version: '2.0.0',
    last_task: null,
    last_error_id: null,
    last_success_id: null,
    last_error_at: null,
    last_success_at: null,
    last_synced_at: null,
    counters: { errors: 0, successes: 0, unique_errors: 0, unique_successes: 0 },
    current: { task: null, files: [], started_at: null },
    updated_at: nowIso(),
  };
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(path, obj) {
  writeFileSync(path, JSON.stringify(obj, null, 2), 'utf8');
}

function pathsFor(agent) {
  const dir = agentDir(agent);
  return {
    dir,
    state: join(dir, 'state.json'),
    errors: join(dir, 'learnings', 'errors.json'),
    successes: join(dir, 'learnings', 'successes.json'),
    errorsMd: join(dir, 'learnings', 'ERRORS.md'),
    errorsIndex: join(dir, 'learnings', 'ERRORS_INDEX.md'),
    successesMd: join(dir, 'learnings', 'SUCCESSES.md'),
    prevention: join(dir, 'learnings', 'PREVENTION.md'),
    index: join(dir, 'learnings', 'index.json'),
    meta: join(dir, 'metadata.json'),
    agentMd: join(dir, 'AGENT.md'),
    systemPrompt: join(dir, 'SYSTEM_PROMPT.md'),
  };
}

function loadState(agent) {
  const p = pathsFor(agent);
  return readJson(p.state, defaultState(agent));
}

function saveState(agent, state) {
  state.updated_at = nowIso();
  writeJson(pathsFor(agent).state, state);
  return state;
}

function loadLedger(path) {
  return readJson(path, {
    version: 1,
    updated_at: null,
    events: {},
    stats: { total: 0, unique: 0 },
  });
}

function fingerprint(parts) {
  return createHash('sha256').update(parts.join('|')).digest('hex').slice(0, 16);
}

function rebuildErrorViews(agent, ledger) {
  const p = pathsFor(agent);
  const rows = Object.values(ledger.events || {})
    .sort((a, b) => (b.last_seen || '').localeCompare(a.last_seen || ''))
    .slice(0, 30);
  const idx = `---
type: ledger
title: ${agent.id} errors index
domain: ${agent.id}
updated: ${ledger.updated_at || nowIso()}
---

# ${agent.name} — errors

| ID | Title | Count | Last |
|----|-------|------:|------|
${rows.map((r) => `| ${r.id} | ${String(r.title).replace(/\|/g, '/')} | ${r.count} | ${(r.last_seen || '').slice(0, 10)} |`).join('\n') || '| — | none | 0 | — |'}

## Details

${rows
  .map(
    (r) => `### ${r.id} — ${r.title}
- count: ${r.count}
- command: \`${r.command || ''}\`
- error: ${r.detail || ''}
`
  )
  .join('\n') || '_No errors yet._'}
`;
  writeFileSync(p.errorsIndex, idx, 'utf8');
  writeFileSync(
    p.errorsMd,
    `---
type: ledger
title: ${agent.id} errors
domain: ${agent.id}
---

# Errors (${agent.id})

See ERRORS_INDEX.md. Machine: errors.json → Turso domain_events kind=error.
`,
    'utf8'
  );
}

function rebuildSuccessViews(agent, ledger) {
  const p = pathsFor(agent);
  const rows = Object.values(ledger.events || {})
    .sort((a, b) => (b.last_seen || '').localeCompare(a.last_seen || ''))
    .slice(0, 30);
  writeFileSync(
    p.successesMd,
    `---
type: ledger
title: ${agent.id} successes
domain: ${agent.id}
updated: ${ledger.updated_at || nowIso()}
---

# ${agent.name} — successes

| ID | Title | Count | Last |
|----|-------|------:|------|
${rows.map((r) => `| ${r.id} | ${String(r.title).replace(/\|/g, '/')} | ${r.count} | ${(r.last_seen || '').slice(0, 10)} |`).join('\n') || '| — | none | 0 | — |'}

## Details

${rows
  .map(
    (r) => `### ${r.id} — ${r.title}
- count: ${r.count}
- command: \`${r.command || ''}\`
- detail: ${r.detail || ''}
`
  )
  .join('\n') || '_No successes yet._'}
`,
    'utf8'
  );
}

function refreshStateCounters(agent) {
  const p = pathsFor(agent);
  const state = loadState(agent);
  const errors = loadLedger(p.errors);
  const successes = loadLedger(p.successes);
  state.counters = {
    errors: errors.stats?.total || 0,
    successes: successes.stats?.total || 0,
    unique_errors: Object.keys(errors.events || {}).length,
    unique_successes: Object.keys(successes.events || {}).length,
  };
  return saveState(agent, state);
}

function ensureAgentScaffold(agent) {
  const p = pathsFor(agent);
  for (const d of [p.dir, join(p.dir, 'rules'), join(p.dir, 'skills'), join(p.dir, 'learnings')]) {
    mkdirSync(d, { recursive: true });
  }

  writeJson(p.meta, {
    id: agent.id,
    name: agent.name,
    version: '2.0.0',
    jurisdiction: agent.jurisdiction,
    mcps: agent.mcps || [],
    skills: agent.skills || [],
    learnings: agent.learnings,
    state_file: 'state.json',
    errors_file: 'learnings/errors.json',
    successes_file: 'learnings/successes.json',
    turso_tables: ['domain_agent_state', 'domain_events'],
  });

  if (!existsSync(p.state)) writeJson(p.state, defaultState(agent));
  if (!existsSync(p.errors)) writeJson(p.errors, loadLedger(p.errors));
  if (!existsSync(p.successes)) writeJson(p.successes, loadLedger(p.successes));

  if (!existsSync(p.agentMd)) {
    writeFileSync(
      p.agentMd,
      `---
type: domain-agent
id: ${agent.id}
title: ${agent.name}
---

# ${agent.name}

Specialist domain agent. Jurisdiction + MCPs + skills in \`metadata.json\`.

## Memory (this folder only)

| File | Purpose |
|------|---------|
| \`state.json\` | Live status, counters, current task |
| \`learnings/errors.json\` + ERRORS_* | Failures |
| \`learnings/successes.json\` + SUCCESSES.md | Wins |
| \`learnings/PREVENTION.md\` | Rules from errors |

Sync: \`npm run domain:sync -- ${agent.id}\` → Turso.

## Loop

1. Load SYSTEM_PROMPT.md + state.json + ERRORS_INDEX
2. graph:query in domain
3. Edit only allow_globs
4. domain:enforce before done
5. domain:error or domain:success
6. domain:sync
`,
      'utf8'
    );
  }

  writeFileSync(
    join(p.dir, 'rules', '00-jurisdiction.md'),
    `---
type: constraint
title: Jurisdiction
severity: critical
---

# Jurisdiction

Allow:
${(agent.jurisdiction?.allow_globs || []).map((g) => `- ${g}`).join('\n')}

Deny:
${(agent.jurisdiction?.deny_globs || []).map((g) => `- ${g}`).join('\n')}
`,
    'utf8'
  );

  if (!existsSync(p.prevention)) {
    writeFileSync(
      p.prevention,
      `---
type: policy
title: ${agent.id} prevention
domain: ${agent.id}
---

# Prevention (${agent.id})
`,
      'utf8'
    );
  }

  // compat index
  writeJson(p.index, {
    version: 2,
    domain: agent.id,
    note: 'compat: prefer errors.json + successes.json',
    updated_at: nowIso(),
  });

  rebuildErrorViews(agent, loadLedger(p.errors));
  rebuildSuccessViews(agent, loadLedger(p.successes));
  refreshStateCounters(agent);
  return p.dir;
}

function compilePrompt(agent) {
  ensureAgentScaffold(agent);
  const p = pathsFor(agent);
  const parts = [];
  if (existsSync(p.agentMd)) parts.push(readFileSync(p.agentMd, 'utf8'));

  const state = loadState(agent);
  parts.push(`\n\n---\n# Live state\n\n\`\`\`json\n${JSON.stringify(state, null, 2)}\n\`\`\`\n`);

  const rulesDir = join(p.dir, 'rules');
  if (existsSync(rulesDir)) {
    for (const f of readdirSync(rulesDir).filter((x) => x.endsWith('.md') && x !== 'README.md').sort()) {
      parts.push(`\n\n---\n# Rule: ${f}\n\n` + readFileSync(join(rulesDir, f), 'utf8'));
    }
  }

  if (existsSync(p.errorsIndex)) {
    const t = readFileSync(p.errorsIndex, 'utf8');
    if (!/_No errors yet_/.test(t)) parts.push(`\n\n---\n# Recent errors\n\n` + t.slice(0, 3500));
  }
  if (existsSync(p.successesMd)) {
    const t = readFileSync(p.successesMd, 'utf8');
    if (!/_No successes yet_/.test(t)) parts.push(`\n\n---\n# Recent successes\n\n` + t.slice(0, 2500));
  }
  if (existsSync(p.prevention)) parts.push(`\n\n---\n` + readFileSync(p.prevention, 'utf8').slice(0, 2500));

  const header = `# SYSTEM PROMPT — ${agent.name} (${agent.id})
# domain-agent compile · state+errors+successes · Turso sync
# MCPs: ${(agent.mcps || []).join(', ') || 'none'}
# Skills: ${(agent.skills || []).join(', ') || 'none'}

You only write files in your jurisdiction. Record errors/successes in this domain package, then sync Turso.

`;
  writeFileSync(p.systemPrompt, header + parts.join('\n'), 'utf8');
  return p.systemPrompt;
}

function recordEvent(agent, kind, { title, detail, command, metadata }) {
  ensureAgentScaffold(agent);
  const p = pathsFor(agent);
  const path = kind === 'success' ? p.successes : p.errors;
  const ledger = loadLedger(path);
  const fp = fingerprint([agent.id, kind, title, detail]);
  const now = nowIso();
  const idPrefix = kind === 'success' ? 'OK' : 'ERR';

  if (ledger.events[fp]) {
    ledger.events[fp].count += 1;
    ledger.events[fp].last_seen = now;
    ledger.stats.total += 1;
  } else {
    ledger.events[fp] = {
      id: `DOM-${agent.id}-${idPrefix}-${fp.slice(0, 8)}`,
      fingerprint: fp,
      kind,
      title: String(title || 'untitled').slice(0, 200),
      detail: String(detail || '').slice(0, 2000),
      command: String(command || '').slice(0, 300),
      count: 1,
      first_seen: now,
      last_seen: now,
      domain: agent.id,
      metadata: metadata || null,
    };
    ledger.stats.unique = Object.keys(ledger.events).length;
    ledger.stats.total += 1;
  }
  ledger.updated_at = now;
  writeJson(path, ledger);

  if (kind === 'error') {
    rebuildErrorViews(agent, ledger);
    const prev = existsSync(p.prevention) ? readFileSync(p.prevention, 'utf8') : '';
    const marker = `<!-- fp:${fp} -->`;
    if (!prev.includes(marker)) {
      writeFileSync(
        p.prevention,
        prev +
          `\n${marker}\n### ${title}\n- **Rule:** Fix in jurisdiction; re-verify; domain:success when done.\n- **Last:** ${now}\n`,
        'utf8'
      );
    }
  } else {
    rebuildSuccessViews(agent, ledger);
  }

  const state = loadState(agent);
  if (kind === 'error') {
    state.status = 'error';
    state.last_error_id = ledger.events[fp].id;
    state.last_error_at = now;
    state.last_task = title;
  } else {
    state.status = 'success';
    state.last_success_id = ledger.events[fp].id;
    state.last_success_at = now;
    state.last_task = title;
    state.current = { task: null, files: [], started_at: null };
  }
  saveState(agent, state);
  refreshStateCounters(agent);
  compilePrompt(agent);
  return ledger.events[fp];
}

async function tursoClient() {
  loadEnv();
  let url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || '';
  if (!url) url = 'file:./.agents/agent-os.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
  const isFile = String(url).startsWith('file:');
  const client = createClient({
    url,
    ...(authToken && !isFile ? { authToken } : {}),
  });
  await applyLearningSchema(client);
  return { client, url, isFile };
}

async function syncDomain(agent) {
  ensureAgentScaffold(agent);
  const p = pathsFor(agent);
  const state = loadState(agent);
  const errors = loadLedger(p.errors);
  const successes = loadLedger(p.successes);
  const { client, url, isFile } = await tursoClient();
  const now = nowIso();

  await client.execute({
    sql: `INSERT INTO domain_agent_state
      (domain_id, name, status, last_task, last_error_at, last_success_at, error_count, success_count, payload, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(domain_id) DO UPDATE SET
        name=excluded.name,
        status=excluded.status,
        last_task=excluded.last_task,
        last_error_at=excluded.last_error_at,
        last_success_at=excluded.last_success_at,
        error_count=excluded.error_count,
        success_count=excluded.success_count,
        payload=excluded.payload,
        updated_at=excluded.updated_at`,
    args: [
      agent.id,
      agent.name,
      state.status || 'idle',
      state.last_task,
      state.last_error_at,
      state.last_success_at,
      state.counters?.errors || 0,
      state.counters?.successes || 0,
      JSON.stringify(state),
      now,
    ],
  });

  let upserted = 0;
  for (const [kind, ledger] of [
    ['error', errors],
    ['success', successes],
  ]) {
    for (const ev of Object.values(ledger.events || {})) {
      const id = `${agent.id}:${kind}:${ev.fingerprint}`;
      await client.execute({
        sql: `INSERT INTO domain_events
          (id, domain_id, kind, fingerprint, title, detail, command, times_seen, first_seen_at, last_seen_at, metadata)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(domain_id, kind, fingerprint) DO UPDATE SET
            title=excluded.title,
            detail=excluded.detail,
            command=excluded.command,
            times_seen=excluded.times_seen,
            last_seen_at=excluded.last_seen_at,
            metadata=excluded.metadata`,
        args: [
          id,
          agent.id,
          kind,
          ev.fingerprint,
          ev.title,
          ev.detail || '',
          ev.command || '',
          ev.count || 1,
          ev.first_seen || now,
          ev.last_seen || now,
          ev.metadata ? JSON.stringify(ev.metadata) : null,
        ],
      });
      upserted += 1;
    }
  }

  // Also mirror errors into learn_lessons with domain category for global recommend
  for (const ev of Object.values(errors.events || {})) {
    const fp = `dom:${agent.id}:${ev.fingerprint}`;
    await client.execute({
      sql: `INSERT INTO learn_lessons
        (fingerprint, category, title, prevention, severity, healable, times_seen, times_helped,
         last_seen_at, first_seen_at, skill_path, workflow_path, status, evidence)
       VALUES (?, ?, ?, ?, 'medium', 0, ?, 0, ?, ?, NULL, NULL, 'active', ?)
       ON CONFLICT(fingerprint) DO UPDATE SET
         times_seen = excluded.times_seen,
         last_seen_at = excluded.last_seen_at,
         title = excluded.title,
         prevention = excluded.prevention,
         evidence = excluded.evidence`,
      args: [
        fp,
        `domain:${agent.id}`,
        `[${agent.id}] ${ev.title}`,
        `Domain ${agent.id}: fix in jurisdiction; see .agents/domains/${agent.id}/learnings/`,
        ev.count || 1,
        ev.last_seen || now,
        ev.first_seen || now,
        JSON.stringify({ domain: agent.id, command: ev.command, detail: ev.detail }),
      ],
    });
  }

  state.last_synced_at = now;
  saveState(agent, state);

  return {
    ok: true,
    domain: agent.id,
    events_upserted: upserted,
    turso: { url: isFile ? url : String(url).slice(0, 48), is_file: isFile },
    counters: state.counters,
  };
}

async function pullDomain(agent) {
  ensureAgentScaffold(agent);
  const p = pathsFor(agent);
  const { client, url, isFile } = await tursoClient();

  const st = await client.execute({
    sql: 'SELECT * FROM domain_agent_state WHERE domain_id = ?',
    args: [agent.id],
  });
  if (st.rows.length) {
    const row = st.rows[0];
    let payload = {};
    try {
      payload = JSON.parse(row.payload || '{}');
    } catch {
      payload = defaultState(agent);
    }
    payload.domain_id = agent.id;
    payload.name = row.name || agent.name;
    payload.status = row.status;
    payload.last_task = row.last_task;
    payload.last_error_at = row.last_error_at;
    payload.last_success_at = row.last_success_at;
    payload.last_synced_at = nowIso();
    payload.counters = {
      ...(payload.counters || {}),
      errors: Number(row.error_count || 0),
      successes: Number(row.success_count || 0),
    };
    saveState(agent, payload);
  }

  const ev = await client.execute({
    sql: 'SELECT * FROM domain_events WHERE domain_id = ?',
    args: [agent.id],
  });
  const errors = loadLedger(p.errors);
  const successes = loadLedger(p.successes);
  for (const row of ev.rows) {
    const ledger = row.kind === 'success' ? successes : errors;
    const fp = row.fingerprint;
    ledger.events[fp] = {
      id: row.id,
      fingerprint: fp,
      kind: row.kind,
      title: row.title,
      detail: row.detail || '',
      command: row.command || '',
      count: Number(row.times_seen || 1),
      first_seen: row.first_seen_at,
      last_seen: row.last_seen_at,
      domain: agent.id,
    };
  }
  errors.stats = {
    total: Object.values(errors.events).reduce((s, e) => s + (e.count || 0), 0),
    unique: Object.keys(errors.events).length,
  };
  successes.stats = {
    total: Object.values(successes.events).reduce((s, e) => s + (e.count || 0), 0),
    unique: Object.keys(successes.events).length,
  };
  errors.updated_at = nowIso();
  successes.updated_at = nowIso();
  writeJson(p.errors, errors);
  writeJson(p.successes, successes);
  rebuildErrorViews(agent, errors);
  rebuildSuccessViews(agent, successes);
  refreshStateCounters(agent);
  compilePrompt(agent);

  return {
    ok: true,
    domain: agent.id,
    events: ev.rows.length,
    turso: { url: isFile ? url : String(url).slice(0, 48), is_file: isFile },
  };
}

function parseArgs(argv) {
  const out = {
    _: [],
    files: null,
    title: null,
    error: null,
    detail: null,
    command: null,
    set: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--files') out.files = (argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--title') out.title = argv[++i];
    else if (a === '--error') out.error = argv[++i];
    else if (a === '--detail') out.detail = argv[++i];
    else if (a === '--command') out.command = argv[++i];
    else if (a === '--set') out.set.push(argv[++i] || '');
    else out._.push(a);
  }
  return out;
}

function getAgent(registry, id) {
  const a = registry.agents.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown agent ${id}. Run: domain-agent list`);
  return a;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0] || 'list';
  const registry = loadRegistry();

  if (cmd === 'list') {
    const agents = registry.agents.map((a) => {
      ensureAgentScaffold(a);
      const st = loadState(a);
      return {
        id: a.id,
        name: a.name,
        status: st.status,
        errors: st.counters?.errors || 0,
        successes: st.counters?.successes || 0,
        last_synced_at: st.last_synced_at,
        path: a.path,
      };
    });
    console.log(JSON.stringify({ version: registry.version, agents }, null, 2));
    return;
  }

  if (cmd === 'scaffold') {
    const prompts = registry.agents.map((a) => {
      ensureAgentScaffold(a);
      return compilePrompt(a);
    });
    console.log(JSON.stringify({ ok: true, agents: prompts.length }, null, 2));
    return;
  }

  if (cmd === 'compile') {
    const id = args._[1] || 'all';
    if (id === 'all') {
      console.log(
        JSON.stringify(
          { ok: true, paths: registry.agents.map((a) => compilePrompt(a)) },
          null,
          2
        )
      );
    } else {
      console.log(JSON.stringify({ ok: true, path: compilePrompt(getAgent(registry, id)) }, null, 2));
    }
    return;
  }

  if (cmd === 'show' || cmd === 'status') {
    const a = getAgent(registry, args._[1]);
    ensureAgentScaffold(a);
    const p = pathsFor(a);
    console.log(
      JSON.stringify(
        {
          agent: a,
          state: loadState(a),
          errors: loadLedger(p.errors).stats,
          successes: loadLedger(p.successes).stats,
          files: {
            state: 'state.json',
            errors: 'learnings/errors.json',
            successes: 'learnings/successes.json',
          },
        },
        null,
        2
      )
    );
    return;
  }

  if (cmd === 'route') {
    const file = args._[1];
    if (!file) throw new Error('Usage: domain-agent route <path>');
    const owners = findOwners(registry, file);
    console.log(
      JSON.stringify(
        {
          file: normPath(file),
          owners,
          primary: owners[0]?.id || null,
          handoff:
            owners.length === 0
              ? 'No domain owns this path'
              : `Dispatch to ${owners[0].id}`,
        },
        null,
        2
      )
    );
    return;
  }

  if (cmd === 'prompt') {
    const a = getAgent(registry, args._[1]);
    process.stdout.write(readFileSync(compilePrompt(a), 'utf8'));
    return;
  }

  if (cmd === 'enforce') {
    const a = getAgent(registry, args._[1]);
    const files = args.files || args._.slice(2);
    if (!files.length) throw new Error('Usage: enforce <id> --files a,b');
    const results = files.map((f) => ({ file: f, ...pathAllowed(a, f) }));
    const ok = results.every((r) => r.ok);
    console.log(JSON.stringify({ agent: a.id, results, ok }, null, 2));
    if (!ok) process.exit(1);
    return;
  }

  if (cmd === 'error' || cmd === 'learn') {
    const a = getAgent(registry, args._[1]);
    if (!args.title || !args.error) {
      throw new Error('Usage: error <id> --title t --error e [--command c]');
    }
    const ev = recordEvent(a, 'error', {
      title: args.title,
      detail: args.error,
      command: args.command,
    });
    console.log(JSON.stringify({ ok: true, kind: 'error', event: ev, state: loadState(a) }, null, 2));
    return;
  }

  if (cmd === 'success') {
    const a = getAgent(registry, args._[1]);
    if (!args.title) throw new Error('Usage: success <id> --title t [--detail d] [--command c]');
    const ev = recordEvent(a, 'success', {
      title: args.title,
      detail: args.detail || args.error || 'ok',
      command: args.command,
    });
    console.log(JSON.stringify({ ok: true, kind: 'success', event: ev, state: loadState(a) }, null, 2));
    return;
  }

  if (cmd === 'state') {
    const a = getAgent(registry, args._[1]);
    ensureAgentScaffold(a);
    let state = loadState(a);
    if (args.set.length) {
      for (const pair of args.set) {
        const i = pair.indexOf('=');
        if (i === -1) continue;
        const k = pair.slice(0, i);
        const v = pair.slice(i + 1);
        if (k === 'status' || k === 'last_task') state[k] = v;
        else if (k.startsWith('current.')) {
          state.current = state.current || {};
          state.current[k.slice(8)] = v;
        } else {
          state[k] = v;
        }
      }
      state = saveState(a, state);
    }
    console.log(JSON.stringify(state, null, 2));
    return;
  }

  if (cmd === 'sync') {
    const id = args._[1] || 'all';
    const list = id === 'all' ? registry.agents : [getAgent(registry, id)];
    const results = [];
    for (const a of list) results.push(await syncDomain(a));
    console.log(JSON.stringify({ ok: true, results }, null, 2));
    return;
  }

  if (cmd === 'pull') {
    const id = args._[1] || 'all';
    const list = id === 'all' ? registry.agents : [getAgent(registry, id)];
    const results = [];
    for (const a of list) results.push(await pullDomain(a));
    console.log(JSON.stringify({ ok: true, results }, null, 2));
    return;
  }

  console.error(`Usage: domain-agent <list|scaffold|compile|show|status|route|prompt|enforce|error|success|state|sync|pull>`);
  process.exit(2);
}

main().catch((err) => {
  console.error('[domain-agent]', err.message || err);
  process.exit(1);
});
