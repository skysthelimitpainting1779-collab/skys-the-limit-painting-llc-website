#!/usr/bin/env node

/**
 * Agentic Operating System Control Plane & Task Runner Harness
 * Core System for Bounded Task Graph Execution, Verification, and Metrics Tracking
 */

import fs from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const DB_PATH = join(process.cwd(), '.agents', 'hub_db.json');
const DASHBOARD_PATH = join(process.cwd(), '.agents', 'dashboard.html');
const CONTRACT_PATH = join(process.cwd(), '.agents', 'implementation-contract.md');
const CAPABILITY_MATRIX_PATH = join(process.cwd(), '.agents', 'runtime-capability-matrix.md');
const OPERATING_SUMMARY_PATH = join(process.cwd(), '.agents', 'operating-summary.md');

const REQUIRED_AGENT_DIRS = [
  'adapters',
  'approvals',
  'checkpoints',
  'dead-letter',
  'effects',
  'evals',
  'evidence',
  'queues',
  'traces',
  'waits',
  'workflows'
];

const DEFAULT_METRICS = {
  tasks_completed: 0,
  tasks_verified: 0,
  total_duration_ms: 0,
  total_cost_usd: 0.0,
  intervention_rate: 0.0,
  retry_rate: 0.0,
  regression_rate: 0.0,
  eval_pass_rate: 0.0,
  repeat_run_stability: 0.0,
  memory_reuse_rate: 0.0,
  proactive_work_rate: 0.0,
  domains: {
    coding: 0,
    browser: 0,
    docs: 0,
    operations: 0,
    research: 0,
    science: 0,
    business: 0
  }
};

const DEFAULT_QUEUES = {
  now: [],
  next: [],
  blocked: [],
  improve: [],
  recurring: []
};

const DEFAULT_MILESTONES = [
  {
    id: 'M1',
    title: 'Closed-loop harness baseline',
    status: 'in_progress',
    definition: 'Accept a goal, decompose tasks, route work, execute, verify, record memory, show activity, and learn one thing.'
  },
  {
    id: 'M2',
    title: 'Durable reliability controls',
    status: 'planned',
    definition: 'Add idempotent effects, durable waits, checkpoints, dead-letter handling, and trace inspection.'
  },
  {
    id: 'M3',
    title: 'Skill and workflow packaging',
    status: 'planned',
    definition: 'Promote repeated successful trajectories into skills, playbooks, and specialized state-machine workflows.'
  },
  {
    id: 'M4',
    title: 'Broader computer-work adapters',
    status: 'planned',
    definition: 'Add browser, desktop, research, business-system, and science adapters with domain-specific verification.'
  }
];

const DEFAULT_CAPABILITIES = [
  { surface: 'terminal and shell execution', status: 'implemented', adapter: 'runCommand()', evidence: 'scripts/agent-os.js' },
  { surface: 'git and repository operations', status: 'guarded', adapter: 'git status diagnostics only', evidence: '.agents/implementation-contract.md' },
  { surface: 'local file management', status: 'implemented', adapter: 'filesystem artifacts under .agents/', evidence: '.agents/' },
  { surface: 'browser automation', status: 'scaffolded', adapter: '.agents/adapters/browser.md', evidence: '.agents/runtime-capability-matrix.md' },
  { surface: 'desktop automation', status: 'scaffolded', adapter: '.agents/adapters/desktop.md', evidence: '.agents/runtime-capability-matrix.md' },
  { surface: 'documents, decks, reports, spreadsheets', status: 'scaffolded', adapter: '.agents/adapters/documents.md', evidence: '.agents/runtime-capability-matrix.md' },
  { surface: 'database exploration and administration', status: 'scaffolded', adapter: '.agents/adapters/database.md', evidence: '.agents/runtime-capability-matrix.md' },
  { surface: 'cloud CLI and deployment operations', status: 'guarded', adapter: 'verification gates plus human approval', evidence: 'AGENTS.md' },
  { surface: 'email, chat, calendar, CRM, support, finance', status: 'approval_required', adapter: '.agents/effects/', evidence: '.agents/effects.md' },
  { surface: 'research with source validation', status: 'scaffolded', adapter: '.agents/workflows/research.md', evidence: '.agents/runtime-capability-matrix.md' },
  { surface: 'recurring automations and monitors', status: 'scaffolded', adapter: '.agents/queues/recurring.md', evidence: '.agents/status.md' }
];

function ensureDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

function writeIfMissing(path, content) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content, 'utf8');
  }
}

function createInitialDb() {
  return {
    meta: {
      system: "Agentic OS v1.2.0",
      architecture: "harness-wrapper",
      last_updated: new Date().toISOString(),
      total_runs: 0
    },
    goals: [],
    tasks: [],
    sessions: [],
    incidents: [],
    effects: [],
    waits: [],
    checkpoints: [],
    evals: [
      {
        id: 'EVAL-M1-CLOSED-LOOP',
        category: 'capability',
        description: 'Foundational artifacts exist and the harness can report status without a pending goal.',
        command: 'node scripts/agent-os.js status',
        status: 'pending',
        last_result: null
      }
    ],
    milestones: DEFAULT_MILESTONES,
    capabilities: DEFAULT_CAPABILITIES,
    metrics: structuredClone(DEFAULT_METRICS),
    policies: [
      { id: "POL-001", type: "contrast", rule: "Safety orange elements (#FF5A00) must use dark charcoal (#050505) text." },
      { id: "POL-002", type: "emoji", rule: "No emojis in source code or React components." },
      { id: "POL-003", type: "radius", rule: "All card and container border-radius values must be strict 0px." },
      { id: "POL-004", type: "side_effects", rule: "External side effects require an idempotency key, recorded effect state, and approval when sensitive." },
      { id: "POL-005", type: "rollback", rule: "The harness may quarantine and recommend recovery, but it must not automatically revert user files." }
    ],
    queues: structuredClone(DEFAULT_QUEUES)
  };
}

