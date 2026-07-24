---
type: documentation
title: Linear OS — workspace operating manual
description: How skysthelimit uses Linear as the hub for GTM + operations + software.
tags: [linear, process, gtm, marketing, sales, project-management]
date: 2026-07-10
---

# Linear OS — skysthelimit

**Live Linear doc:** [Linear OS](https://linear.app/skysthelimit/document/linear-os-skysthelimit-7a94e6db17cb)  
**Team setup:** [Team Skysthelimit — setup SSOT](https://linear.app/skysthelimit/document/team-skysthelimit-setup-ssot-4c3298d215d1)  
**Workspace:** [skysthelimit](https://linear.app/skysthelimit) · Team: **Skysthelimit** · key **SKY**  
**Naming SSOT:** [`docs/NAMING.md`](./NAMING.md)

---

## Linear is the company hub (not just software)

| Concern | System |
|---------|--------|
| **GTM: marketing, sales, acquisition, brand, partnerships** | **Linear** (project **GTM**) |
| **Tasks, milestones, triage, status** | **Linear** |
| **Owner command center (scorecard, CRM view, SOPs, weekly rhythm)** | **Notion** — [Business OS](./BUSINESS_OS.md) / [live page](https://app.notion.com/p/e8110a799a894033a6863e0702039a2e) |
| **Process / OS docs** | Linear Documents (+ mirror in `docs/`) |
| **Software / product engineering** | Linear (Reliability · Platform · Guapo) + **Git** |
| **Deploy / env** | **Vercel** (`skysthelimit-website`) |
| **Auth / product data** | **Supabase** |
| **Agent coding behavior** | Repo `AGENTS.md` + skills |

**Rule of thumb:** Linear executes work. Notion Business OS is the owner’s weekly command view (not a second full backlog).

**Markets covered:** residential · commercial · municipal / public sector.

Agents and humans create work in **Linear**, not GitHub Issues. PRs live on GitHub and link `SKY-XX` when the work is software.

### Software vs GTM

| Work type | Project | Labels |
|-----------|---------|--------|
| GTM / sales / marketing / CA | **skysthelimit · GTM** | `market:*` + **one** `gtm:*` |
| Website product upgrades | **Guapo Upgrade** | `area:*` + playbooks |
| Portal / homebase / CMS | **Platform** | `area:portal` / `homebase` / `cms` |
| Production / security / leads pipe | **Reliability** | `area:infra` / `security` / `leads` |

Cross-link: when software enables a GTM outcome, set **related** between issues.

**Linear label rule:** only **one** label per group (so one `market:*` and one `gtm:*` max per issue).

---

## Structure

| Layer | Name |
|-------|------|
| **Team** | Skysthelimit (`SKY`) |
| **Initiative** | `skysthelimit · 2026` (whole company) |
| **Projects** | **GTM** · Guapo Upgrade · Platform · Reliability |
| **GTM milestones** | GTM-0 messaging · GTM-1 residential · GTM-2 commercial · GTM-3 municipal |
| **Statuses** | Backlog → Todo → In Progress → In Review → Done |
| **Cycles** | Team cycles (put active GTM + eng work into current cycle) |

### Project links

| Project | URL |
|---------|-----|
| **GTM** | https://linear.app/skysthelimit/project/skysthelimit-gtm-b47097455766 |
| Guapo Upgrade | https://linear.app/skysthelimit/project/skysthelimit-guapo-upgrade-5c471cfcb989 |
| Platform | https://linear.app/skysthelimit/project/skysthelimit-platform-23e9f741cb38 |
| Reliability | https://linear.app/skysthelimit/project/skysthelimit-reliability-a29ad741ff6a |
| Initiative 2026 | https://linear.app/skysthelimit/initiative/skysthelimit-2026-55d7470dad57 |

### Package / deploy names

| Surface | Name |
|---------|------|
| npm | `skysthelimit-website` |
| Vercel (target) | `skysthelimit-website` |
| Domain | www.skysthelimitpaintingllc.com |

---

## Labels

### Severity
`p0-critical` · `p1-high` · `p2-medium` · `p3-low`

### Market (one only)
`market:residential` · `market:commercial` · `market:municipal`

### GTM function (one only)
`gtm:marketing` · `gtm:sales` · `gtm:acq` · `gtm:content` · `gtm:ops` · `gtm:partnerships`

### Software area (one only)
`area:cms` · `area:homebase` · `area:portal` · `area:procurement` · `area:infra` · `area:security` · `area:leads` · `area:seo` · `area:design`

### Type
Feature · Bug · Epic · Chore · Docs · Spike · Improvement · **Campaign**

### Workflow
`agent-ready` · `human-only` · `needs-decision` · `blocked-external`

### Playbooks (software agents)
`!plan` · `!implement` · `!review` · `!triage` · `!verify` · `!deploy`

---

## How to file work

### GTM / business
1. Project = **GTM**  
2. Parent epic under [SKY-134](https://linear.app/skysthelimit/issue/SKY-134) when relevant  
3. Labels: **one** market + **one** gtm function  
4. Success metric + claim-safe language  
5. Most pure-business work is **`human-only`** until a software handoff exists  

### Software
1. Pick Reliability / Platform / Guapo  
2. Labels: area + severity + playbook  
3. `agent-ready` only when spec is clear  
4. Link related GTM issue if the code exists for a campaign/sales motion  

---

## Agent rules (software only)

1. Prefer **`agent-ready`** issues  
2. Coding → `!implement` + In Progress  
3. Evidence in comments → In Review  
4. Commits/PRs use `SKY-XX`  
5. Do not invent GTM claims or fake municipal credentials  

---

## Templates

| Kind | Path |
|------|------|
| Issue templates (UI install) | `docs/linear-templates/` |
| Feature / bug / plan | `docs/templates/` |

MCP **cannot** create Linear UI templates — paste from repo.

---

## Definition of Done

### GTM
- Metric defined and recorded  
- Market + function labeled  
- Claim-safe  
- Next step to estimate/job clear  

### Software
- Acceptance criteria met  
- Tests / preview evidence  
- Linear updated  
- No secrets in git  

---

## Human UI checklist

- [x] Initiative `skysthelimit · 2026`  
- [x] Projects: GTM · Guapo · Platform · Reliability  
- [x] Market + GTM label groups  
- [x] GTM epics + starter backlog  
- [ ] Views: **GTM Residential** · **GTM Commercial** · **GTM Municipal** · **Sales** · **P0 Fire** · **Agent queue**  
- [ ] Team templates installed from `docs/linear-templates/`  
- [ ] GitHub integration  
