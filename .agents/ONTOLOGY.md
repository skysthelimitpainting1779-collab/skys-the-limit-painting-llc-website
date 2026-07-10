---
type: ontology
title: Agent OS ontology
description: Canonical layers, entities, relations, and closed loops for the agentic control plane.
tags: [ontology, agent-os, ssot, self-evolving]
version: 2.0.0
---

# Agent OS ontology v2

This is the map of **what exists and what is allowed to exist**. Anything not on this map is either **lazy-loaded** or **archive**.

## Purpose

Maximize **signal per token**: agents load a small kernel, query memory, act, verify, then **write learnings back** so the next run is better. No dump-driven context.

## Layers (load order)

```text
L0  RUNTIME     host agent + hooks (Cursor/Claude/Grok/Gemini/Husky)
L1  CONTROL     goals · tasks · hub_db / Turso  (machine SSOT)
L2  POLICY      AGENTS.md · governance/ · rules/  (human+agent norms)
L3  MEMORY      Turso learn_* · .learnings/ · graphify query · knowledge/
L4  CAPABILITY  **domain agents** (`.agents/domains/*`) · skills (on trigger)
L5  PRODUCT     src/ · scripts/ · CI · Vercel  (the work) — **owned by domains**
```

## Domain agents (one folder = one specialist)

Each domain under `.agents/domains/<id>/` is a full agent package:

| File | Role |
|------|------|
| `AGENT.md` | Identity + constraints |
| `SYSTEM_PROMPT.md` | Compiled system prompt for subagents |
| `metadata.json` | Jurisdiction, MCPs, skills |
| `rules/` | Hard constraints |
| `skills/` | Domain-local pointers |
| `learnings/` | **Isolated** ERRORS_INDEX + PREVENTION (not shared) |

**Registry:** `.agents/domains/REGISTRY.json`  
**Router:** `npm run domain:route -- <path>`  
**Enforce:** `npm run domain:enforce -- <id> --files a,b`  
**Learn:** `npm run domain:learn -- <id> --title "…" --error "…"`  
**Prompt:** `npm run domain:prompt -- <id>`

| Agent id | Owns (summary) |
|----------|----------------|
| `frontend-vercel` | App routes, lib, views, Next config |
| `ui-ux` | `src/components/ui`, design system |
| `api` | `src/app/api/**`, optional `backend/**` |
| `backend-express` | `backend/**` only (if present) |
| `seo` | metadata, JsonLd, sitemap, robots |
| `content-market` | market pages, LeadForm, copy-facing views |
| `ci-devops` | `.github`, husky, vercel, CI scripts |
| `agent-os` | `.agents`, learn/*, graph-context, hooks |

**Rule:** A domain agent may write **only** its `allow_globs`. Cross-domain work → orchestrator routes multiple agents; no agent edits foreign paths.

| Layer | Open by default? | Token rule |
|-------|:----------------:|------------|
| L0 | implicit | — |
| L1 | if goals matter | hub/status only |
| L2 | **yes (kernel)** | AGENTS.md skim + 1 rule file |
| L3 | **query** | never bulk wiki/report |
| L4 | **trigger only** | one skill |
| L5 | after graph query | 1–3 files |

## Entity types

| Type | ID shape | Lives in | Owner loop |
|------|----------|----------|------------|
| **Goal** | `GOAL-n` | hub_db / Turso | plan → decompose → complete |
| **Task** | `GOAL-n-Tm` | hub_db | claim → run → verify → close |
| **Policy** | `POL-nnn` | project.md / governance | amend deliberately |
| **Lesson** | fingerprint | Turso `learn_lessons` + `.learnings` | record → heal → recommend |
| **Skill** | slug | `.agents/skills/*` | codify → **evaluate** → evolve |
| **Outcome** | `out-*` | Turso `learn_outcomes` | CI / verify results |
| **Episode** | `ep-*` | Turso `learn_episodes` | learn-pipeline |
| **Pattern** | `category:*` | Turso `learn_patterns` | recompute |
| **Graph node** | graphify id | `graphify-out/graph.json` | query / update |
| **Effect** | effect id | effects/ | side-effect ledger |
| **Dead letter** | task id | dead-letter/ | quarantine after N fails |

## Relations (allowed edges)

```text
Goal  --decomposes--> Task
Task  --produces-->   Outcome | Lesson | Effect
Outcome --updates-->  Lesson.times_seen | times_helped
Lesson  --binds-->    Skill | Prevention rule
Skill   --gated_by--> Quality verdict (pass|warn|quarantine|reject)
Episode --contains--> Lesson, Outcome
Graph   --orients-->  Product files (src/, scripts/)
Policy  --constrains--> Task, Skill, Product
```

**Forbidden edges:** `git commit subject → Skill` (anti-fake).  
**Forbidden bulk edges:** `Agent → all of wiki | GRAPH_REPORT | vendor skill pack`.

## Closed loops (self-improving)

### 1. Execution loop (every task)

```text
COLD START → GRAPH QUERY → MINIMAL READ → ACT → VERIFY
     ↑                                              ↓
     └──────── LEARN (record/heal) ← FAIL ──────────┘
                    ↓
              SUCCESS → optional entire-sync → graph:update
```

### 2. Learning loop (durable memory)

```text
failure | CI outcome
    → learning-loop.record / learn-pipeline
    → Turso lessons + outcomes + patterns
    → RECOMMENDATIONS.md (cold)
    → evolve-skills (proven / harden / demote)
    → evaluate-skills (quarantine garbage)
```

### 3. Proactive loop (session start)

```text
health check
  → ontology validate
  → Turso / graph present?
  → recommend top lessons
  → graphify stale? suggest update
  → Entire auth? (honest blocker, no fake lessons)
```

### 4. Architecture loop (topology / platform decisions)

```text
FRAME → RESEARCH (tiered E#) → VALIDATE (claim matrix)
  → DRAFT v1 → PRESSURE (cost/security/ops/drift)
  → LOCK (hard + re-open triggers) → CODIFY (plan/STACK/handoff)
  → PROMPT (implementer) → CLOSE (approved-for-implement)
       │
       └─ re-enter only on documented re-open trigger
```

**When:** CMS host, Docker/Services vs native, auth split, DB/media, multi-service.  
**Not when:** bugfix under locked plan (use execution loop).  
**SSOT:** `.agents/workflows/architecture-loop.md` · skill `architecture-loop` · `npm run arch:loop`  
**Runs:** `docs/architecture/` · example `docs/ARCHITECTURE_CMS_LOOP.md`

## Directory contract (`.agents/`)

### Active (keep)

| Path | Role |
|------|------|
| `ONTOLOGY.md` | this map |
| `AGENTS.md` | operating **kernel** (only always-read doc) |
| `hub_db.json` | control plane snapshot (Turso preferred) |
| `state.json` | runtime mirror (may lag hub) |
| `project.md` | goals + POL-* |
| `STACK.md` | tech constraints |
| `governance/` | prevention + hard rules |
| `knowledge/` | curated durable notes only |
| `rules/` | always-on short rules (graphify) |
| `skills/` | on-demand; evaluator gates `from-entire` |
| `domains/` | domain packs (backend, seo, …) |
| `queues/` | now/next/blocked |
| `checkpoints/` | harness plans |
| `dead-letter/` | failed tasks |
| `effects/` · `waits/` · `evidence/` · `traces/` | control-plane journals |
| `workflows/` | short workflows only (`architecture-loop.md`, …) |

### Forbidden (must not exist)

| Path | Why |
|------|-----|
| `_archive/` | **hard-deleted** — never reintroduce |
| `dashboard.html`, `*m1_m5*`, handoffs dumps | bloat — `npm run agentos:purge` removes |
| bulk auto-wiki under `.agents/wiki/` | only `wiki/README.md` policy; graph wiki is `graphify-out/wiki` |

## Skill load policy

1. Match **description triggers** only.
2. Prefer **status: pass|proven|active** with quality_verdict ≠ reject.
3. Never load quarantined / `_archive` / vendor pack wholesale.
4. Project skills: `skill-evaluator`, `entire*`, `testing-website`.
5. Vendor packs (vercel-*, marketing): use when task domain matches — **one** skill.

## Truth hierarchy (conflict resolution)

1. **Product code + tests** (L5 verified)
2. **Turso lessons** with times_helped > 0
3. **governance/PREVENTION_RULES**
4. **AGENTS.md / ONTOLOGY**
5. **Graph query** (orientation, not law)
6. **Skill text**
7. **Model prior**

## Self-evolution rules

| Action | Allowed when |
|--------|----------------|
| Upsert lesson | Real failure / CI / checkpoint body |
| Write skill | Skill-worthy Entire signal + evaluator pass/warn |
| Evolve skill | Turso stats after learn-pipeline |
| Demote skill | seen high, helped 0 |
| Quarantine skill | evaluator reject / one-off / template |
| Fake git→skill | **never** |

## Proactive obligations

At session start (or `npm run agentos:health`):

1. Ontology dirs valid  
2. Graph exists and not absurdly stale  
3. Surface top recommendations  
4. Do not invent Entire lessons if not logged in  

After durable product change:

1. Verify (`lint` / `test`)  
2. `graph:update`  
3. Record lessons on failure  

## Domain taxonomy bridge

Every durable node must link to at least one:

- **Market** — SEO, AI crawlability, audience  
- **Service** — painting offerings  
- **Business-Objective** — lead capture, conversion, revenue  

Technical-only nodes bridge to the nearest of the three.

## Orchestrator

See `.agents/domains/ORCHESTRATOR.md` — dispatch recipe, handoff template, memory split.

## Version

- Ontology **2.1.0** — domain agents with state/errors/successes + Turso; hard-delete purge; orchestrator protocol.
- Bump minor when entities/relations change; major when load order or SSOT moves.