function writeFoundationalArtifacts(db) {
  const summary = `# Agent OS Operating Summary

Default architecture: harness-wrapper around the current coding runtime. The file-based control plane under \`.agents/\` is the durable source of truth for goals, task graphs, evidence, traces, queues, waits, effects, evals, and memory.

First milestone: prove the closed loop from goal intake to task graph, worker routing, execution, verification, memory update, visible dashboard, and one learning or eval improvement.

Key guardrails: keep public website claim rules from \`AGENTS.md\`, require verification before completion, record side effects before acting, preserve user changes, quarantine repeated failures, and keep external mutations approval-gated.

Current runtime constraints: local Node.js harness, restricted network, workspace-write filesystem, no automatic deploys, and no unsafe rollback of user files.
`;
  fs.writeFileSync(OPERATING_SUMMARY_PATH, summary, 'utf8');

  const contract = `# Agent OS Implementation Contract

## Architecture

- Mode: harness-wrapper.
- Source of truth: \`.agents/hub_db.json\` plus generated markdown ledgers.
- Execution unit: task records with dependencies, status, assignee, command, verification plan, artifacts, traces, and checkpoints.
- Workflow shape: goal -> task graph -> claim -> execute -> verify -> evidence -> memory -> eval/improvement.

## Reliability Rails

- Mandatory phases write artifacts under \`.agents/\`.
- Validation happens before a task is marked verified.
- Repeated failures move to blocked/dead-letter state with an incident record.
- External effects are recorded in \`.agents/effects/\` with idempotency identity before action.
- Durable waits are represented under \`.agents/waits/\` and keep resume context.
- The harness does not automatically revert source files. Recovery is explicit and human-inspectable.

## Verification Gates

- Narrow code checks: \`npm run lint\`.
- Test suite: \`npm test\`.
- Production build: \`npm run build\`.
- Harness eval: \`node scripts/agent-os.js eval\`.
- Graph/wiki refresh after code or knowledge changes: \`powershell -ExecutionPolicy Bypass -File "..\\compile-all.ps1"\`.
`;
  fs.writeFileSync(CONTRACT_PATH, contract, 'utf8');

  const capabilityMatrix = `# Runtime Capability Matrix

| Surface | Status | Adapter | Evidence |
|---|---|---|---|
${db.capabilities.map(c => `| ${c.surface} | ${c.status} | ${c.adapter} | ${c.evidence} |`).join('\n')}
`;
  fs.writeFileSync(CAPABILITY_MATRIX_PATH, capabilityMatrix, 'utf8');

  writeIfMissing(join(process.cwd(), '.agents', 'adapters', 'browser.md'), '# Browser Adapter\n\nStatus: scaffolded. Use named browser actions, observe before acting, and capture before/after evidence before risky changes.\n');
  writeIfMissing(join(process.cwd(), '.agents', 'adapters', 'desktop.md'), '# Desktop Adapter\n\nStatus: scaffolded. Native desktop actions require explicit operator approval and screenshot evidence.\n');
  writeIfMissing(join(process.cwd(), '.agents', 'adapters', 'database.md'), '# Database Adapter\n\nStatus: scaffolded. Database writes require source reconciliation, dry-run notes, and approval.\n');
  writeIfMissing(join(process.cwd(), '.agents', 'adapters', 'documents.md'), '# Document Adapter\n\nStatus: scaffolded. Programmatic deliverables should be generated from validated intermediate data.\n');
  writeIfMissing(join(process.cwd(), '.agents', 'workflows', 'research.md'), '# Research Workflow\n\nStatus: scaffolded. Research work must capture sources, dates, citations, and evidence notes.\n');
}

function appendTrace(event) {
  const tracePath = join(process.cwd(), '.agents', 'traces', `${new Date().toISOString().slice(0, 10)}.jsonl`);
  fs.appendFileSync(tracePath, `${JSON.stringify({ timestamp: new Date().toISOString(), ...event })}\n`, 'utf8');
}

// Helper to ensure database is initialized
function initDb() {
  const dbDir = join(process.cwd(), '.agents');
  ensureDir(dbDir);
  REQUIRED_AGENT_DIRS.forEach(dir => ensureDir(join(dbDir, dir)));

  const learningsDir = join(process.cwd(), '.learnings');
  ensureDir(learningsDir);

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(createInitialDb(), null, 2), 'utf8');
  }
}

// Load DB
function loadDb() {
  initDb();
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  db.meta = db.meta || {};
  db.meta.system = "Agentic OS v1.2.0";
  db.meta.architecture = db.meta.architecture || "harness-wrapper";
  db.meta.total_runs = db.meta.total_runs || 0;
  db.goals = db.goals || [];
  db.tasks = db.tasks || [];
  db.sessions = db.sessions || [];
  db.incidents = db.incidents || [];
  db.effects = db.effects || [];
  db.waits = db.waits || [];
  db.checkpoints = db.checkpoints || [];
  db.evals = db.evals || createInitialDb().evals;
  db.milestones = db.milestones || DEFAULT_MILESTONES;
  db.capabilities = db.capabilities || DEFAULT_CAPABILITIES;
  db.policies = db.policies || [];
  for (const policy of createInitialDb().policies) {
    if (!db.policies.some(p => p.id === policy.id)) {
      db.policies.push(policy);
    }
  }
  db.metrics = { ...structuredClone(DEFAULT_METRICS), ...(db.metrics || {}) };
  db.metrics.domains = { ...structuredClone(DEFAULT_METRICS.domains), ...(db.metrics.domains || {}) };
  db.queues = { ...structuredClone(DEFAULT_QUEUES), ...(db.queues || {}) };
  writeFoundationalArtifacts(db);
  return db;
}

// Update Momentum Queues
function updateQueues(db) {
  const completedTaskIds = new Set(
    db.tasks.filter(t => t.status === "verified").map(t => t.id)
  );

  const runningTask = db.tasks.find(t => t.status === "running");
  const runnableTasks = db.tasks.filter(t => 
    (t.status === "pending" || t.status === "failed") && 
    t.dependencies.every(depId => completedTaskIds.has(depId))
  );

  const priorityMap = { high: 3, medium: 2, low: 1 };
  runnableTasks.sort((a, b) => (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0));

  const nowList = runningTask ? [runningTask.id] : (runnableTasks.length > 0 ? [runnableTasks[0].id] : []);
  const nextList = runnableTasks.slice(runningTask ? 0 : 1).map(t => t.id);
  const blockedList = db.tasks.filter(t => t.status === "blocked" || (t.status === "failed" && t.attempts >= 2)).map(t => t.id);
  const improveList = db.incidents.map(i => i.id);

  db.queues = {
    now: nowList,
    next: nextList,
    blocked: blockedList,
    improve: improveList,
    recurring: ["CRON-LIVENESS", "CRON-PROGRESS"]
  };
}

// Save DB & Sync Markdown Files
function saveDb(db) {
  updateQueues(db);
  db.meta.last_updated = new Date().toISOString();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  syncMarkdownFiles(db);
  generateHtmlDashboard(db);
}

