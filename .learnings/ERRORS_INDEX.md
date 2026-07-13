---
type: ledger
title: Error Learning Index
description: Token-cheap cold-start for agents. Full dumps in archive/; state in index.json.
tags: [errors, learning, index, self-heal]
---

# Error Learning Index

> **Agent cold-start:** read THIS file only (not full `ERRORS.md`).
> Updated: 2026-07-13T18:00:20.674Z | Unique: 41 | Records: 87 | Dupes suppressed: 38 | Auto-heals: 1

## Open / needs attention

- **ERR-20260713-2d70** [general/medium] Synthetic failure dedupe-test-1783965620221 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260713-510d** [general/medium] Synthetic failure dedupe-test-1783965602559 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260713-c4db** [general/medium] Synthetic failure dedupe-test-1783965419315 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260713-956a** [general/medium] Synthetic failure dedupe-test-1783965168168 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260713-d1ae** [general/medium] Synthetic failure dedupe-test-1783965097113 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260713-59ae** [general/medium] Synthetic failure dedupe-test-1783965060949 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260713-5751** [general/medium] Synthetic failure dedupe-test-1783965026324 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260710-28ec** [general/medium] Synthetic failure dedupe-test-1783703913505 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260710-f905** [general/medium] Synthetic failure dedupe-test-1783703882913 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260710-d34f** [general/medium] Synthetic failure dedupe-test-1783691871271 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver

## Top lessons (deduped)

| ID | Cat | Status | × | Lesson |
|----|-----|--------|---|--------|
| ERR-20260713-2d70 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260713-510d | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260713-c4db | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260713-956a | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260713-d1ae | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260713-59ae | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260713-5751 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-28ec | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-f905 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-d34f | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-2de4 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-0b5d | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-34b7 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-1182 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-bea3 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-2aa4 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-96d1 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-cee9 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-b6d4 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-5c1f | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |

## Loop commands

```bash
node scripts/learning-loop.mjs status
node scripts/learning-loop.mjs heal
node scripts/learning-loop.mjs compact
node scripts/learning-loop.mjs record --title "..." --error "..." --command "..."
```

## Read order for agents

1. `.learnings/ERRORS_INDEX.md` (this file)
2. `.agents/governance/PREVENTION_RULES.md` (if relevant category)
3. `.learnings/index.json` for machine counters (optional)
