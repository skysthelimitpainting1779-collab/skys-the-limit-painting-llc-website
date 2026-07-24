#!/usr/bin/env node
/**
 * Zero theater — delete anything in .agents that is not host-native or enforced.
 *
 * KEEP:
 *   specialists.json, skills/, rules/, STACK.md, HOST_NATIVE.md
 *   governance/ROOT_CAUSE.md, governance/ACTIVE_PREVENTION.md
 *   goals/ (real RPI artifacts only — wipe smoke/test)
 *   workflows/ship-loop.md only
 *
 * DELETE: queues, checkpoints, dead-letter, evidence, traces, knowledge,
 *   hub_db, state.json, agent-os.db, ontology novels, empty stubs, smoke goals,
 *   governance spam, architecture-loop workflow theater, etc.
 *
 *   npm run agents:zero-theater
 */
import {
  existsSync,
  rmSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  statSync,
  readFileSync,
} from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const AGENTS = join(ROOT, '.agents');
const deleted = [];

function nuke(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) return;
  let files = 0;
  let bytes = 0;
  const walk = (x) => {
    const st = statSync(x);
    if (st.isDirectory()) {
      for (const n of readdirSync(x)) walk(join(x, n));
    } else {
      files += 1;
      bytes += st.size;
    }
  };
  walk(p);
  rmSync(p, { recursive: true, force: true });
  deleted.push({ path: rel, files, bytes });
}

// --- directories that are pure theater ---
const THEATER_DIRS = [
  '.agents/queues',
  '.agents/checkpoints',
  '.agents/dead-letter',
  '.agents/evidence',
  '.agents/traces',
  '.agents/knowledge',
  '.agents/effects',
  '.agents/waits',
  '.agents/evals',
  '.agents/approvals',
  '.agents/domains',
  '.agents/wiki',
];

for (const d of THEATER_DIRS) nuke(d);

// --- root files theater ---
const THEATER_FILES = [
  '.agents/hub_db.json',
  '.agents/state.json',
  '.agents/agent-os.db',
  '.agents/hooks-state.json',
  '.agents/entire-sync-state.json',
  '.agents/project.md',
  '.agents/ONTOLOGY.md',
  '.agents/ontology.manifest.json',
  '.agents/AGENTS.md', // root AGENTS.md is the only kernel
  '.agents/dashboard.html',
  '.agents/plan.md',
  '.agents/status.md',
  '.agents/tasks.md',
  '.agents/decisions.md',
  '.agents/knowledge.md',
  '.agents/handoff.md',
  '.agents/operating-summary.md',
  '.agents/implementation-contract.md',
  '.agents/runtime-capability-matrix.md',
];

for (const f of THEATER_FILES) nuke(f);

// governance: keep only what hooks/laws reference
const govKeep = new Set(['ROOT_CAUSE.md', 'ACTIVE_PREVENTION.md', 'PREVENTION_RULES.md']);
const gov = join(AGENTS, 'governance');
if (existsSync(gov)) {
  for (const n of readdirSync(gov)) {
    if (!govKeep.has(n)) nuke(join('.agents/governance', n));
  }
}

// workflows: ship-loop only
const wf = join(AGENTS, 'workflows');
if (existsSync(wf)) {
  for (const n of readdirSync(wf)) {
    if (n !== 'ship-loop.md') nuke(join('.agents/workflows', n));
  }
}

// goals: drop smoke test; keep structure
const goals = join(AGENTS, 'goals');
if (existsSync(goals)) {
  for (const n of readdirSync(goals)) {
    if (n === '_eval' || n === '.gitkeep') continue;
    if (/smoke|test|CHK-/i.test(n)) nuke(join('.agents/goals', n));
  }
}

// rules: drop ontology.md theater (specialists + graphify stay)
const rules = join(AGENTS, 'rules');
if (existsSync(rules)) {
  for (const n of readdirSync(rules)) {
    if (n === 'ontology.md') nuke(join('.agents/rules', n));
  }
}

// Minimal STACK + HOST_NATIVE + specialists must remain
// Write lean STACK pointer if missing
if (!existsSync(join(AGENTS, 'STACK.md'))) {
  writeFileSync(
    join(AGENTS, 'STACK.md'),
    `# Stack\n\nNext.js App Router · Vercel · Node 24 · see repo vercel.ts and package.json.\n`,
  );
}

// Minimal health manifest (no ontology novel)
writeFileSync(
  join(AGENTS, 'health.manifest.json'),
  JSON.stringify(
    {
      version: '4.0.0-zero-theater',
      required: [
        'AGENTS.md',
        '.agents/specialists.json',
        '.agents/STACK.md',
        '.agents/skills/ship-loop/SKILL.md',
        '.agents/governance/ROOT_CAUSE.md',
        'scripts/active-prevention.mjs',
        'scripts/compile-host-native.mjs',
        'scripts/goal.mjs',
      ],
      host_native: {
        claude_agents: '.claude/agents',
        cursor_agents: '.cursor/agents',
        codex_agents: '.codex/agents',
        skills_ssot: '.agents/skills',
      },
      forbidden: [
        '.agents/domains',
        '.agents/queues',
        '.agents/hub_db.json',
        '.agents/ONTOLOGY.md',
        '.agents/dashboard.html',
      ],
    },
    null,
    2,
  ) + '\n',
);

writeFileSync(
  join(AGENTS, 'HOST_NATIVE.md'),
  `# Host-native only (zero theater)

| Host | Loads |
|------|--------|
| All | root \`AGENTS.md\` |
| Claude | \`CLAUDE.md\` @AGENTS + \`.claude/agents\` + \`.claude/skills\` |
| Cursor | \`.cursor/rules\` + \`.cursor/agents\` |
| Codex | \`AGENTS.md\` + \`.codex/agents\` + \`.agents/skills\` |
| Antigravity | \`GEMINI.md\` + \`.agents/rules\` + \`.agents/skills\` |
| Copilot | \`.github/copilot-instructions.md\` + \`.github/skills\` |

**SSOT:** \`.agents/specialists.json\` · \`.agents/skills/\`  
**Compile:** \`npm run host:compile\`  
**No** domains/, queues/, hub_db, ontology novels, status mirrors.
`,
);

const totalFiles = deleted.reduce((s, d) => s + d.files, 0);
const totalBytes = deleted.reduce((s, d) => s + d.bytes, 0);

// recount remaining
function countFiles(dir) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  const w = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) w(join(d, e.name));
      else n += 1;
    }
  };
  w(dir);
  return n;
}

const report = {
  at: new Date().toISOString(),
  deleted_paths: deleted.length,
  deleted_files: totalFiles,
  deleted_mb: Math.round((totalBytes / 1e6) * 100) / 100,
  remaining_agents_files: countFiles(AGENTS),
  deleted,
  keep: [
    'specialists.json',
    'skills/',
    'rules/',
    'STACK.md',
    'HOST_NATIVE.md',
    'governance/ROOT_CAUSE.md',
    'governance/ACTIVE_PREVENTION.md',
    'goals/ (real only)',
    'workflows/ship-loop.md',
    'health.manifest.json',
  ],
};

console.log(JSON.stringify(report, null, 2));
mkdirSync(join(AGENTS, 'goals', '_eval'), { recursive: true });
writeFileSync(join(AGENTS, 'goals', '_eval', 'zero-theater-last.json'), JSON.stringify(report, null, 2) + '\n');