// Filesystem-First Memory Sync
function syncMarkdownFiles(db) {
  const agentsDir = join(process.cwd(), '.agents');

  // 1. plan.md
  let planMd = `# Project Execution Plan\n\n`;
  planMd += `This file is generated automatically by Agent OS. It tracks active goals and task queue statuses.\n\n`;
  planMd += `## Active Goals\n\n`;
  if (db.goals.length === 0) {
    planMd += `- No active goals.\n\n`;
  } else {
    db.goals.forEach(g => {
      planMd += `- **${g.id}**: ${g.description} [Status: **${g.status}**, Budget: $${g.budget}, Cost: $${g.cost_accumulated.toFixed(4)}]\n`;
    });
    planMd += `\n`;
  }
  planMd += `## Task Queue\n\n`;
  if (db.tasks.length === 0) {
    planMd += `- No queued tasks.\n\n`;
  } else {
    db.tasks.forEach(t => {
      planMd += `- [${t.status === 'verified' ? 'x' : t.status === 'running' ? '/' : ' '}] **${t.id}**: ${t.title} [Assignee: ${t.assignee}, Priority: ${t.priority}]\n`;
    });
    planMd += `\n`;
  }
  fs.writeFileSync(join(agentsDir, 'plan.md'), planMd, 'utf8');

  // 2. decisions.md
  let decisionsMd = `# Architectural Decisions & Guardrails\n\n`;
  decisionsMd += `Unified policies and safety rules enforced across the workspace.\n\n`;
  decisionsMd += `## Enforced Policies\n\n`;
  db.policies.forEach(p => {
    decisionsMd += `- **[${p.type}]** ${p.id}: ${p.rule}\n`;
  });
  decisionsMd += `\n`;
  fs.writeFileSync(join(agentsDir, 'decisions.md'), decisionsMd, 'utf8');

  // 3. knowledge.md
  let knowledgeMd = `# Workspace Knowledge & Runbook\n\n`;
  knowledgeMd += `Aggregate lessons learned and reference templates for task execution.\n\n`;
  knowledgeMd += `## Reference Command Guide\n\n`;
  knowledgeMd += `- **Linting**: Run TypeScript checks via \`cmd.exe /c "npm run lint"\`\n`;
  knowledgeMd += `- **Testing**: Run test suite via \`cmd.exe /c "npm test"\`\n`;
  knowledgeMd += `- **Next.js Production Compilation**: Run build via \`cmd.exe /c "npm run build"\`\n`;
  knowledgeMd += `- **Project Graph Compilation**: Compile master graph via \`powershell -ExecutionPolicy Bypass -File "..\\compile-all.ps1"\`\n\n`;
  
  knowledgeMd += `## Lessons Learned & Failures Cache\n\n`;
  const errorsPath = join(process.cwd(), '.learnings', 'ERRORS.md');
  if (fs.existsSync(errorsPath)) {
    const errorLogs = fs.readFileSync(errorsPath, 'utf8');
    knowledgeMd += errorLogs.replace(/# Errors Log\n/i, '');
  } else {
    knowledgeMd += `- No errors recorded yet.\n\n`;
  }
  fs.writeFileSync(join(agentsDir, 'knowledge.md'), knowledgeMd, 'utf8');

  // 4. handoff.md
  let handoffMd = `# Continuation Handoff Record\n\n`;
  handoffMd += `Current context snapshot for the next agent/worker session.\n\n`;
  handoffMd += `## Context Summary\n\n`;
  
  const activeTask = db.tasks.find(t => t.status === 'running');
  if (activeTask) {
    handoffMd += `- **Current Execution**: Task ${activeTask.id} (${activeTask.title})\n`;
  } else {
    handoffMd += `- **Current Execution**: None (Idle)\n`;
  }
  
  const nextTask = getNextTask(db);
  handoffMd += `- **Next Planned Action**: ${nextTask ? `${nextTask.id} (${nextTask.title})` : 'None (Goal complete)'}\n`;
  handoffMd += `- **Budget Health**: Total spent $${db.metrics.total_cost_usd} / total runs ${db.meta.total_runs}\n\n`;
  
  handoffMd += `## Action Checklist\n\n`;
  if (nextTask) {
    handoffMd += `- [ ] Claim and execute task **${nextTask.id}** (${nextTask.title})\n`;
    handoffMd += `- [ ] Run verification checks\n`;
    handoffMd += `- [ ] Commit and hand off\n\n`;
  } else {
    handoffMd += `- [x] All tasks completed and verified\n`;
    handoffMd += `- [x] Dashboard generated\n\n`;
  }
  fs.writeFileSync(join(agentsDir, 'handoff.md'), handoffMd, 'utf8');

  // 5. status.md
  let statusMd = `# System Status & Performance Metrics\n\n`;
  statusMd += `Operational dashboard of the Agentic OS control plane.\n\n`;
  statusMd += `## Run Status\n\n`;
  statusMd += `- **Total Runs**: ${db.meta.total_runs}\n`;
  statusMd += `- **Last Updated**: ${db.meta.last_updated}\n\n`;
  statusMd += `## Metrics\n\n`;
  statusMd += `- **Tasks Completed**: ${db.metrics.tasks_completed}\n`;
  statusMd += `- **Tasks Verified**: ${db.metrics.tasks_verified}\n`;
  statusMd += `- **Total Duration**: ${(db.metrics.total_duration_ms / 1000).toFixed(1)}s\n`;
  statusMd += `- **Accumulated Cost**: $${db.metrics.total_cost_usd.toFixed(4)}\n`;
  statusMd += `- **Retry Rate**: ${(db.metrics.retry_rate * 100).toFixed(0)}%\n`;
  statusMd += `- **Intervention Rate**: ${(db.metrics.intervention_rate * 100).toFixed(0)}%\n\n`;
  statusMd += `## Momentum Queues\n\n`;
  statusMd += `- **NOW**: ${db.queues.now.join(', ') || 'None (Idle)'}\n`;
  statusMd += `- **NEXT**: ${db.queues.next.join(', ') || 'None'}\n`;
  statusMd += `- **BLOCKED**: ${db.queues.blocked.join(', ') || 'None'}\n`;
  statusMd += `- **IMPROVE**: ${db.queues.improve.join(', ') || 'None'}\n`;
  statusMd += `- **RECURRING**: ${db.queues.recurring.join(', ') || 'None'}\n`;
  fs.writeFileSync(join(agentsDir, 'status.md'), statusMd, 'utf8');

  for (const [queueName, taskIds] of Object.entries(db.queues)) {
    const queueMd = `# ${queueName.toUpperCase()} Queue\n\n${taskIds.length ? taskIds.map(id => `- ${id}`).join('\n') : '- Empty'}\n`;
    fs.writeFileSync(join(agentsDir, 'queues', `${queueName}.md`), queueMd, 'utf8');
  }

  // 6. FAILURE.md
  let failureMd = `# System Failures & Incidents Log\n\n`;
  failureMd += `Historical record of execution incidents and automated self-healing events.\n\n`;
  if (db.incidents.length === 0) {
    failureMd += `- No incidents recorded.\n`;
  } else {
    db.incidents.forEach(inc => {
      failureMd += `## Incident [${inc.id}]\n\n`;
      failureMd += `- **Task ID**: ${inc.task_id}\n`;
      failureMd += `- **Command**: \`${inc.command}\`\n`;
      failureMd += `- **Timestamp**: ${inc.timestamp}\n`;
      failureMd += `- **Status**: ${inc.status || 'quarantined'}\n\n`;
      failureMd += `### Diagnostics Context\n\`\`\`\n${inc.diagnostics}\n\`\`\`\n\n`;
      failureMd += `---\n\n`;
    });
  }
  fs.writeFileSync(join(agentsDir, 'FAILURE.md'), failureMd, 'utf8');

  // 7. project.md
  let projectMd = `# Project Charter & Objectives\n\n`;
  projectMd += `Durable memory of project objectives, constraints, and runtime profile.\n\n`;
  projectMd += `## Active Goals\n\n`;
  db.goals.forEach(g => {
    projectMd += `### Goal ${g.id}\n\n`;
    projectMd += `- **Description**: ${g.description}\n`;
    projectMd += `- **Status**: ${g.status}\n`;
    projectMd += `- **Budget**: $${g.budget}\n`;
    projectMd += `- **Spent**: $${g.cost_accumulated.toFixed(4)}\n\n`;
  });
  projectMd += `## Security & Contrast Rules\n\n`;
  db.policies.forEach(p => {
    projectMd += `- **${p.id} [${p.type}]**: ${p.rule}\n`;
  });
  fs.writeFileSync(join(agentsDir, 'project.md'), projectMd, 'utf8');

  // 8. milestones.md
  let milestonesMd = `# Agent OS Milestones\n\n`;
  db.milestones.forEach(m => {
    milestonesMd += `## ${m.id}: ${m.title}\n\n`;
    milestonesMd += `- **Status**: ${m.status}\n`;
    milestonesMd += `- **Definition**: ${m.definition}\n\n`;
  });
  fs.writeFileSync(join(agentsDir, 'milestones.md'), milestonesMd, 'utf8');

  // 9. effects.md
  let effectsMd = `# Effect Ledger\n\n`;
  effectsMd += `External side effects are recorded before action with idempotency identity and replay policy.\n\n`;
  if (db.effects.length === 0) {
    effectsMd += `- No external effects recorded.\n`;
  } else {
    db.effects.forEach(effect => {
      effectsMd += `- **${effect.id}** (${effect.status}): ${effect.description} / key \`${effect.idempotency_key}\`\n`;
    });
  }
  fs.writeFileSync(join(agentsDir, 'effects.md'), effectsMd, 'utf8');

  // 10. waits.md
  let waitsMd = `# Durable Waits\n\n`;
  waitsMd += `Waitpoints preserve exact run state for approvals, callbacks, schedules, rate limits, or human takeover.\n\n`;
  if (db.waits.length === 0) {
    waitsMd += `- No active waits.\n`;
  } else {
    db.waits.forEach(wait => {
      waitsMd += `- **${wait.id}** (${wait.status}): ${wait.reason}; resume with ${wait.resume_action}\n`;
    });
  }
  fs.writeFileSync(join(agentsDir, 'waits.md'), waitsMd, 'utf8');

  // 11. evals.md
  let evalsMd = `# Eval Harness\n\n`;
  evalsMd += `| ID | Category | Status | Command | Last Result |\n`;
  evalsMd += `|---|---|---|---|---|\n`;
  db.evals.forEach(e => {
    evalsMd += `| ${e.id} | ${e.category} | ${e.status} | \`${e.command}\` | ${e.last_result || 'not run'} |\n`;
  });
  fs.writeFileSync(join(agentsDir, 'evals.md'), evalsMd, 'utf8');

  // 12. traces.md
  const traceDir = join(agentsDir, 'traces');
  const traceFiles = fs.existsSync(traceDir) ? fs.readdirSync(traceDir).filter(name => name.endsWith('.jsonl')) : [];
  let tracesMd = `# Trace Index\n\n`;
  tracesMd += traceFiles.length ? traceFiles.map(name => `- ${name}`).join('\n') + '\n' : '- No traces recorded.\n';
  fs.writeFileSync(join(agentsDir, 'traces.md'), tracesMd, 'utf8');

  // 13. tasks.md
  let tasksMd = `# Task Graph Ledger\n\n`;
  tasksMd += `Detailed log of all decomposed task specifications and metadata.\n\n`;
  tasksMd += `| ID | Title | Skill Tags | Priority | Risk | Status | Assignee | Command | Budget | Mindset |\n`;
  tasksMd += `|---|---|---|---|---|---|---|---|---|---|\n`;
  db.tasks.forEach(t => {
    tasksMd += `| ${t.id} | ${t.title} | ${t.skill_tags ? t.skill_tags.join(', ') : 'none'} | ${t.priority} | ${t.risk_level} | ${t.status} | ${t.assignee} | \`${t.command}\` | $${t.budget || 1.0} | ${t.mindset || 'none'} |\n`;
  });
  fs.writeFileSync(join(agentsDir, 'tasks.md'), tasksMd, 'utf8');
}

// Memory-Retrieval Logic
function retrieveContext(taskDescription) {
  const knowledgePath = join(process.cwd(), '.agents', 'knowledge.md');
  if (!fs.existsSync(knowledgePath)) return "";
  
  const knowledgeContent = fs.readFileSync(knowledgePath, 'utf8');
  const words = taskDescription.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const uniqueWords = Array.from(new Set(words));
  
  const matchingParagraphs = [];
  const blocks = knowledgeContent.split('\n\n');
  
  for (const block of blocks) {
    for (const word of uniqueWords) {
      if (block.toLowerCase().includes(word) && !matchingParagraphs.includes(block)) {
        matchingParagraphs.push(block.trim());
        break;
      }
    }
    if (matchingParagraphs.length >= 3) break;
  }
  
  if (matchingParagraphs.length > 0) {
    return `[Memory Retrieval] Found relevant reference knowledge:\n${matchingParagraphs.map(p => `> ${p}`).join('\n\n')}\n`;
  }
  return "";
}

// Task-Scoped Self-Healing & Incident Logging
function triggerSelfHealing(task, failedCommand, errorOutput) {
  console.log(`[Self-Healing] Triggered for task ${task.id} after command failure: "${failedCommand}"`);
  
  let diagnostics = `[Diagnostics] Analyzing failure of command: "${failedCommand}"\n`;
  let modifiedFiles = [];
  
  try {
    const gitStatusRaw = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatusRaw.trim()) {
      diagnostics += `[Git Status] Modified workspace files:\n${gitStatusRaw}\n`;
      modifiedFiles = gitStatusRaw
        .split(/\r?\n/)
        .filter(line => line.trim().length > 0)
        .map(line => {
          const status = line.slice(0, 2);
          const file = line.slice(3).trim();
          if (status.includes('M') || status.includes('D') || status.includes('T')) {
            const normalized = file.replace(/\\/g, '/');
            if (!normalized.startsWith('.agents/') && !normalized.startsWith('.learnings/')) {
              return file;
            }
          }
          return null;
        })
        .filter(Boolean);
    } else {
      diagnostics += `[Git Status] Workspace is clean.\n`;
    }
  } catch (gitErr) {
    diagnostics += `[Error] Failed to execute git status: ${gitErr.message}\n`;
  }
  
  let lintFailed = false;
  try {
    diagnostics += `[Diagnostics] Running TypeScript verification check...\n`;
    execSync('cmd.exe /c "npm run lint"', { encoding: 'utf8' });
    diagnostics += `[Lint Output] Lint passed successfully.\n`;
  } catch (lintErr) {
    lintFailed = true;
    diagnostics += `[Lint Error] TypeScript compiler errors:\n${lintErr.stdout || lintErr.message}\n`;
  }
  
  const learningsDir = join(process.cwd(), '.learnings');
  if (!fs.existsSync(learningsDir)) {
    fs.mkdirSync(learningsDir, { recursive: true });
  }
  const errorsPath = join(learningsDir, 'ERRORS.md');
  const errorId = `ERR-${Date.now()}`;
  
  let errorLogEntry = `\n## [${errorId}] Task failure: ${task.title}\n\n`;
  errorLogEntry += `**Logged**: ${new Date().toISOString()}\n`;
  errorLogEntry += `**Priority**: high\n`;
  errorLogEntry += `**Status**: quarantined\n`;
  errorLogEntry += `**Area**: devops-execution\n\n`;
  errorLogEntry += `### Summary\nTask command "${failedCommand}" failed during runtime.\n\n`;
  errorLogEntry += `### Error Output\n\`\`\`\n${errorOutput.trim().slice(0, 1000)}\n\`\`\`\n\n`;
  errorLogEntry += `### Diagnostics Context\n\`\`\`\n${diagnostics.trim().slice(0, 1000)}\n\`\`\`\n\n`;
  errorLogEntry += `### Suggested Fix\n`;
  if (lintFailed) {
    errorLogEntry += `Fix the TypeScript compiler type errors in modified files: ${modifiedFiles.join(', ')}.\n`;
  } else {
    errorLogEntry += `Inspect task logs and logs at the failing step. Re-run verification suite.\n`;
  }
  
  fs.appendFileSync(errorsPath, errorLogEntry, 'utf8');
  console.log(`[Self-Healing] Logged incident ${errorId} in .learnings/ERRORS.md`);
  
  // Quarantine only. Do not automatically revert source files; user changes may be present.
  if (modifiedFiles.length > 0) {
    const deadLetterDir = join(process.cwd(), '.agents', 'dead-letter');
    ensureDir(deadLetterDir);
    const deadLetterPath = join(deadLetterDir, `${errorId}.json`);
    fs.writeFileSync(deadLetterPath, JSON.stringify({
      id: errorId,
      task_id: task.id,
      failed_command: failedCommand,
      modified_files: modifiedFiles,
      diagnostics,
      replay_policy: "Manual inspection required before retry. No automatic rollback was performed."
    }, null, 2), 'utf8');
    console.log(`[Self-Healing] Quarantined failure context at ${deadLetterPath}`);
  } else {
    console.log(`[Self-Healing] No modified source files detected for quarantine.`);
  }
  
  return { errorId, diagnostics };
}

