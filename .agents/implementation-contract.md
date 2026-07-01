# Agent OS Implementation Contract

## Architecture

- Mode: harness-wrapper.
- Source of truth: `.agents/hub_db.json` plus generated markdown ledgers.
- Execution unit: task records with dependencies, status, assignee, command, verification plan, artifacts, traces, and checkpoints.
- Workflow shape: goal -> task graph -> claim -> execute -> verify -> evidence -> memory -> eval/improvement.

## Reliability Rails

- Mandatory phases write artifacts under `.agents/`.
- Validation happens before a task is marked verified.
- Repeated failures move to blocked/dead-letter state with an incident record.
- External effects are recorded in `.agents/effects/` with idempotency identity before action.
- Durable waits are represented under `.agents/waits/` and keep resume context.
- The harness does not automatically revert source files. Recovery is explicit and human-inspectable.

## Verification Gates

- Narrow code checks: `npm run lint`.
- Test suite: `npm test`.
- Production build: `npm run build`.
- Harness eval: `node scripts/agent-os.js eval`.
- Graph/wiki refresh after code or knowledge changes: `powershell -ExecutionPolicy Bypass -File "..\compile-all.ps1"`.
