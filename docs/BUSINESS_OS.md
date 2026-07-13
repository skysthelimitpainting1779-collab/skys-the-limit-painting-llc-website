---
type: documentation
title: Business OS — Unified Command Center
description: Owner command center for Sky's the Limit Painting (Notion SSOT for weekly rhythm; Linear for execution).
tags: [notion, business-os, gtm, operations, command-center]
date: 2026-07-10
---

# Business OS — Command Center

**Live Notion:** [Command Center · Business OS](https://app.notion.com/p/e8110a799a894033a6863e0702039a2e)

**Company:** Sky's the Limit Painting LLC · Twin Cities  
**Markets:** residential · commercial · municipal / public sector

---

## Division of labor

| Concern | System of record |
|---------|------------------|
| Tasks, GTM epics, eng tickets, cycles | **Linear** (`SKY-XX`) — see [`LINEAR_OS.md`](./LINEAR_OS.md) |
| Owner weekly rhythm, SOPs, scorecard, CRM view | **Notion Business OS** (this system) |
| Website product / deploy | **Git + Vercel** |
| Lead storage / auth | **Supabase** |
| Agent coding behavior | Repo `AGENTS.md` |

**Rule:** Linear executes. Notion commands. One owner · one deadline · one measurable outcome.

---

## Operating system (5 databases)

| System | Controls | Cadence |
|--------|----------|---------|
| Quarterly Priorities | 3–5 outcomes that matter most | Weekly status |
| Projects & Action Items | Jobs, tasks, blockers (+ Linear links) | Daily |
| CRM & Pipeline | Leads → estimates → won/lost | Daily |
| Weekly Scorecard | Sales, production, cash, marketing metrics | Weekly |
| SOP Library | Repeatable company processes | Monthly review |

---

## Q3 priorities (seeded)

1. Lock brand voice & claim-safe messaging (all markets) — Linear SKY-139  
2. Ship shared sales process (new → won → handoff) — Linear SKY-138  
3. Residential acquisition engine live — GTM-1 / SKY-135  
4. Commercial GC outreach machine started — GTM-2 / SKY-136  
5. Municipal readiness packet + opportunity tracking — GTM-3 / SKY-137  
6. Establish weekly operating rhythm (10 consecutive weeks) — existing OS row  

---

## Weekly owner reset (60 min)

1. **Numbers — 5 min** — Scorecard exceptions only  
2. **Priorities — 10 min** — On track / at risk / off track  
3. **Customers + jobs — 10 min** — Pipeline, production, cash  
4. **Solve — 25 min** — Highest-impact issue → root cause → action  
5. **Commit — 10 min** — Owners, dates, three must-win outcomes  

Prep: fill scorecard Actuals; clear blocked items; next follow-up on every open estimate.

---

## Seed / rebuild

From repo root (requires Notion MCP OAuth in `~/.grok/mcp_credentials.json`):

```bash
node scripts/seed-business-os.mjs
```

Idempotency: re-running **creates additional rows** for priorities/CRM/scorecard/SOPs/projects. Prefer update-in-place for ongoing ops; re-seed only on empty DBs or after cleanup.

---

## Related

- [`LINEAR_OS.md`](./LINEAR_OS.md) — task hub  
- [`NAMING.md`](./NAMING.md) — package / deploy names  
- Linear GTM: https://linear.app/skysthelimit/project/skysthelimit-gtm-b47097455766  
- Website: https://www.skysthelimitpaintingllc.com  