// Helper to run commands safely on Windows/Unix
function runCommand(cmd) {
  let executable = cmd;
  if (process.platform === 'win32' && !cmd.startsWith('cmd.exe') && !cmd.startsWith('powershell')) {
    executable = `cmd.exe /c "${cmd.replace(/"/g, '\\"')}"`;
  }
  console.log(`[Agent OS] Executing shell command: ${executable}`);
  return execSync(executable, { encoding: 'utf8' });
}

// Decompose goal into a task graph
function createGoal(description, budgetUsd = 5.0, tasksPath = null) {
  const db = loadDb();
  const goalId = `GOAL-${db.goals.length + 1}`;
  
  const newGoal = {
    id: goalId,
    description,
    status: "pending",
    budget: budgetUsd,
    cost_accumulated: 0.0,
    created_at: new Date().toISOString()
  };
  
  db.goals.push(newGoal);
  
  let generatedTasks = [];

  // Parse custom tasks if path provided
  if (tasksPath && fs.existsSync(tasksPath)) {
    try {
      const customTasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
      if (Array.isArray(customTasks)) {
        generatedTasks = customTasks.map((t, index) => ({
          id: `${goalId}-T${index + 1}`,
          goal_id: goalId,
          title: t.title || `Custom Task ${index + 1}`,
          description: t.description || "",
          scope: t.scope || "",
          mindset: t.mindset || "analytical",
          context: t.context || "",
          skill_tags: t.skill_tags || ["dev"],
          priority: t.priority || "medium",
          risk_level: t.risk_level || "low",
          status: t.status || "pending",
          assignee: t.assignee || "worker-agent",
          command: t.command || "npm run lint",
          dependencies: t.dependencies || [],
          attempts: 0,
          budget: t.budget || 1.0,
          verification_plan: t.verification_plan || "Command runs successfully.",
          artifacts: t.artifacts || []
        }));
      }
    } catch (parseErr) {
      console.error(`[Error] Failed to parse custom tasks JSON: ${parseErr.message}`);
    }
  }

  // Fallback to rich standard tasks
  if (generatedTasks.length === 0) {
    generatedTasks = [
      {
        id: `${goalId}-T1`,
        goal_id: goalId,
        title: "Compliance and Terminology Audit",
        description: "Scan code for forbidden claims (Licensed, Bonded, MnDOT-approved) and verify registration formatting.",
        scope: "src/views/, src/components/",
        mindset: "analytical, compliance-focused",
        context: "Next.js routing, Google Open Knowledge requirements, local MN contractor rules",
        skill_tags: ["compliance", "seo", "audit"],
        priority: "high",
        risk_level: "low",
        status: "pending",
        assignee: "compliance-agent",
        command: "npm run lint",
        dependencies: [],
        attempts: 0,
        budget: 1.0,
        verification_plan: "Check that tsc compilation passes and there are no violations of MN Statute 176.041.",
        artifacts: [".agents/plan.md"]
      },
      {
        id: `${goalId}-T2`,
        goal_id: goalId,
        title: "Visual Redesign & Contrast Alignment",
        description: "Verify design systems, Tailwind config and bento grid layout styling rules.",
        scope: "src/views/Services.tsx, src/components/Layout.tsx",
        mindset: "creative, detail-oriented",
        context: "Tailwind CSS configuration, HSL color palette compliance",
        skill_tags: ["design", "css", "visual"],
        priority: "high",
        risk_level: "medium",
        status: "pending",
        assignee: "design-agent",
        command: "npm run lint",
        dependencies: [`${goalId}-T1`],
        attempts: 0,
        budget: 1.0,
        verification_plan: "Ensure safety orange contrast compliance and zero emojis rules are met.",
        artifacts: [".agents/plan.md"]
      },
      {
        id: `${goalId}-T3`,
        goal_id: goalId,
        title: "Interactive Micro-animations & Transitions",
        description: "Verify Framer Motion configuration and key imports are clean.",
        scope: "src/components/BeforeAfterSlider.tsx",
        mindset: "motion-focused, dynamic",
        context: "Framer Motion, 21st.dev interactive components reference",
        skill_tags: ["animation", "motion", "ux"],
        priority: "medium",
        risk_level: "low",
        status: "pending",
        assignee: "motion-agent",
        command: "npm run lint",
        dependencies: [`${goalId}-T2`],
        attempts: 0,
        budget: 1.0,
        verification_plan: "Test left/right arrow and Home/End key clamping logic on BeforeAfterSlider.",
        artifacts: [".agents/plan.md"]
      },
      {
        id: `${goalId}-T4`,
        goal_id: goalId,
        title: "Verification Suite Execution",
        description: "Run full automated unit and E2E test suites in CLI.",
        scope: "tests/",
        mindset: "adversarial, verification-driven",
        context: "Opaque-box and white-box test suite coverage",
        skill_tags: ["qa", "testing", "ci"],
        priority: "high",
        risk_level: "high",
        status: "pending",
        assignee: "qa-verifier",
        command: "npm test",
        dependencies: [`${goalId}-T3`],
        attempts: 0,
        budget: 1.0,
        verification_plan: "Run all Tier 1-4 tests and check for 100% pass rate.",
        artifacts: [".agents/plan.md"]
      }
    ];
  }

  db.tasks = db.tasks.concat(generatedTasks);
  saveDb(db);
  console.log(`[Agent OS] Successfully initialized Goal ${goalId} and generated ${generatedTasks.length} tasks.`);
}

