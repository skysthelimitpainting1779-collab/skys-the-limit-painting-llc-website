---
type: policy
title: Agents Operating Kernel
description: Minimal always-on operating rules for Agent OS v2. Full map in ONTOLOGY.md.
tags: [agents, kernel, ontology, ssot]
version: 2.0.0
---

# Agents operating kernel

**Map:** `.agents/ONTOLOGY.md` · **Health:** `npm run agentos:health` · **Purge bloat:** `npm run agentos:purge`

## Iron laws

1. **Signal over bulk** — load this kernel + query memory. Never dump wiki, `GRAPH_REPORT.md`, or skill packs.
2. **SSOT** — machine truth: Turso / `hub_db.json`. Policy truth: this file + `governance/`. Product truth: `src/` + tests.
3. **Graph before grep** — `npm run graph:query -- "<task>"` (budget 1500). Then open 1–3 cited files.
4. **Verify before done** — `npm run lint` / `npm test` / targeted checks. No “looks fine.”
5. **Learn on fail** — `node scripts/learning-loop.mjs record …` then `heal` if healable. Prefer `.learnings/ERRORS_INDEX.md`.
6. **No fake Entire skills** — no git-subject → skill. Need auth + real checkpoints. Anti-fake is hard-coded.
7. **Skills on trigger only** — one matching skill; evaluator rejects garbage.
8. **Domain bridge** — durable work links to Market / Service / Business-Objective.
9. **Trust but verify** — after writes, re-read files before claiming success.
10. **Proactive** — run `npm run agentos:health` at session start; act on its list.
11. **Vercel plugin + frontier stack** — platform decisions MUST use Vercel plugin skills (`knowledge-update` first). Stack SSOT: `.agents/STACK.md` and **`vercel.ts`** (`@vercel/config`). Defaults: **Fluid + Node 24**, Next 16 **`cacheComponents`**, **`src/proxy.ts`**, no free-Fluid Directus, no dual `vercel.json`.
12. **Root cause only — never treat symptoms** — fix the mechanism that fails (PATH, auth, code, config). Soft-exit wrappers, `|| true`, disabling checks, or “use absolute path forever” are **not** done unless a tracked ROOT CAUSE PENDING issue exists. Full policy: `.agents/governance/ROOT_CAUSE.md`.
13. **Session learn close** — after multi-step work, run `npm run learn:session:close` (or rely on Stop hook `session-learn`). Write `.learnings/session-manifest-latest.json` when you have successes/failures to record. Do not claim “learned” without `SESSION_CLOSE.md` evidence.
14. **Active prevention — not log-only** — lessons must change behavior. SessionStart injects `.learnings/ACTIVE_CONTEXT.md`; PreToolUse **denies** known-bad patterns (`next/dynamic`+`ssr:false`, nested `powershell -Command`, System32-bash soft-skips). After recording a failure, if it is machine-detectable, add a guard in `scripts/active-prevention.mjs`. Commands: `npm run learn:prevent` · `learn:prevent:rebuild`.

## Domain agents (specialists)

You are the **orchestrator** unless a domain system prompt was injected.  
**Protocol:** `.agents/domains/ORCHESTRATOR.md`

```bash
npm run domain:list
npm run domain:route -- path/to/file.tsx
npm run domain:prompt -- seo
npm run domain:enforce -- api --files a,b
npm run domain:error -- api --title "…" --error "…"
npm run domain:success -- api --title "…" --detail "…"
npm run domain:state -- api
npm run domain:sync -- all                  # local → Turso
npm run domain:pull -- all                  # Turso → local
```

Each domain has `state.json`, `learnings/errors.json`, `learnings/successes.json` — synced to Turso tables `domain_agent_state` + `domain_events`.

| If work is in… | Dispatch |
|----------------|----------|
| `src/components/ui/**` | `ui-ux` |
| `src/app/api/**` | `api` |
| Market/lead pages, `LeadForm` | `content-market` |
| SEO/metadata/sitemap | `seo` |
| `.github`, CI, vercel.json | `ci-devops` |
| `.agents`, learn/*, hooks | `agent-os` |
| App pages / Next lib | `frontend-vercel` |

Each domain has **its own** `.agents/domains/<id>/learnings/`. Do not dump domain lessons only into global `.learnings` without domain tag.

## Cold start (token budget)

```text
1. This file (once) — orchestrator kernel
2. ACTIVE_CONTEXT / SessionStart inject (top lessons — OBEY, do not re-fail)
3. domain:route paths → domain:prompt <id>
4. Domain learnings ERRORS_INDEX (that domain only)
5. npm run graph:query -- "<task>"
6. Open 1–3 source files inside jurisdiction
```

**Do not open:** bulk `wiki/`, `GRAPH_REPORT.md`, vendor skill packs wholesale, full `hub_db` dumps (unless harness). **No archives** — purged trees must stay gone (`npm run agentos:purge` hard-deletes violations).

## Closed loops

| Loop | Command spine |
|------|----------------|
| **Execute** | query → edit → verify → learn |
| **Architecture** | frame → research → validate → draft → **pressure** → lock → codify → prompt → close (`npm run arch:loop`, skill `architecture-loop`) |
| **Learn** | `learn-pipeline` → Turso → `learn:evolve` · `learn:evaluate` |
| **Proactive** | `agentos:health` / `agentos:improve` |
| **Graph** | `graph:query` · `graph:update` · `graph:wiki` |
| **Entire** | `entire login` then `agentos:entire-sync` (honest empty if offline) |

**Architecture vs execute:** topology/platform/stack decisions use **Architecture** (one pass, hard locks, handoff prompt). Implementation under `approved-for-implement` uses **Execute**. Workflow: `.agents/workflows/architecture-loop.md`.

## Product constraints (non-negotiable)

- Next.js App Router · industrial UI: **radius 0** · safety orange `#FF5A00` on charcoal (not white-on-orange)
- **No emojis** in product source
- External side effects: idempotency + effects ledger + approval when sensitive
- Public claims must be verifiable (no invented metrics)

## Stack (skim)

See `.agents/STACK.md`. Runtime Node **24.x**. Deploy: Vercel. Data: Supabase + Agent memory Turso (`TURSO_*`).

## MCP / tools (priority)

1. **graphify** via `npm run graph:query|path|explain`
2. **codebase-memory-mcp** for structural graph (if connected)
3. **github / vercel / supabase** MCP when those systems are the task
4. Grep/Read only after orientation

## Failure protocol

```bash
node scripts/learning-loop.mjs record --title "…" --error "…" --command "…"
node scripts/learning-loop.mjs heal
node scripts/learning-loop.mjs status
```

Read: `.learnings/ACTIVE_CONTEXT.md` (inject) + `.learnings/ERRORS_INDEX.md` + `.agents/governance/PREVENTION_RULES.md`.  
Hooks enforce; do not rely on memory alone.

## Self-evolution (allowed)

| Step | When |
|------|------|
| Record lesson | Real error / CI fail |
| Evolve skills | After outcomes in Turso |
| Evaluate skills | After codify — quarantine garbage |
| Update graph | After product code changes |
| Purge ontology bloat | `npm run agentos:purge` |

## Ontology layers (reminder)

`Runtime → Control → Policy → Memory → Capability → Product`  
Full entities/relations: **ONTOLOGY.md**.

## Commands cheat sheet

```bash
npm run agentos:health
npm run agentos:improve
npm run agentos:purge
npm run agentos:ontology
npm run graph:query -- "…"
npm run learn:pipeline
npm run learn:recommend
npm run learn:evolve
npm run learn:evaluate:apply
```
