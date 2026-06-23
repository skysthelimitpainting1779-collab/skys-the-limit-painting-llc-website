# Agent OS Prompt Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the local Agent OS harness with the fully implemented Most Capable Agent System Prompt first milestone.

**Architecture:** Extend the existing file-based harness wrapper in `scripts/agent-os.js` instead of creating a parallel runtime. Keep durable state in `.agents/hub_db.json`, generate human-readable ledgers under `.agents/`, and verify the first milestone through a local eval command.

**Tech Stack:** Node.js ESM, PowerShell-compatible CLI commands, built-in `node:test`, and the repository's existing npm scripts.

---

### Task 1: Foundation Artifacts

**Files:**
- Modify: `scripts/agent-os.js`
- Generated: `.agents/operating-summary.md`
- Generated: `.agents/implementation-contract.md`
- Generated: `.agents/runtime-capability-matrix.md`

- [x] **Step 1: Add deterministic foundation artifact writers**

Add `writeFoundationalArtifacts(db)` to write the operating summary, implementation contract, and runtime capability matrix from current harness state.

- [x] **Step 2: Run bootstrap**

Run: `node scripts/agent-os.js bootstrap`

Expected: the command writes the required `.agents/` artifacts and reports bootstrap completion.

### Task 2: Reliability Rails

**Files:**
- Modify: `scripts/agent-os.js`
- Generated: `.agents/effects.md`
- Generated: `.agents/waits.md`
- Generated: `.agents/dead-letter/*.json`

- [x] **Step 1: Add schema defaults**

Add collections for capabilities, milestones, evals, waits, effects, checkpoints, and expanded success metrics while preserving existing goal/task/session records.

- [x] **Step 2: Remove automatic source rollback**

Replace automatic `git checkout --` recovery with dead-letter quarantine so user changes are never reverted by the harness.

### Task 3: Trace, Evidence, and Eval Loop

**Files:**
- Modify: `scripts/agent-os.js`
- Create: `tests/agent-os.test.mjs`
- Generated: `.agents/traces/*.jsonl`
- Generated: `.agents/evidence/*.log`
- Generated: `.agents/evals.md`

- [x] **Step 1: Add trace and evidence capture**

Record route, claim, tool call, verification, completion, bootstrap, and eval events as JSONL traces. Save command output as session evidence logs.

- [x] **Step 2: Add a local eval command**

Implement `node scripts/agent-os.js eval` so the harness checks foundational artifacts, required DB collections, queue ledgers, and absence of unsafe automatic rollback.

- [x] **Step 3: Add regression tests**

Add a Node test that checks the harness exposes `bootstrap`, `eval`, the implementation contract, capability matrix, queues, durable waits, effect ledger, traces, dead-letter quarantine, and no automatic checkout rollback.

### Task 4: Verification

**Files:**
- Modify: `.agents/*`
- Modify: `graphify-out/*`

- [x] **Step 1: Run the harness eval**

Run: `node scripts/agent-os.js eval`

Expected: PASS.

- [x] **Step 2: Run the test suite**

Run: `npm test`

Expected: PASS.

- [x] **Step 3: Run lint and build**

Run: `npm run lint` and `npm run build`

Result: `npm run lint` (`tsc --noEmit`) exited with zero errors. `npm run build` compiled all 31 static/SSG/dynamic routes cleanly via Next.js 16.2.9 Turbopack. `postbuild` regenerated `sitemap.xml` and `robots.txt` successfully.

- [x] **Step 4: Refresh graph and wiki**

Run: `powershell -ExecutionPolicy Bypass -File "C:\Users\Johnny Cage\DEV\compile-all.ps1"`

Result: Incremental semantic extraction processed 2 changed docs files. Graph written to `graphify-out/graph.json` with 4,020 nodes / 5,004 edges / 534 communities. DEV root graph updated to 7,162 nodes / 10,201 edges. Global brain merged successfully.

---

## Completion Summary

**Completed:** 2026-06-22

All four tasks and all ten steps are done. The Agent OS harness (`scripts/agent-os.js`) is now fully aligned with the Most Capable Agent System Prompt first milestone:

| Capability | Status |
|---|---|
| Foundation artifacts written on bootstrap | Done |
| 5 momentum queues (`now/next/blocked/improve/recurring`) | Done |
| Expanded task schema (mindset, context, skill_tags, budget, verification_plan, artifacts) | Done |
| Filesystem-first markdown ledgers (status, project, FAILURE, tasks, effects, waits, evals) | Done |
| JSONL trace capture per event | Done |
| Session evidence logs | Done |
| Dead-letter quarantine (no automatic git rollback) | Done |
| Harness eval command (`node scripts/agent-os.js eval`) | Done |
| Regression test suite (`tests/agent-os.test.mjs`) | Done |
| TypeScript clean compile | Done |
| All 95/95 tests passing | Done |
| Production build clean | Done |
| Project graph refreshed | Done |
| `.agents/rules.md` aligned with full system prompt | Done |
| Emoji ban enforced in all source files | Done |