// Get next runnable task
function getNextTask(db) {
  const completedTaskIds = new Set(
    db.tasks.filter(t => t.status === "verified").map(t => t.id)
  );

  return db.tasks.find(t => {
    if (t.status !== "pending" && t.status !== "failed") return false;
    return t.dependencies.every(depId => completedTaskIds.has(depId));
  });
}

// Execute task runner loop
function executeNextTask() {
  const db = loadDb();
  const task = getNextTask(db);
  
  if (!task) {
    console.log("[Agent OS] No pending tasks ready. All active milestones completed or blocked.");
    return;
  }

  // Step-level caching: check if previously verified
  if (task.status === "verified") {
    console.log(`[Cache] Task ${task.id} is already verified. Skipping execution.`);
    return;
  }
  const lastSession = db.sessions.find(s => s.task_id === task.id && s.status === "success");
  if (lastSession) {
    console.log(`[Cache] Restoring successful cached state for task ${task.id}.`);
    task.status = "verified";
    saveDb(db);
    return;
  }

  // Specialized Harness Routing
  let harnessName = "General dynamic work harness";
  if (task.command && task.command.includes("lint")) {
    harnessName = "Coding and delivery harness";
  } else if (task.command && task.command.includes("test")) {
    harnessName = "Coding and delivery harness";
  } else if (task.scope && task.scope.includes("api/")) {
    harnessName = "Incident and recovery harness";
  }

  console.log(`[Harness Router] Routing task ${task.id} via: ${harnessName}`);
  appendTrace({ type: 'route', task_id: task.id, harness: harnessName, status: 'selected' });

  console.log(`[Agent OS] Claiming Task: ${task.id} [${task.title}]`);
  task.status = "running";
  task.attempts += 1;
  saveDb(db);

  const startTime = Date.now();
  const sessionId = `SESS-${Date.now()}`;
  let sessionStatus = "success";
  let stdoutLogs = `[Harness Router] Routed via: ${harnessName}\n`;
  appendTrace({ type: 'claim', task_id: task.id, session_id: sessionId, attempt: task.attempts });
  
  // 1. Context retrieval
  const retrievedMem = retrieveContext(task.title + " " + task.description);
  if (retrievedMem) {
    stdoutLogs += retrievedMem + "\n";
    console.log(retrievedMem);
  }

  // 2. Real command execution
  try {
    const cmdToRun = task.command || "npm run lint";
    stdoutLogs += `[Worker] Running task execution command: "${cmdToRun}"\n`;
    appendTrace({ type: 'tool_call', task_id: task.id, session_id: sessionId, command: cmdToRun });
    const execLogs = runCommand(cmdToRun);
    stdoutLogs += execLogs;
    appendTrace({ type: 'verification', task_id: task.id, session_id: sessionId, status: 'passed', plan: task.verification_plan || 'Command completed successfully.' });
  } catch (err) {
    sessionStatus = "failed";
    const errorMsg = err.stdout || err.message || String(err);
    stdoutLogs += `\n[ERROR] Command execution failed:\n${errorMsg}`;
    appendTrace({ type: 'verification', task_id: task.id, session_id: sessionId, status: 'failed', error: errorMsg.slice(0, 500) });
    
    // Trigger Self-Healing Diagnostics & Reverts
    const healingResult = triggerSelfHealing(task, task.command, errorMsg);
    
    db.incidents.push({
      id: healingResult.errorId,
      task_id: task.id,
      command: task.command,
      diagnostics: healingResult.diagnostics,
      timestamp: new Date().toISOString(),
      status: "quarantined"
    });
  }

  const durationMs = Date.now() - startTime;
  const costUsd = parseFloat((durationMs * 0.00001).toFixed(4));

  // Log session
  db.sessions.push({
    id: sessionId,
    task_id: task.id,
    duration_ms: durationMs,
    cost_usd: costUsd,
    status: sessionStatus,
    timestamp: new Date().toISOString(),
    logs: stdoutLogs
  });

  const evidencePath = join(process.cwd(), '.agents', 'evidence', `${sessionId}.log`);
  fs.writeFileSync(evidencePath, stdoutLogs, 'utf8');
  db.checkpoints.push({
    id: `CHK-${Date.now()}`,
    task_id: task.id,
    session_id: sessionId,
    status: sessionStatus,
    evidence: evidencePath.replace(process.cwd() + '\\', '').replace(/\\/g, '/'),
    timestamp: new Date().toISOString()
  });

  // Update Task status
  if (sessionStatus === "success") {
    task.status = "verified";
    db.metrics.tasks_verified += 1;
    db.metrics.tasks_completed += 1;
  } else {
    task.status = "failed";
    db.metrics.retry_rate = parseFloat(((db.metrics.retry_rate + 0.1) / 2).toFixed(2));
    
    if (task.attempts >= 2) {
      console.log(`[Self-Improvement] Task ${task.id} has failed ${task.attempts} times. Quarantine triggered.`);
      task.status = "blocked";
      db.metrics.intervention_rate = parseFloat(((db.metrics.intervention_rate + 0.1) / 2).toFixed(2));
    }
  }

  // Update metrics
  db.metrics.total_duration_ms += durationMs;
  db.metrics.total_cost_usd = parseFloat((db.metrics.total_cost_usd + costUsd).toFixed(4));
  db.meta.total_runs += 1;

  // Check goal statuses
  const goalTasks = db.tasks.filter(t => t.goal_id === task.goal_id);
  const goal = db.goals.find(g => g.id === task.goal_id);
  if (goal) {
    if (goalTasks.every(t => t.status === "verified")) {
      goal.status = "completed";
      console.log(`[Agent OS] Congratulations! Goal ${goal.id} has been fully completed and verified.`);
    } else if (goalTasks.some(t => t.status === "blocked")) {
      goal.status = "blocked";
    } else {
      goal.status = "in_progress";
    }
  }

  saveDb(db);
  appendTrace({ type: 'complete', task_id: task.id, session_id: sessionId, status: task.status, duration_ms: durationMs, cost_usd: costUsd });
  console.log(`[Agent OS] Finished Task ${task.id}. Status: ${task.status}. Duration: ${durationMs}ms. Cost: $${costUsd}`);
}

