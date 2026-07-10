---
type: concept
title: Turso learning schema & CI coordination
description: How Entire summarization, CI outcomes, and Turso tables improve Agent OS over time.
tags: [learning, turso, entire, ci-cd, agent-os]
---

# Turso learning schema (how the system improves)

## Pipeline

```text
CI/CD Pipeline finishes (success|failure)
        │
        ▼ workflow_run
Learning Pipeline job
        │
        ├─ entire-to-agentos  → skills / workflows / rules / learnings index
        ├─ learn-pipeline     → structured Turso tables
        └─ artifacts          → RECOMMENDATIONS.md + LEARNING_SNAPSHOT.json
```

Local / manual:

```bash
npm run learn:pipeline -- --conclusion success --pipeline ci --job quality
npm run learn:query
npm run learn:recommend -- ci
```

## Schema (why each table exists)

| Table | Purpose | How it improves agents |
|-------|---------|-------------------------|
| `learn_episodes` | One unit of work (CI run, sync) | Trace *when* knowledge was gained |
| `learn_outcomes` | Pass/fail per SHA/pipeline | Trend CI health; link failures to fixes |
| `learn_lessons` | Deduped knowledge by fingerprint | **Core memory** — `times_seen` vs `times_helped` scores priority |
| `learn_lesson_episodes` | Lesson ↔ episode edges | Evidence trail for a lesson |
| `learn_skills` | Registered skill files from Entire | Prefer skills with higher `success_count` |
| `learn_patterns` | Aggregated recommendations | Category-level guidance without re-reading all lessons |
| `agent_os_docs` | Hub + learning_snapshot JSON | Cold-start blob for tools |

### Priority score (lesson)

```text
score = (times_seen - times_helped) * severityBoost + times_seen * 0.1
```

High score = failed often without proven fixes → surface first in `RECOMMENDATIONS.md`.

### Roles on link

- `caused` — observed during a failure episode  
- `fixed` — observed during a success after prior failures  
- `mentioned` — sync/codify without strong outcome  

On **CI success**, matching lessons get `times_helped` bump when role=`fixed`.

## Secrets

| Secret | Use |
|--------|-----|
| `TURSO_DATABASE_URL` | Shared Turso DB (`libsql://…`) |
| `TURSO_AUTH_TOKEN` | Turso auth |

If unset, pipeline uses `file:./.agents/agent-os.db` on the runner (ephemeral unless artifacted).

## Self-evolving skills

Skills under `.agents/skills/from-entire/` are **not frozen**. After each learn-pipeline:

```text
Turso stats (seen/helped/CI rate)
        │
        ▼
evolve-skills.mjs
        │
        ├─ rewrite SKILL.md sections (Learned prevention, Adaptive guardrails, Evolution)
        ├─ set status: active | proven | needs_hardening | demoted
        ├─ bump evolution_version
        └─ audit trail in _evolution/*.vN.md + learn_skill_evolutions table
```

| Status | Meaning | Agent behavior |
|--------|---------|----------------|
| `proven` | helped/seen ≥ 50% | Prefer early |
| `active` | normal | Use when relevant |
| `needs_hardening` | repeated fails, 0 helps | Use carefully; add tests |
| `demoted` | noisy | Prefer `learn:recommend` alternatives |

```bash
npm run learn:evolve
npm run learn:evolve:dry
```

## Agent cold-start

1. `.learnings/RECOMMENDATIONS.md`  
2. `.learnings/LEARNING_SNAPSHOT.json`  
3. `.agents/skills/from-entire/_evolution/CATALOG.md`  
4. `.learnings/ERRORS_INDEX.md`  
5. Turso `learn_lessons` / `learn_patterns` via `npm run learn:recommend`
