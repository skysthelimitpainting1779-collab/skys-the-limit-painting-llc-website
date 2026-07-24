---
name: ship-loop
description: >
  Research-Plan-Implement (RPI) goal-driven ship loop for non-trivial tasks.
  Use when the user says ship loop, RPI, goal-driven, /goal, multi-step feature,
  or when a task needs research before coding. Do NOT use for one-line typos.
---

# Ship loop (RPI)

Inspired by HumanLayer RPI, Karpathy goal-driven execution, Anthropic evals (deterministic verify).

## When to activate

- Multi-file features, bugs with unclear root cause, refactors with risk
- User mentions goal, RPI, research first, ship loop

## Protocol

### 1. Start a goal

```bash
npm run goal -- start "<short title>"
```

Edit `.agents/goals/<slug>/GOAL.md` **success criteria** so they are checkable.

### 2. Research (R)

```bash
npm run goal -- phase research
npm run graph:query -- "<title>"
```

Write `.agents/goals/<slug>/research.md`:

- Exact files / symbols (1–3 primary)
- Data flow / failure mode
- Risks and non-goals

**Stop research** when you can name files to touch without guessing.

### 3. Plan (P)

```bash
npm run goal -- phase plan
```

Write `plan.md`: each step has a **verify** command or assertion.

Prefer tests-first for bugs: failing test → implement → pass.

### 4. Implement (I)

```bash
npm run goal -- phase implement
```

Surgical changes only (Karpathy). After each meaningful chunk:

```bash
npm run goal:verify
# or full ship eval:
npm run ship:eval
```

### 5. Done

```bash
npm run goal -- done
```

Blocked if verify fails. Do not claim success without green graders.

## Anti-patterns

- One-shot implement without research on complex tasks
- “Looks good” without `goal:verify`
- Expanding scope mid-implement (new goal or abort + restart)
- Loading wiki / GRAPH_REPORT instead of graph:query

## Evals note

`ship:eval` is a **regression suite** of deterministic graders (lint, test).  
Capability evals (new behaviors) = add real tests, then graduate into verify.