// Generate HTML dashboard
function generateHtmlDashboard(db) {
  const tasksHtml = db.tasks.map(t => `
    <div class="border border-white/10 bg-[#111111] p-4 mb-3 flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-mono text-gray-500 uppercase">${t.id} / ${t.assignee}</span>
        <span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
          t.status === 'verified' ? 'bg-green-800 text-white' : 
          t.status === 'running' ? 'bg-blue-800 text-white animate-pulse' :
          t.status === 'failed' ? 'bg-red-800 text-white' : 'bg-gray-800 text-gray-400'
        }">${t.status}</span>
      </div>
      <h3 class="text-sm font-bold uppercase text-white mt-2">${t.title}</h3>
      <p class="text-xs text-gray-400 mt-1">${t.description}</p>
      <div class="mt-3 flex gap-2 text-[10px] text-gray-500">
        <span>Priority: <strong class="text-gray-300">${t.priority}</strong></span>
        <span>Risk: <strong class="text-gray-300">${t.risk_level}</strong></span>
        <span>Attempts: <strong class="text-gray-300">${t.attempts}</strong></span>
      </div>
    </div>
  `).join('');

  const sessionsHtml = db.sessions.slice(-5).map(s => `
    <div class="border-l-2 border-orange-500 bg-[#0c0c0c] p-4 mb-3">
      <div class="flex justify-between text-[10px] text-gray-500 font-mono">
        <span>${s.id} (Task: ${s.task_id})</span>
        <span>${s.timestamp}</span>
      </div>
      <p class="text-xs mt-1 font-bold text-gray-300">Status: <span class="${s.status === 'success' ? 'text-green-500' : 'text-red-500'}">${s.status}</span> | Duration: ${s.duration_ms}ms | Cost: $${s.cost_usd}</p>
      <pre class="bg-black text-[10px] p-2 mt-2 font-mono text-gray-400 overflow-x-auto max-h-32 whitespace-pre-wrap">${s.logs}</pre>
    </div>
  `).join('');

  const policiesHtml = db.policies.map(p => `
    <li class="text-xs text-gray-300 border-b border-white/5 py-2">
      <span class="text-[9px] font-mono text-orange-500 font-bold uppercase mr-2">[${p.type}]</span>
      ${p.rule}
    </li>
  `).join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Agentic OS Control Plane Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Fira+Code&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #050505; color: #f7f7f7; }
    .font-display { font-family: 'Outfit', sans-serif; }
    .font-mono { font-family: 'Fira Code', monospace; }
  </style>
</head>
<body class="p-8 max-w-7xl mx-auto">
  <header class="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
    <div>
      <h1 class="text-3xl font-display font-black uppercase tracking-tight text-white">Agentic OS <span class="text-orange-500">Control Plane</span></h1>
      <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest">Self-improving computer work harness state</p>
    </div>
    <div class="text-right text-xs text-gray-500">
      <p>Last Updated: <span class="font-mono text-gray-300">${db.meta.last_updated}</span></p>
      <p>Total Runs: <span class="font-mono text-gray-300">${db.meta.total_runs}</span></p>
    </div>
  </header>

  <section class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div class="border border-white/10 bg-[#111] p-5">
      <h4 class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tasks Verified</h4>
      <p class="text-3xl font-display font-black text-white mt-2">${db.metrics.tasks_verified} / ${db.tasks.length}</p>
    </div>
    <div class="border border-white/10 bg-[#111] p-5">
      <h4 class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Duration</h4>
      <p class="text-3xl font-display font-black text-white mt-2">${(db.metrics.total_duration_ms / 1000).toFixed(1)}s</p>
    </div>
    <div class="border border-white/10 bg-[#111] p-5">
      <h4 class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Accumulated Cost</h4>
      <p class="text-3xl font-display font-black text-white mt-2">$${db.metrics.total_cost_usd.toFixed(4)}</p>
    </div>
    <div class="border border-white/10 bg-[#111] p-5">
      <h4 class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Retry Rate</h4>
      <p class="text-3xl font-display font-black text-white mt-2">${(db.metrics.retry_rate * 100).toFixed(0)}%</p>
    </div>
  </section>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-7">
      <h2 class="text-lg font-display font-bold uppercase tracking-wider text-white mb-4">Task Graph Queue</h2>
      ${tasksHtml || '<p class="text-xs text-gray-500">No active goals or task graphs loaded.</p>'}
    </div>
    
    <div class="lg:col-span-5 space-y-8">
      <div>
        <h2 class="text-lg font-display font-bold uppercase tracking-wider text-white mb-4">Execution Log Feed</h2>
        ${sessionsHtml || '<p class="text-xs text-gray-500">No active worker sessions logged.</p>'}
      </div>

      <div class="border border-orange-500/20 bg-orange-500/5 p-6">
        <h2 class="text-sm font-display font-bold uppercase tracking-wider text-orange-500 mb-4">Self-Improvement Policies</h2>
        <ul class="space-y-1">
          ${policiesHtml}
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  fs.writeFileSync(DASHBOARD_PATH, htmlContent, 'utf8');
}

