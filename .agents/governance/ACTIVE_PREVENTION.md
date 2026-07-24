---
type: policy
title: Active prevention — lessons must change behavior
description: Inject + hard-block recorded failures; logging alone is not learning.
tags: [governance, prevention, agents, learning]
date: 2026-07-10
version: 1.0.0
---

# Active prevention

**Status:** Mandatory (iron law 14 in `.agents/AGENTS.md`).

## Problem

Agents can **log** mistakes and still **repeat** them next session. Institutional memory that is never injected or enforced is a diary, not a control plane.

## Law

After a failure is recorded, the system must do **at least one** of:

1. **Inject** the lesson into cold-start / session context (always), and  
2. **Block** the machine-detectable form of the failure on PreToolUse when possible.

Claiming “we learned it” without inject + (when possible) guard is **not done**.

## Mechanism

| Layer | Artifact |
|-------|----------|
| Lessons store | `.learnings/index.json` + ERRORS_INDEX |
| Compact inject | `.learnings/ACTIVE_CONTEXT.md` (generated) |
| Engine | `scripts/active-prevention.mjs` |
| Hooks | SessionStart inject · UserPromptSubmit re-inject · PreToolUse deny |
| Close loop | `session-learn --close` rebuilds ACTIVE_CONTEXT |

```bash
npm run learn:prevent
npm run learn:prevent:rebuild
npm run learn:prevent:test
```

## Adding a new guard

When a failure is **repeatable by pattern** (tool name + command/content regex):

1. Record via `learning-loop record` (or domain:error).  
2. Add a `HARD_GUARDS` entry in `scripts/active-prevention.mjs` with `id` = error id.  
3. `npm run learn:prevent:test` must pass.  
4. Prefer **deny** for high-cost class (build-breakers, PATH regressions); **advise** for ambiguous policy.

If not machine-detectable: still inject via prevention text so the model sees it every session.

## Relationship to ROOT_CAUSE

- Active prevention **blocks re-entry** of known bad patterns.  
- Root-cause policy **forbids** shipping soft-skips as the fix.  
- Together: fix the mechanism, then keep the agent from reintroducing the broken pattern.

## Env

| Var | Effect |
|-----|--------|
| `ACTIVE_PREVENTION_SKIP=1` | No inject/deny |
| `ACTIVE_PREVENTION_SOFT=1` | Advise only (no deny) |
