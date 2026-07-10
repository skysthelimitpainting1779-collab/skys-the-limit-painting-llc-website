---
type: documentation
title: Linear OS — workspace operating manual
description: How skysthelimit uses Linear as the hub for tasks and ops docs.
tags: [linear, process, agents, project-management, naming]
date: 2026-07-10
---

# Linear OS — skysthelimit

**Live Linear doc:** [Linear OS](https://linear.app/skysthelimit/document/linear-os-workspace-operating-manual-7a94e6db17cb)  
**Workspace:** [skysthelimit](https://linear.app/skysthelimit) · Team: **Skysthelimit** · key **SKY**  
**Naming SSOT:** [`docs/NAMING.md`](./NAMING.md)

---

## Linear is the hub (management)

| Concern | System |
|---------|--------|
| **Tasks, milestones, triage, status** | **Linear** |
| **Process / OS docs** | Linear Documents (+ mirror in `docs/`) |
| **Agent behavior (route, learn, verify)** | **Agent OS** — [AGENT_OS.md](./AGENT_OS.md) · `.agents/AGENTS.md` |
| **Architecture, DESIGN.md, plans, code** | **Git** (versioned) |
| **Deploy / env** | **Vercel** (`skysthelimit-website`) |
| **Auth / data** | **Supabase** |
| **Agent memory** | **Turso** (Agent OS only — not product CMS) |

Agents and humans create work in **Linear**, not GitHub Issues. PRs live on GitHub and link `SKY-XX`.  
Agents **execute** work under Agent OS iron laws (domains, graph-first, learn-on-fail).

### Agent OS ↔ Linear

| Step | Linear | Agent OS |
|------|--------|----------|
| Pick work | Issue `agent-ready` / assigned | `agentos:health` · `domain:route` |
| Implement | Status In Progress | `graph:query` · domain jurisdiction · skills |
| Fail | Comment on SKY-XX | `domain:error` + learning-loop |
| Done | In Review / Done + evidence | `domain:success` · lint/tests |

See full map: **[docs/AGENT_OS.md](./AGENT_OS.md)**.

---

## Structure

| Layer | Name |
|-------|------|
| **Team** | Skysthelimit (`SKY`) |
| **Projects** | `skysthelimit · Reliability` · `skysthelimit · Platform` |
| **Milestones** | R0–R2 (reliability) · M1–M4 (platform) |
| **Epics** | Parent issues (e.g. SKY-12–15) |
| **Cycles** | Enable in UI (2-week recommended) |
| **Initiative (UI)** | `skysthelimit · 2026` → both projects |

### Project links

| Project | URL |
|---------|-----|
| skysthelimit · Reliability | https://linear.app/skysthelimit/project/skysthelimit-reliability-a29ad741ff6a |
| skysthelimit · Platform | https://linear.app/skysthelimit/project/skysthelimit-platform-23e9f741cb38 |

### Package / deploy names

| Surface | Name |
|---------|------|
| npm | `skysthelimit-website` |
| Vercel (target) | `skysthelimit-website` (currently may still show `website`) |
| GitHub repo (target) | `skysthelimit-website` |

---

## Status workflow

```text
Backlog → Todo → In Progress → In Review → Done
```

---

## Labels (one per group)

| Group | Labels |
|-------|--------|
| Severity | `p0-critical` · `p1-high` · `p2-medium` · `p3-low` |
| Area | `area:cms` · `homebase` · `portal` · `procurement` · `infra` · `security` · `leads` · `seo` · `design` |
| Type | Feature · Bug · Epic · Chore · Docs · Spike · Improvement |
| Workflow | `agent-ready` · `human-only` · `needs-decision` · `blocked-external` |
| Playbooks | `!plan` · `!implement` · `!review` · `!triage` · `!verify` · `!deploy` |

---

## Agent rules

1. Prefer **`agent-ready`** issues  
2. Coding → `!implement` + In Progress  
3. Evidence in comments → In Review  
4. No architecture reopen without architecture-loop  
5. Use Linear branch name / `SKY-XX` in commits  

---

## Templates

| Kind | Path |
|------|------|
| Feature / bug issue | `docs/templates/ISSUE_*.md` |
| Plan / handoff | `docs/templates/PLAN.md` · `HANDOFF.md` |
| Design (Stitch) | `DESIGN.md` · `docs/templates/DESIGN.md` |
| PR | `docs/templates/PR.md` · `.github/pull_request_template.md` |
| Status update | `docs/templates/LINEAR_STATUS.md` |
| Agent OS overview | `docs/AGENT_OS.md` |
| Agent kernel | `.agents/AGENTS.md` |
| Domain agents | `.agents/domains/README.md` |

---

## Definition of Done

- Acceptance criteria met  
- Tests / preview evidence  
- Linear issue updated  
- No secret commits  
- Naming matches `docs/NAMING.md`  

---

## Team templates (Linear UI)

MCP **cannot** create Linear issue/project/document templates. Install from repo:

**[`docs/linear-templates/README.md`](./linear-templates/README.md)**

| Kind | Templates |
|------|-----------|
| Issue | Feature · Bug · Epic · Chore · Agent OS |
| Project | Platform · Reliability |
| Document | Spec · Status · Agent OS note |

Path: Settings → Teams → Skysthelimit → **Templates** → + New template → paste from those files.

## Turso (Agent OS memory) — confirmed role

| | |
|--|--|
| **Used for** | Agent OS learnings, domain state, CI lessons (`learn_*` tables) |
| **Configured** | `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` in `.env.local` |
| **Health** | `npm run agentos:health` → `turso.ok` + `mode: "remote"` |
| **Not used for** | Product leads, portal RLS, Payload CMS content (those are Supabase / Payload Postgres) |

See `docs/AGENT_OS.md` and `.agents/knowledge/LEARNING_TURSO.md`.

## Human UI checklist

- [ ] **Team templates** installed from `docs/linear-templates/`  
- [ ] Cycles (2 weeks)  
- [ ] Initiative `skysthelimit · 2026`  
- [ ] GitHub integration  
- [ ] Views: P0 Fire, Agent queue, CMS, Homebase, Blocked  
- [ ] Vercel project rename → `skysthelimit-website`  
- [ ] GitHub repo rename → `skysthelimit-website` (optional but recommended)  