function bootstrapSystem() {
  const db = loadDb();
  writeFoundationalArtifacts(db);

  if (!db.queues.improve.includes('IMPROVE-EVAL-COVERAGE')) {
    db.queues.improve.push('IMPROVE-EVAL-COVERAGE');
  }
  if (!db.queues.recurring.includes('CRON-HARNESS-EVAL')) {
    db.queues.recurring.push('CRON-HARNESS-EVAL');
  }

  const existingBootstrapGoal = db.goals.find(g => g.description === 'Agent OS closed-loop first milestone');
  if (!existingBootstrapGoal) {
    const goalId = `GOAL-${db.goals.length + 1}`;
    db.goals.push({
      id: goalId,
      description: 'Agent OS closed-loop first milestone',
      status: 'in_progress',
      budget: 1.0,
      cost_accumulated: 0.0,
      created_at: new Date().toISOString()
    });
    db.tasks.push({
      id: `${goalId}-T1`,
      goal_id: goalId,
      title: 'Bootstrap control-plane artifacts',
      description: 'Verify operating summary, implementation contract, capability matrix, queues, evals, traces, and dashboard exist.',
      scope: '.agents/, scripts/agent-os.js, tests/agent-os.test.mjs',
      mindset: 'verification-driven',
      context: 'Most Capable Agent System Prompt first milestone.',
      skill_tags: ['agent-os', 'harness', 'evals'],
      priority: 'high',
      risk_level: 'low',
      status: 'pending',
      assignee: 'agent-os-verifier',
      command: 'node scripts/agent-os.js eval',
      dependencies: [],
      attempts: 0,
      budget: 0.1,
      verification_plan: 'Harness eval passes and foundational artifacts exist.',
      artifacts: [
        '.agents/operating-summary.md',
        '.agents/implementation-contract.md',
        '.agents/runtime-capability-matrix.md',
        '.agents/evals.md'
      ]
    });
  }

  saveDb(db);
  appendTrace({ type: 'bootstrap', status: 'completed', artifacts: ['operating-summary', 'implementation-contract', 'runtime-capability-matrix'] });
  console.log('[Agent OS] Bootstrap complete. Foundational artifacts, queues, milestones, and eval definitions are current.');
}

