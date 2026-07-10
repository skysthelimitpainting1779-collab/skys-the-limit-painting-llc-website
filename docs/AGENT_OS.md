---
type: documentation
title: Agent OS — skysthelimit operating system for coding agents
description: How the in-repo Agent OS works — kernel, domains, graph, learnings, Turso, Linear bridge.
tags: [agent-os, agents, ontology, domains, linear, skysthelimit]
date: 2026-07-10
version: 1.0.0
---

# Agent OS — skysthelimit

**Product slug:** `skysthelimit` · **npm:** `skysthelimit-website`  
**Kernel:** [`.agents/AGENTS.md`](../.agents/AGENTS.md) · **Ontology:** [`.agents/ONTOLOGY.md`](../.agents/ONTOLOGY.md)  
**Stack:** [`.agents/STACK.md`](../.agents/STACK.md) · **Health:** `npm run agentos:health`  
**Human task hub:** [Linear](https://linear.app/skysthelimit) · [LINEAR_OS](./LINEAR_OS.md) · [NAMING](./NAMING.md)

Agent OS is the **in-repo operating system for every coding agent** (Cursor, Claude Code, Gemini, Grok, Codex, CI). It is **not** a separate deploy. It lives under `.agents/` + scripts + Turso memory.

---

## Where truth lives (three layers)

```text
┌─────────────────────────────────────────────────────────────┐
│  LINEAR (human + agent work management)                     │
│  Issues · milestones · status · process docs                │
│  Projects: skysthelimit · Platform · Reliability            │
└───────────────────────────┬─────────────────────────────────┘
                            │ SKY-XX links · plan paths
┌───────────────────────────▼─────────────────────────────────┐
│  AGENT OS (how agents work in this repo)                    │
│  Kernel · domains · graph · learnings · skills · governance │
│  Memory: Turso + hub_db.json · queues under .agents/queues  │
└───────────────────────────┬─────────────────────────────────┘
                            │ edits / PRs
┌───────────────────────────▼─────────────────────────────────┐
│  PRODUCT (what ships)                                       │
│  src/ · vercel.ts · Supabase · Payload /cms · DESIGN.md     │
│  Deploy: Vercel Fluid · Node 24 · skysthelimit-website      │
└─────────────────────────────────────────────────────────────┘
```

| Layer | System | Responsibility |
|-------|--------|----------------|
| **Manage** | Linear | What to do, priority, status, who |
| **Operate** | Agent OS | How agents route, learn, verify, stay in jurisdiction |
| **Ship** | Git + Vercel | Code, architecture SSOT, deploys |

Agents must not invent work outside Linear (when a ticket exists) **and** must not ignore Agent OS iron laws.

---

## Cold start (every session)

```text
1. npm run agentos:health          # proactive checklist
2. Load kernel only: .agents/AGENTS.md  (not wiki dumps)
3. npm run domain:route -- <paths>  →  domain:prompt <id>
4. npm run graph:query -- "<task>"  # budgeted subgraph first
5. Open 1–3 files inside domain jurisdiction
6. If Linear issue: read SKY-XX + plan path in docs/
```

**Never bulk-load:** `wiki/`, `GRAPH_REPORT.md`, full skill packs, full `hub_db` dumps.

---

## Iron laws (kernel summary)

From `.agents/AGENTS.md`:

1. **Signal over bulk** — kernel + query; no dumps  
2. **SSOT** — Turso / hub machine truth; policy in kernel + governance; product in `src/`  
3. **Graph before grep** — `graph:query` then open cited files  
4. **Verify before done** — lint / test / targeted checks  
5. **Learn on fail** — domain `learnings/` + learning-loop  
6. **No fake Entire skills** — no inventing git→skills  
7. **Skills on trigger only** — one matching skill  
8. **Domain bridge** — Market / Service / Business-Objective  
9. **Trust but verify** — re-read after writes  
10. **Proactive health** — `agentos:health` at start  
11. **Vercel plugin + STACK** — Fluid, Node 24, `vercel.ts`, no dual `vercel.json`  
12. **Root cause only — never treat symptoms** — full policy: `.agents/governance/ROOT_CAUSE.md`  

### Toolchain: bash on Windows

`npm run agentos:health` reports `bash.ok`. If false, fix Machine PATH with `scripts/fix-windows-bash-path.ps1` (Admin). Do **not** soft-skip hooks as the only response.  

---

## Layout (`.agents/`)

```text
.agents/
├── AGENTS.md              # Always-on kernel (orchestrator)
├── ONTOLOGY.md            # Full map / layers
├── STACK.md               # Product platform stack SSOT
├── project.md
├── ontology.manifest.json
├── hub_db.json            # Local hub machine state
├── agent-os.db
├── domains/               # Specialist agents (jurisdiction)
│   ├── REGISTRY.json
│   ├── ORCHESTRATOR.md
│   ├── README.md
│   ├── frontend-vercel/
│   ├── ui-ux/
│   ├── api/
│   ├── seo/
│   ├── content-market/
│   ├── ci-devops/
│   ├── agent-os/
│   └── backend-express/
├── skills/                # Triggered skills (architecture-loop, vercel-*, design, …)
├── workflows/             # architecture-loop, graphify, research
├── governance/            # PREVENTION_RULES, mandatory learning, …
├── knowledge/             # Turso notes, lint guides
├── queues/                # now / next / blocked / improve / recurring
├── evidence/ · traces/ · checkpoints/
└── wiki/                  # Do not bulk-load
```

Root entrypoint for IDEs: [`Agents.md`](../Agents.md) → points at kernel.

---

## Domain agents

Orchestrator routes; specialists **own** globs and learnings.

| Domain | Jurisdiction (examples) | Linear areas |
|--------|-------------------------|--------------|
| **frontend-vercel** | `src/app/**`, `src/lib/**`, `src/views/**`, Next config | area:portal, homebase pages |
| **ui-ux** | `src/components/ui/**`, CSS, design tokens | area:design |
| **api** | `src/app/api/**`, leads, supabase server helpers | area:leads, security APIs |
| **seo** | metadata, sitemap, AI crawl | area:seo |
| **content-market** | markets, CMS public reads, LeadForm, Payload content | area:cms |
| **ci-devops** | `.github/**`, Vercel env/deploy scripts | area:infra |
| **agent-os** | `.agents/**`, learn pipeline, hooks | (process) |
| **backend-express** | `backend/**` if present | — |

### Domain commands

```bash
npm run domain:list
npm run domain:route -- src/app/api/leads/route.ts
npm run domain:prompt -- content-market
npm run domain:enforce -- api --files a,b
npm run domain:error -- api --title "…" --error "…"
npm run domain:success -- api --title "…" --detail "…"
npm run domain:state -- api
npm run domain:status -- api
npm run domain:sync -- all          # local → Turso
npm run domain:pull -- all         # Turso → local
npm run domain:compile -- all
```

Each domain folder: `AGENT.md`, `SYSTEM_PROMPT.md`, `rules/`, `learnings/`, `state.json`, `metadata.json`.

---

## Memory: Turso + local

| Store | Use |
|-------|-----|
| **Turso** (`TURSO_*`) | Durable Agent OS memory — domain state, events, learn lessons |
| **hub_db.json** | Local hub snapshot |
| **domain learnings/** | Per-domain errors/successes (JSON + MD) |
| **.learnings/** | Global error index (prefer domain-tagged) |
| **Entire** | Session checkpoints linked to git (`agentos:entire-sync`) |

```bash
npm run agentos:migrate-turso
npm run agentos:pull-turso
npm run domain:sync -- all
npm run agentos:entire-sync
```

### Is Turso being used? **Yes (Agent OS only)**

Verified via `npm run agentos:health`:

```json
"turso": {
  "ok": true,
  "mode": "remote",
  "url_host": "agent-os-learning-….turso.io",
  "lessons": 4
}
```

| Concern | Backend |
|---------|---------|
| Agent learnings / domain sync / hub dual-write | **Turso** remote (`libsql://agent-os-learning-…`) |
| Leads, portal auth, RLS | **Supabase** |
| CMS content / media | **Payload Postgres + Vercel Blob** |

Env: `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` in `.env.local` (and CI secrets for learn-pipeline).  
If unset, store falls back to `file:./.agents/agent-os.db` or JSON.  
Schema: `.agents/knowledge/LEARNING_TURSO.md`.

---

## Closed loops

| Loop | Spine |
|------|--------|
| **Execute** | graph query → edit in domain → verify → learn |
| **Architecture** | frame → research → validate → draft → pressure → lock → codify → prompt (`npm run arch:loop`, skill `architecture-loop`) |
| **Learn (session)** | `npm run learn:session:close` → domain sync → Turso → resolve known → SESSION_CLOSE.md (**required** after multi-hour work) |
| **Learn (CI)** | `learn-pipeline.yml` after CI + weekly schedule |
| **Proactive** | `agentos:health` · `agentos:improve` · `agentos:purge` |
| **Graph** | `graph:query` · `graph:update` · `graph:path` · `graph:explain` |
| **Linear** | Issue SKY-XX → plan in `docs/` → PR → issue Done |

Full session automation: [`docs/SESSION_LEARN.md`](./SESSION_LEARN.md).

Architecture vs execute: topology/platform uses **architecture-loop** until `approved-for-implement`; then execute under locks.

---

## Skills (triggered, not dumped)

Examples under `.agents/skills/`:

| Skill | When |
|-------|------|
| `architecture-loop` | Stack / CMS host / topology decisions |
| `vercel-*` / plugin knowledge-update | Deploy, env, Fluid, cache |
| `shadcn` / design skills | Product UI |
| `stitch-design-taste` | Generate/update DESIGN.md for Stitch |
| `supabase` | Auth, RLS, migrations |
| `convo-audit` | Session handoff extraction |
| `testing-website` | Site verification after UI changes |

Evaluator quarantines garbage skills (`skill-evaluator`).

---

## Queues (local agent backlog)

`.agents/queues/`:

| File | Role |
|------|------|
| `now.md` | Active agent focus |
| `next.md` | Up next |
| `blocked.md` | Waiting |
| `improve.md` | Agent OS self-improve |
| `recurring.md` | Cadence jobs |

**Linear is primary for human-visible work.** Queues are optional agent-local scratch; promote durable tasks to Linear (`skysthelimit · Platform` / `Reliability`).

---

## Agent OS ↔ Linear bridge

| Agent OS | Linear |
|----------|--------|
| Domain work starting | Issue in Platform or Reliability with `area:*` |
| Architecture lock | Comment on epic + plan in git; label `needs-decision` until locked |
| Failure learned | Optionally comment on SKY-XX; always domain `learnings/` |
| Done verified | Move issue → In Review / Done + evidence |
| Naming | `docs/NAMING.md` · project names `skysthelimit · *` |
| Design | Root `DESIGN.md` · skill stitch-design-taste |

### Suggested labels for agent work

- `agent-ready` — safe for autonomous implement  
- `!implement` / `!plan` / `!verify` / `!deploy` — phase (one playbook)  
- `human-only` — secrets, DNS, billing, OAuth consoles  

### Domain → Linear area (default)

```text
content-market + Payload     → area:cms
frontend-vercel /admin shell → area:homebase
frontend-vercel /portal      → area:portal
api leads                    → area:leads
ci-devops                    → area:infra
ui-ux                        → area:design
seo                          → area:seo
```

---

## Key npm scripts (Agent OS)

```bash
# Health & ontology
npm run agentos:health
npm run agentos:improve
npm run agentos:purge
npm run agentos:purge:dry
npm run agentos:cold-start
npm run agentos:validate
npm run agentos:ontology

# Graph
npm run graph:query -- "how does portal auth work"
npm run graph:update
npm run graph:path -- A B
npm run graph:explain -- node

# Domains
npm run domain:list
npm run domain:route -- <path>
npm run domain:prompt -- <id>
npm run domain:sync -- all

# Architecture
npm run arch:loop

# Learning
node scripts/learning-loop.mjs record --title "…" --error "…" --command "…"
node scripts/learning-loop.mjs heal
node scripts/learning-loop.mjs status
```

---

## Product constraints Agent OS enforces

- Next App Router · industrial marketing UI **radius 0** · safety orange `#FF5A00`  
- **No emojis** in product source  
- Payload at **`/cms`** only — never overwrite `/admin`  
- Portal = Supabase OAuth; CMS = Payload users  
- One Vercel project, Fluid, Node 24, `vercel.ts` only  
- Public claims verifiable  
- See `DESIGN.md` + `docs/NAMING.md`  

---

## Governance

| Doc | Role |
|-----|------|
| `.agents/governance/PREVENTION_RULES.md` | Hard prevention |
| `.agents/governance/MANDATORY_ERROR_LEARNING.md` | Fail → learn |
| `.agents/governance/RULES.md` | General rules |
| `.agents/governance/EMOJI_RESTRICTION.md` | No product emojis |

---

## Related docs

| Doc | Topic |
|-----|--------|
| [NAMING.md](./NAMING.md) | Brand / slug across systems |
| [LINEAR_OS.md](./LINEAR_OS.md) | Linear as task hub |
| [templates/](./templates/) | Issue / plan / handoff / DESIGN templates |
| [PAYLOAD_CMS_PLAN.md](./PAYLOAD_CMS_PLAN.md) | CMS architecture |
| [SYSTEM_MAP_E2E.md](./SYSTEM_MAP_E2E.md) | Product surfaces E2E |
| `.agents/domains/README.md` | Domain package model |
| `.agents/workflows/architecture-loop.md` | Architecture loop |

---

## One-line mental model

**Linear decides work. Agent OS runs agents safely. Git + Vercel ship the product.**
