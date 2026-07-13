---
type: workflow
title: Ship loop (RPI + goal + eval)
description: Fast shipping harness used by high-velocity agent teams.
tags: [workflow, rpi, goal, eval, ship]
---

# Ship loop workflow

```text
GOAL start → RESEARCH → PLAN → IMPLEMENT ⇄ VERIFY → DONE
                ↑__________________| (re-plan if wrong)
```

## Commands

| Step | Command |
|------|---------|
| Start | `npm run goal -- start "…"` |
| Research | `npm run goal -- phase research` + `graph:query` |
| Plan | `npm run goal -- phase plan` |
| Implement | `npm run goal -- phase implement` |
| Verify | `npm run goal:verify` or `npm run ship:eval` |
| Done | `npm run goal -- done` |
| Abort | `npm run goal -- abort` |

## Artifacts

```text
.agents/goals/<slug>/
  GOAL.md           # criteria
  research.md
  plan.md
  verify-last.json
  meta.json
.agents/goals/active.json
.agents/goals/_eval/last.json
```

## Mapping to industry practice

| Source | Piece |
|--------|--------|
| Karpathy | Think / simple / surgical / goal-driven |
| HumanLayer | RPI phases + keep context small |
| Anthropic | Deterministic graders; outcome > path |
| Guides + sensors | AGENTS.md guides; lint/test sensors |

## When to skip RPI

Trivial one-file fixes: still run `goal:verify` or `lint`/`test` before done.
