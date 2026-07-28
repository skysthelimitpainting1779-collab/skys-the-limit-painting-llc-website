---
name: execution-graph-gate
description: Validate the audited execution JSONL and lifecycle contract before session resume, node execution, handoff, or recovery.
---

# Execution Graph Gate

## Prerequisites

- Run from the integration worktree.
- Treat `.agents/execution/skys-limit-sequential-tdd-execution-graph-audited.jsonl` as the canonical input.
- Keep every check read-only.
- Never repair, reorder, or mark nodes complete from this workflow.

## Gate

```bash
python .agents/skills/hardened-validation/scripts/run.py npm run lifecycle:verify
python .agents/skills/hardened-validation/scripts/run.py python scripts/execution/validate_execution_graph.py \
  .agents/execution/skys-limit-sequential-tdd-execution-graph-audited.jsonl \
  --schema .agents/execution/skys-limit-sequential-tdd-execution-graph-audited.schema.json
```

Stop on any nonzero exit. Record the graph SHA-256, repository HEAD, command,
timestamp, and JSON output as evidence.

Do not resume execution when validation reports a hash mismatch, unknown
dependency, cycle, dirty worktree, missing completed checkpoint, active writer
lease, or production approval stop.

## Recovery

Restore the manifest-verified graph, then rerun both commands. A graph change
requires a new audit and pinned hash; never edit it merely to make the gate pass.
