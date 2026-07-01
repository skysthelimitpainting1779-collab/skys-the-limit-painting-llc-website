#!/usr/bin/env node
/**
 * convo-audit/scripts/audit.js
 *
 * Reads an agent conversation transcript (JSONL) and produces:
 *   1. HANDOFF-[date].md  — structured handoff document
 *   2. ERRORS.md entries  — error ledger in Eve/Vercel rule format
 *
 * Usage:
 *   node .agents/skills/convo-audit/scripts/audit.js \
 *     --transcript <path-to-transcript.jsonl> \
 *     --out <output-directory> \
 *     [--errors-ledger <path-to-ERRORS.md>]
 *
 * The transcript JSONL format is the Antigravity IDE brain log format:
 *   Each line is a JSON object with: step_index, source, type, content, tool_calls
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

// ─── Argument Parsing ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const transcriptPath = get('--transcript');
const outDir = get('--out') ?? '.agents/handoffs';
const errorsLedger = get('--errors-ledger') ?? '.learnings/ERRORS.md';

if (!transcriptPath) {
  console.error(
    'Usage: node audit.js --transcript <path> [--out <dir>] [--errors-ledger <path>]'
  );
  process.exit(1);
}

// ─── Signal Classifiers ──────────────────────────────────────────────────────

const ERROR_PATTERNS = [
  /error/i,
  /failed/i,
  /crash/i,
  /exception/i,
  /non-zero/i,
  /not found/i,
  /permission denied/i,
  /ENOENT/i,
  /cannot read/i,
  /invalid/i,
  /unexpected/i,
  /undefined/i,
  /null/i,
];

const DECISION_PATTERNS = [
  /we will/i,
  /decided to/i,
  /going with/i,
  /approach/i,
  /architecture/i,
  /instead of/i,
  /replaced/i,
  /switched/i,
];

const LESSON_PATTERNS = [
  /learned/i,
  /lesson/i,
  /note:/i,
  /remember/i,
  /important:/i,
  /never/i,
  /always/i,
  /must/i,
  /warning/i,
  /gotcha/i,
];

const COMPLETED_PATTERNS = [
  /created file/i,
  /successfully/i,
  /done\./i,
  /complete/i,
  /written to/i,
  /scaffolded/i,
  /committed/i,
];

const NEXT_STEP_PATTERNS = [
  /next step/i,
  /next:/i,
  /todo/i,
  /outstanding/i,
  /remaining/i,
  /not started/i,
  /pending/i,
  /will need to/i,
];

const REVERSAL_PATTERNS = [
  /revert/i,
  /reverted/i,
  /rolled back/i,
  /roll back/i,
  /undid/i,
  /undo/i,
  /changed .*back/i,
  /actually.*instead/i,
  /on second thought/i,
  /scratch that/i,
  /never ?mind/i,
];

const IN_PROGRESS_PATTERNS = [
  /in progress/i,
  /still working/i,
  /partially/i,
  /started but/i,
  /halfway/i,
  /work in progress/i,
  /wip/i,
  /not yet (?:done|finished|complete)/i,
];

const SKILL_DISCOVERED_PATTERNS = [
  /reusable/i,
  /extract .*(?:skill|helper|util)/i,
  /could be a skill/i,
  /repeated (?:flow|pattern)/i,
  /every time we/i,
  /keep (?:doing|having to)/i,
];

// Order matters: more specific / higher-signal buckets are checked first so a
// reversal isn't miscounted as a plain decision, etc. Every bucket declared in
// AGENTS.md §Step 2 is represented here.
function classify(text) {
  if (ERROR_PATTERNS.some((p) => p.test(text))) return 'ERROR';
  if (REVERSAL_PATTERNS.some((p) => p.test(text))) return 'REVERSAL';
  if (SKILL_DISCOVERED_PATTERNS.some((p) => p.test(text))) return 'SKILL_DISCOVERED';
  if (DECISION_PATTERNS.some((p) => p.test(text))) return 'DECISION';
  if (LESSON_PATTERNS.some((p) => p.test(text))) return 'LESSON';
  if (IN_PROGRESS_PATTERNS.some((p) => p.test(text))) return 'IN_PROGRESS';
  if (COMPLETED_PATTERNS.some((p) => p.test(text))) return 'COMPLETED';
  if (NEXT_STEP_PATTERNS.some((p) => p.test(text))) return 'NEXT_STEP';
  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const signals = {
    ERROR: [],
    REVERSAL: [],
    DECISION: [],
    LESSON: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    NEXT_STEP: [],
    SKILL_DISCOVERED: [],
  };
  const userMessages = [];
  const filesChanged = new Set();
  let stepCount = 0;

  console.log(`[convo-audit] Reading transcript: ${transcriptPath}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(transcriptPath),
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    let step;
    try {
      step = JSON.parse(line);
    } catch {
      continue;
    }
    stepCount++;

    const content =
      typeof step.content === 'string'
        ? step.content
        : JSON.stringify(step.content ?? '');

    // Collect user messages
    if (step.type === 'USER_INPUT') {
      userMessages.push(content.slice(0, 200));
    }

    // Collect file changes from tool calls
    if (Array.isArray(step.tool_calls)) {
      for (const tc of step.tool_calls) {
        const p = tc?.arguments?.TargetFile ?? tc?.arguments?.AbsolutePath;
        if (p) filesChanged.add(p);
      }
    }

    // Classify content signals
    const bucket = classify(content);
    if (bucket && content.length > 20) {
      signals[bucket].push(content.slice(0, 400).replace(/\n+/g, ' ').trim());
    }
  }

  const date = new Date().toISOString().split('T')[0];
  const signalTotal = Object.values(signals).reduce((a, b) => a + b.length, 0);

  // ─── Write HANDOFF.md ──────────────────────────────────────────────────────

  fs.mkdirSync(outDir, { recursive: true });
  const handoffPath = path.join(outDir, `HANDOFF-${date}.md`);

  const handoffMd = `---
type: handoff
title: "Session Handoff — ${date}"
date: "${date}"
status: PARTIAL
tags: [handoff, audit, session]
okf: v0.1
---

# Handoff Document — ${date}

> Generated by \`convo-audit\` skill. Steps audited: ${stepCount}. Signals extracted: ${signalTotal}.

---

## Session Summary

This session involved ${userMessages.length} user interactions over ${stepCount} conversation steps. ${filesChanged.size} files were touched. The session produced ${signals.COMPLETED.length} completed items, ${signals.ERROR.length} errors, and ${signals.NEXT_STEP.length} identified next steps.

User requests (summary):
${userMessages
  .slice(0, 5)
  .map((m, i) => `${i + 1}. ${m}`)
  .join('\n')}

---

## Completed Work

${
  signals.COMPLETED.length > 0
    ? signals.COMPLETED.map((s) => `- ${s}`).join('\n')
    : '- None detected automatically. Review transcript manually.'
}

---

## In Progress

${
  signals.IN_PROGRESS.length > 0
    ? signals.IN_PROGRESS.map((s) => `- ${s}`).join('\n')
    : '- None detected automatically.'
}

### Files Changed

${
  filesChanged.size > 0
    ? [...filesChanged].map((f) => `| TOUCHED | \`${f}\` |`).join('\n')
    : '| — | No files detected |'
}

---

## Errors Encountered

${
  signals.ERROR.length > 0
    ? signals.ERROR.map(
        (e, i) =>
          `### ERR-${String(i + 1).padStart(3, '0')}\n- **What**: ${e}\n- **Root Cause**: Review transcript for context\n- **Resolution**: Unknown — review manually`
      ).join('\n\n')
    : '- No errors detected automatically.'
}

---

## Decisions Made

${
  signals.DECISION.length > 0
    ? signals.DECISION.map(
        (d, i) =>
          `### DEC-${String(i + 1).padStart(3, '0')}\n- **Decision**: ${d}`
      ).join('\n\n')
    : '- No decisions detected automatically.'
}

---

## Reversals

${
  signals.REVERSAL.length > 0
    ? signals.REVERSAL.map(
        (r, i) =>
          `### REV-${String(i + 1).padStart(3, '0')}\n- **Reversal**: ${r}`
      ).join('\n\n')
    : '- No reversals detected automatically.'
}

---

## Lessons Learned

${
  signals.LESSON.length > 0
    ? signals.LESSON.map((l, i) => `${i + 1}. ${l}`).join('\n')
    : '- No lessons detected automatically.'
}

---

## Next Steps

${
  signals.NEXT_STEP.length > 0
    ? signals.NEXT_STEP.map((n, i) => `${i + 1}. [ ] ${n}`).join('\n')
    : '1. [ ] Review this document and complete any missing sections manually.'
}

---

## Skills Discovered

${
  signals.SKILL_DISCOVERED.length > 0
    ? signals.SKILL_DISCOVERED.map((s) => `- ${s}`).join('\n')
    : '- None detected automatically.'
}

---

## Environment State

- **Branch**: Unknown — run \`git branch --show-current\`
- **Build Status**: Unknown — run \`npm run build\`
- **Deployed**: Unknown

---

> **Note**: This document was auto-generated. Review each section and fill in context the script could not infer. Delete this note when complete.
`;

  fs.writeFileSync(handoffPath, handoffMd);
  console.log(`[convo-audit] HANDOFF written → ${handoffPath}`);

  // ─── Append ERRORS.md Entries ──────────────────────────────────────────────

  if (signals.ERROR.length > 0) {
    const errorEntries = signals.ERROR.map(
      (e, i) => `
---
title: "AUTO-${date}-${String(i + 1).padStart(3, '0')}: ${e.slice(0, 60)}"
impact: MEDIUM
impactDescription: "Auto-extracted from conversation audit — review and classify"
tags: [auto-extracted, audit, ${date}]
date: "${date}"
okf: v0.1
---

## AUTO-EXTRACTED ERROR

**What happened**: ${e}

**Root cause**: Review transcript for context.

**Prevention rule**: TBD — fill in after manual review.
`
    ).join('\n');

    fs.mkdirSync(path.dirname(errorsLedger), { recursive: true });
    fs.appendFileSync(
      errorsLedger,
      `\n\n<!-- convo-audit: ${date} -->\n${errorEntries}`
    );
    console.log(
      `[convo-audit] ${signals.ERROR.length} error entries appended → ${errorsLedger}`
    );
  }

  // ─── Summary ──────────────────────────────────────────────────────────────

  console.log(`
## Audit Complete

- HANDOFF.md written to: ${handoffPath}
- ERRORS.md entries appended: ${signals.ERROR.length}
- Steps audited: ${stepCount}
- Signals extracted: ${signalTotal}
  - Errors: ${signals.ERROR.length}
  - Reversals: ${signals.REVERSAL.length}
  - Decisions: ${signals.DECISION.length}
  - Lessons: ${signals.LESSON.length}
  - In Progress: ${signals.IN_PROGRESS.length}
  - Completed: ${signals.COMPLETED.length}
  - Next Steps: ${signals.NEXT_STEP.length}
  - Skills Discovered: ${signals.SKILL_DISCOVERED.length}
  `);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
