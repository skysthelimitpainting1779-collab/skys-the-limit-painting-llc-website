---
type: policy
title: Naming SSOT — brand, slugs, systems
description: Single source of truth for names across Linear, GitHub, Vercel, npm, and local.
tags: [naming, linear, github, vercel, brand]
date: 2026-07-10
---

# Naming SSOT

**Brand (legal / marketing):** Sky's the Limit Painting LLC  
**Short brand:** Sky's the Limit Painting  
**Universal slug:** `skysthelimit`  
**Issue key:** `SKY` (Linear team)

Everything product-related uses the **`skysthelimit`** slug. Avoid `skys-the-limit`, `skysthelimit-collab`, `SKYREMEDY`, and bare `website` for new work.

---

## Canonical map

| Surface | Canonical name | Notes |
|---------|----------------|-------|
| **Domain** | `www.skysthelimitpaintingllc.com` | Public production host — do not rename |
| **Linear workspace** | `skysthelimit` | https://linear.app/skysthelimit |
| **Linear team** | Skysthelimit · key `SKY` | Single team |
| **Linear · platform project** | `skysthelimit · Platform` | CMS, homebase, portal, procurement |
| **Linear · reliability project** | `skysthelimit · Reliability` | P0 prod, security, leads, infra |
| **npm package** | `skysthelimit-website` | `package.json` `name` |
| **Vercel project** | `skysthelimit-website` | was `website` |
| **GitHub org** | `skysthelimitpainting1779-collab` | Org rename is optional / high cost |
| **GitHub repo (target)** | `skysthelimit-website` | Rename when ready (redirects preserved by GitHub) |
| **Local folder (target)** | `skysthelimit-website` | Rename folder after GH remote update |
| **Email** | `skysthelimitpainting1779@gmail.com` | Ops identity |

### Deprecated aliases (do not use in new docs/issues)

| Old | Replace with |
|-----|----------------|
| `SKYREMEDY-2026` | `skysthelimit · Reliability` |
| `Product Platform 2026` | `skysthelimit · Platform` |
| `skys-the-limit-painting-website` | `skysthelimit-website` |
| `skys-the-limit-painting-llc-website` | `skysthelimit-website` |
| `skysthelimit-collab` | `skysthelimit-website` |
| Vercel `website` | `skysthelimit-website` |

---

## Where truth lives

| Concern | System of record | Git? |
|---------|------------------|------|
| **Tasks, milestones, status, triage** | **Linear** | No (optional `SKY-XX` in commits) |
| **Working docs, status updates, playbooks** | **Linear Documents** (+ mirror in `docs/`) | Mirror when durable |
| **Agent operating system** | **Agent OS** (`.agents/`) | Yes — kernel, domains, skills |
| **Agent memory / lessons** | **Turso** + domain `learnings/` | Local JSON/MD + Turso sync |
| **Architecture locks, plans, DESIGN.md** | **Git repo** | Yes — versioned SSOT |
| **Code, env examples, CI** | **GitHub** | Yes |
| **Deployments, env vars, domains** | **Vercel** | Config in git (`vercel.ts`) |
| **Auth / leads / RLS** | **Supabase** | Migrations in git |
| **CMS content** | **Payload** (pooled Postgres + Blob) | Collections in git |

### Three layers (management → operate → ship)

```text
Linear          →  what to do (SKY-XX, milestones)
Agent OS        →  how agents work (domains, graph, learn, verify)
Git + Vercel    →  what ships (src/, vercel.ts, DESIGN.md)
```

Full Agent OS map: [`docs/AGENT_OS.md`](./AGENT_OS.md) · kernel [`.agents/AGENTS.md`](../.agents/AGENTS.md).

### Linear is the hub for management

Yes: **Linear is where we manage tasks, project status, and operational docs.**

**Agent OS** is where agents **route, learn, and stay in jurisdiction** — it does not replace Linear.

Git still holds **code-adjacent SSOT** (architecture plans, `DESIGN.md`, migrations) so agents and deploys stay reproducible. Pattern:

```text
Linear issue  →  points to plan path in repo
Linear doc    →  process / OS / status
Agent OS      →  domain:route · graph:query · learnings · agentos:health
Git docs/     →  durable technical truth
```

---

## Branch naming

Prefer Linear’s suggested branch (`gitBranchName` on the issue), e.g.:

```text
skysthelimitpainting1779/sky-16-m10-phase-0-locks-...
```

Or short form:

```text
sky-16-payload-phase0
```

---

## Rename runbook (destructive surfaces)

### Safe (done in-repo / Linear API)

- [x] Linear project display names
- [x] `package.json` name
- [x] `docs/NAMING.md` + `docs/LINEAR_OS.md`
- [x] Templates under `docs/templates/`

### Needs dashboard / CLI (you or agent with auth)

1. **Vercel** — rename project `website` → `skysthelimit-website`  
   - Dashboard → Project Settings → General → Project Name  
   - Or CLI if available: confirm no broken deploy hooks
2. **GitHub** — rename repo → `skysthelimit-website`  
   - Settings → General → Repository name  
   - Update local: `git remote set-url origin <new-url>`
3. **Local folder** — rename `skysthelimit-collab` → `skysthelimit-website` after remote update
4. **Linear Initiative** (UI) — `skysthelimit · 2026` containing both projects

---

## Templates index

| Template | Path |
|----------|------|
| Design system (Stitch) | `docs/templates/DESIGN.md` · live: `DESIGN.md` |
| Feature issue | `docs/templates/ISSUE_FEATURE.md` |
| Bug issue | `docs/templates/ISSUE_BUG.md` |
| Implementation plan | `docs/templates/PLAN.md` |
| Agent handoff | `docs/templates/HANDOFF.md` |
| Architecture decision | `docs/templates/ARCHITECTURE.md` |
| PR description | `docs/templates/PR.md` |
| Linear project status | `docs/templates/LINEAR_STATUS.md` |
| Linear OS | `docs/LINEAR_OS.md` |