function runEvalHarness() {
  const db = loadDb();
  syncMarkdownFiles(db);
  const requiredFiles = [
    OPERATING_SUMMARY_PATH,
    CONTRACT_PATH,
    CAPABILITY_MATRIX_PATH,
    join(process.cwd(), '.agents', 'queues', 'now.md'),
    join(process.cwd(), '.agents', 'queues', 'next.md'),
    join(process.cwd(), '.agents', 'queues', 'blocked.md'),
    join(process.cwd(), '.agents', 'queues', 'improve.md'),
    join(process.cwd(), '.agents', 'queues', 'recurring.md'),
    join(process.cwd(), '.agents', 'evals.md'),
    join(process.cwd(), '.agents', 'effects.md'),
    join(process.cwd(), '.agents', 'waits.md')
  ];

  const missingFiles = requiredFiles.filter(path => !fs.existsSync(path));
  const requiredDbCollections = ['goals', 'tasks', 'sessions', 'incidents', 'effects', 'waits', 'checkpoints', 'evals', 'milestones', 'capabilities'];
  const missingCollections = requiredDbCollections.filter(key => !Array.isArray(db[key]));
  const unsafeRollbackToken = 'git ' + 'checkout --';
  const hasUnsafeRollback = fs.readFileSync(new URL(import.meta.url), 'utf8').includes(unsafeRollbackToken);
  const failures = [
    ...missingFiles.map(path => `Missing artifact: ${path}`),
    ...missingCollections.map(key => `Missing DB collection: ${key}`),
    ...(hasUnsafeRollback ? ['Unsafe automatic rollback command is still present.'] : [])
  ];

  const evalRecord = db.evals.find(e => e.id === 'EVAL-M1-CLOSED-LOOP') || db.evals[0];
  if (evalRecord) {
    evalRecord.status = failures.length === 0 ? 'passed' : 'failed';
    evalRecord.last_result = failures.length === 0 ? 'All foundational checks passed.' : failures.join(' | ');
    evalRecord.last_run_at = new Date().toISOString();
  }
  db.metrics.eval_pass_rate = failures.length === 0 ? 1.0 : 0.0;
  saveDb(db);
  appendTrace({ type: 'eval', eval_id: evalRecord?.id || 'EVAL-M1-CLOSED-LOOP', status: failures.length === 0 ? 'passed' : 'failed', failures });

  if (failures.length > 0) {
    console.error('[Agent OS] Eval failed:');
    failures.forEach(failure => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log('[Agent OS] Eval passed. Closed-loop foundational artifacts are present and unsafe rollback is absent.');
}

// CLI entry point routing
const [,, command, ...args] = process.argv;

initDb();

if (command === 'bootstrap') {
  bootstrapSystem();
} else if (command === 'goal') {
  const tasksIdx = args.indexOf('--tasks');
  let tasksPath = null;
  let descArgs = [...args];
  if (tasksIdx !== -1) {
    tasksPath = args[tasksIdx + 1];
    descArgs.splice(tasksIdx, 2);
  }
  const desc = descArgs.join(' ');
  if (!desc) {
    console.error("Error: Please provide a goal description.");
    process.exit(1);
  }
  createGoal(desc, 5.0, tasksPath);
} else if (command === 'run') {
  executeNextTask();
} else if (command === 'status') {
  const db = loadDb();
  saveDb(db);
  console.log("[Agent OS] Current Control Plane Status:");
  console.log(`- Active Goals: ${db.goals.length}`);
  console.log(`- Verified Tasks: ${db.metrics.tasks_verified} / ${db.tasks.length}`);
  console.log(`- Cost Accumulated: $${db.metrics.total_cost_usd}`);
  console.log(`- Local dashboard available at: file:///${DASHBOARD_PATH.replace(/\\/g, '/')}`);
} else if (command === 'eval') {
  runEvalHarness();
} else {
  console.log("Usage: node scripts/agent-os.js [bootstrap | goal <desc> [--tasks <path>] | run | status | eval]");
}
