---
type: architecture
title: End-to-end system map — Admin homebase, Client portal, CMS
description: Full map of actors, surfaces, data, flows, and integrations for Sky's the Limit website product.
tags: [architecture, portal, admin, cms, procurement, homebase]
version: 1.0.0
date: 2026-07-10
---

# End-to-end system map

**Product:** Sky’s the Limit Painting — marketing site + painter homebase + client portal + CMS.  
**Related:** [`PAYLOAD_CMS_PLAN.md`](./PAYLOAD_CMS_PLAN.md) · [`HANDOFF_PAYLOAD_CMS.md`](./HANDOFF_PAYLOAD_CMS.md) · [`.agents/STACK.md`](../.agents/STACK.md)

This document maps **who uses what**, **where data lives**, and **how it flows** end to end — current code **and** target homebase/procurement vision.

---

## 1. Actors

| Actor | Who | Primary surface |
|-------|-----|-----------------|
| **Visitor** | Prospect / public | Marketing site (`/`, markets, estimate form) |
| **Client** | Homeowner / facility / agency contact | **Client portal** `/portal` |
| **Painter / staff** | Owner, estimator, office | **Admin homebase** `/admin` → evolves to full homebase |
| **CMS editor** | Same painter or content person | **CMS** `/cms` (Payload target; Directus legacy) |
| **Systems** | Automations, CRM, Stripe, SAM | Webhooks / recipes (Pipedream/Make) |

---

## 2. Surface map (URLs)

```text
PUBLIC (no auth)
├── /                        marketing home
├── /residential | /commercial | /public-sector
├── /projects                case studies (CMS → fallback static)
├── /estimate | /contact     lead capture forms
├── /capabilities, /service-area, …
└── /portal/login            OAuth entry

CLIENT (Supabase session, email-scoped RLS)
└── /portal                  my jobs / leads / status / shared docs

PAINTER HOMEBASE (staff auth — today Supabase admin page)
└── /admin                   TODAY: leads + light CMS tables
    TARGET modules:
    ├── Overview (command center)
    ├── Jobs / Leads (list + detail + stream)
    ├── Board (kanban pipeline)
    ├── Procurement Tools
    │   ├── Certifications
    │   ├── Bid Ready Vault
    │   ├── Opportunities + Finder
    │   ├── Portals (MN/federal cards)
    │   ├── Score / Estimator / Proposals
    │   ├── Compliance
    │   ├── Primes
    │   ├── AI Assistant
    │   └── Analytics
    ├── Connections          CRM | DB mode | Stripe | webhooks
    ├── Automations          recipe status
    └── Website → /cms       deep link to Payload

CMS (Payload Users — separate from portal clients)
└── /cms                     case studies, markets, site-config, media

API / INTEGRATIONS
├── POST /api/leads          form → DB (+ outbound events)
├── POST /api/portal/ingest  TARGET: CRM/Stripe/SAM → projection
├── /auth/callback | signout Supabase OAuth
├── /api/storage/*           uploads
└── External                 Pipedream, HubSpot, Resend, SAM.gov, CRM
```

| Path | Today in repo | Target |
|------|---------------|--------|
| `/admin` | Large client page: leads, settings, testimonials, portfolio, service_areas | **Painter homebase** shell + modules |
| `/portal` | OAuth + leads by email | **Client window** on shared projection (jobs + timeline + shared docs) |
| `/cms` | Not shipped (Directus optional) | **Payload 3** content admin |
| Marketing | Live | Unchanged role; CMS-fed where applicable |

---

## 3. Topology (one Vercel project)

```text
┌─────────────────── Vercel project (Fluid + Node 24) ───────────────────┐
│  Next.js 16                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │ Marketing   │  │ Client       │  │ Painter     │  │ CMS Payload  │ │
│  │ RSC pages   │  │ /portal      │  │ /admin      │  │ /cms         │ │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  └──────┬───────┘ │
│         │                │                 │                 │          │
│         └────────────────┴────────┬────────┴─────────────────┘          │
│                                   │                                       │
│                    src/lib/*  ·  API routes  ·  proxy.ts                  │
└───────────────────────────────────┼───────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   Supabase                    Postgres (pool)           Vercel Blob
   Auth + leads/jobs           Payload CMS data          CMS media
   Storage (vault/portfolio)   (target)
          │
          ▼
   Events → Pipedream/Make → CRM / email / SMS / Stripe
          ▲
          │ webhooks
   SAM.gov · Jobber · HubSpot · Stripe · …
```

**Auth separation (locked):**

| Realm | Identity | Access |
|-------|----------|--------|
| Client portal | Supabase Auth (Google/GitHub) | RLS: rows matching **user email** |
| Painter homebase | Staff auth (Supabase staff role or separate gate) | All jobs, vault, procurement |
| CMS | Payload Users | Content only — **not** client login |

`src/proxy.ts` today: `/admin`, `/portal`, `/auth/callback`.  
**Do not** put `/cms` on Supabase portal matcher; Payload owns CMS auth.

---

## 4. Data plane (entities)

### 4.1 Core (product)

| Entity | Purpose | Primary writers |
|--------|---------|-----------------|
| **company_profile** | NAICS, services, bonding, radius, about | Staff homebase |
| **leads / jobs** | Work unit (estimate request or opportunity-linked job) | Form, staff, ingest |
| **job_events** | Stream / timeline | System + staff + automations |
| **job_steps** | Procurement / process checklist | Templates + staff |
| **job_tasks** | To-dos | Staff |
| **job_documents** | Files (client_visible flag) | Staff / vault link |
| **vault_documents** | Company bid-ready shelf (W-9, COI, …) | Staff |
| **certifications** | TGB, CERT, DBE, SAM/UEI, … | Staff |
| **opportunities** | Bid pursuits (gov + optional private) | Finder, manual, SAM ingest |
| **estimates** | Pricing scenarios | Estimator module |
| **proposals** | Generated packages | Proposal module |
| **compliance_items** | Deadlines | Derived + staff |
| **primes** | Directory | Curated |
| **connections** | CRM/Stripe/webhook config refs | Staff |
| **cms_*** | case-studies, markets, site-config | Payload |

### 4.2 Today vs target

| Today (approx.) | Target |
|-----------------|--------|
| `leads` + status | `jobs`/`leads` + kanban column + type (res/com/muni) |
| Admin portfolio/testimonials in Supabase | Portfolio may stay; **marketing case studies → Payload** |
| Directus optional | Payload `/cms` |
| No vault/certs/opportunities | Procurement modules |
| Portal = list of my leads | Portal = my jobs + timeline + shared docs |

### 4.3 Projection rule

```text
All UIs read a local projection (Supabase):
  jobs + events + docs (+ opportunities for staff)

Sources that WRITE into projection:
  A. Website forms          → job/lead created
  B. Staff homebase         → status, steps, tasks, docs
  C. Connected CRM (opt.)   → ingest upsert
  D. Stripe (opt.)          → payment status events
  E. SAM/finder (opt.)      → opportunity rows
  F. Automations            → notify + optional status side effects

Client portal NEVER writes CRM; optional "message" → event only.
```

**Modes for painter:**

| Mode | Jobs truth |
|------|------------|
| **Database** (default) | Homebase is SSOT |
| **Connected CRM** | CRM streams in; homebase is client-facing + ops overlay |
| **Hybrid** | Form creates local; CRM syncs when connected |

---

## 5. End-to-end flows

### Flow A — New residential/commercial lead

```text
Visitor → /estimate form
    → POST /api/leads
    → INSERT leads/jobs (status: new)
    → job_events: lead.created
    → emit lead.created webhook (Pipedream)
         → email painter
         → optional CRM create
         → optional "we received you" email to client
    → Painter sees job in /admin Jobs
    → Client (same email, after OAuth) sees job in /portal
```

### Flow B — Painter works the job (homebase)

```text
Staff opens job
    → moves kanban column / updates status
    → completes steps / tasks
    → uploads docs (some client_visible)
    → job_events appended
    → optional webhook status.changed
         → email client
    → Client refreshes /portal → new status + shared docs
```

### Flow C — Municipal / procurement pursuit

```text
Staff: Procurement → Finder or Portals
    → add Opportunity (or SAM API import)
    → Opportunity Score (rules)
    → attach Estimator scenario
    → Steps from "Municipal bid" template
    → Vault docs linked / missing flags
    → Proposal Generator → PDF
    → Submit bid (external portal) + mark Submitted
    → Analytics: submitted / won / lost
    → optional: create Job for field work when awarded
```

### Flow D — Certification / bid-ready

```text
Staff: Certifications dashboard
    → update TGB/CERT/… status + progress
    → Bid Ready Vault upload COI, W-9, …
    → Compliance Center shows renewals
    → Readiness % drives "Next actions" on homebase overview
```

### Flow E — CMS content → public site

```text
Editor: /cms (Payload)
    → publish case-study / market / site-config
    → revalidateTag / revalidatePath
    → /projects (and markets) read via src/lib/cms
    → fallback: Supabase portfolio → static if CMS empty
```

### Flow F — Inbound stream (target)

```text
External system webhook
    → POST /api/portal/ingest (signed)
    → normalize → upsert job/opportunity + job_events
    → Client/staff UIs show updated projection
```

### Flow G — Auth boundaries

```text
Client:  /portal/login → Supabase OAuth → /auth/callback → /portal
Staff:   /admin login (staff-only policy) → homebase
CMS:     /cms Payload login → content only
```

---

## 6. Module map (painter homebase)

```text
/admin  HOMEBASE
│
├── Overview
│     Readiness % · open jobs · due this week · next actions · quick actions
│
├── Jobs
│     List · detail · stream · steps · tasks · docs · status
│
├── Board
│     Kanban: Lead → Qualify → Quote/Bid → Submitted → Awarded → In progress → Done
│
├── Procurement Tools
│     ├── Certification Dashboard
│     ├── Bid Ready Vault
│     ├── Bid Finder (+ SAM federal; MN curated)
│     ├── Procurement Portals (instrumented links)
│     ├── Opportunity Score
│     ├── Estimator
│     ├── Proposal Generator
│     ├── Compliance Center
│     ├── Prime Directory
│     ├── AI Assistant (RFP/vault grounded)
│     └── Analytics (pipeline / win rate)
│
├── Connections
│     DB mode | CRM | Stripe | LEAD_WEBHOOK_URL
│
├── Automations
│     lead.created · status.changed · bid.due · cert.expiring
│
└── Website / CMS
      Link → /cms  (Payload)
```

### Client portal modules

```text
/portal
├── My jobs (email-scoped)
├── Job detail: status, timeline (filtered events), shared docs, pay link if any
└── Account: identity from OAuth
```

### CMS modules (Payload)

```text
/cms
├── Case studies     → /projects
├── Markets          → market pages (optional)
├── Site config      → global chrome / CTA
└── Media            → Blob
```

---

## 7. Who sees what (permissions)

| Data | Public | Client | Staff | CMS editor |
|------|:------:|:------:|:-----:|:----------:|
| Marketing pages | ✓ | ✓ | ✓ | ✓ |
| Case studies published | ✓ | ✓ | ✓ | edit |
| All leads/jobs | | | ✓ | |
| Own jobs (email match) | | ✓ | ✓ | |
| Internal tasks/steps | | | ✓ | |
| Client-visible docs | | ✓ | ✓ | |
| Vault (company docs) | | | ✓ | |
| Certifications | | | ✓ | |
| Opportunities pipeline | | | ✓ | |
| Automations config | | | ✓ | |
| Payload drafts | | | | ✓ |

---

## 8. Integration map

| Direction | Mechanism | Examples |
|-----------|-----------|----------|
| **Out** | Webhook after write | Resend, HubSpot, Slack, Sheets, CRM create |
| **In** | Ingest API | Jobber status, Stripe paid, SAM opportunity |
| **Pull** | Staff-triggered / cron | SAM.gov search (API key) |
| **Link-out** | Portal cards | MnDOT, BidNet, DemandStar, city portals, SAM.gov UI |
| **CMS** | Local API in-process | Payload → marketing RSC |
| **Auth** | Supabase | Portal + staff; Payload separate |

**Not in-app:** full BidNet scrape as core; full Jobber replacement; multi-tenant SaaS unless product changes.

---

## 9. Layered product (sale / build order)

```text
L1  Marketing + SEO + lead form          EXISTS
L2  Lead store + notify                  EXISTS (extend events)
L3  Staff jobs cockpit + status          PARTIAL (/admin leads)
L4  Client portal (my status)            EXISTS (thin)
L5  CMS (Payload)                        PLANNED
L6  Kanban + steps + tasks + docs stream TARGET
L7  Procurement readiness (certs+vault)  TARGET
L8  Opportunities + estimator+proposal   TARGET
L9  SAM finder + AI RFP assist           TARGET (OSS-assisted)
L10 Connections BYO-CRM / Stripe         TARGET
```

---

## 10. Sequence diagrams (happy paths)

### Lead → portal

```text
Visitor    API/leads    Supabase     Pipedream    Painter     Client
   |            |            |            |           |           |
   |--submit--->|            |            |           |           |
   |            |--insert--->|            |           |           |
   |            |--event---->|----------->|           |           |
   |            |            |            |--email--->|           |
   |            |            |            |           |  (later OAuth)
   |            |            |<--select own leads-----|-----------|
   |            |            |------------payload---->| /portal   |
```

### CMS publish → site

```text
Editor   Payload   Postgres/Blob   revalidate   /projects
  |--publish-->|        |              |            |
  |            |--save->|              |            |
  |            |--hook---------------->|            |
  |            |                       |--ISR/tag-->|
  |            |                       |            |--Local API read
```

### Procurement opportunity

```text
Staff    Opportunities   Vault/Certs   Estimator   Proposal   External portal
  |--create/score-->|         |            |           |            |
  |--check ready----------->|            |           |            |
  |--price------------------------------>|           |            |
  |--generate--------------------------------------->|            |
  |--submit------------------------------------------------------>|
  |--status Submitted-->|                                              |
```

---

## 11. File / domain ownership (implementers)

| Area | Paths (approx.) | Domain agent |
|------|-----------------|--------------|
| Client portal | `src/app/portal/**`, `src/lib/auth/portal*.ts` | frontend-vercel |
| Admin homebase | `src/app/admin/**` → future `src/app/(homebase)/**` | frontend-vercel + content-market |
| Leads API | `src/app/api/leads/**` | api |
| CMS | `src/app/(payload)/**`, `src/collections/**`, `src/lib/cms/**` | content-market |
| Proxy / deploy | `src/proxy.ts`, `vercel.ts` | ci-devops |
| Procurement schema | `supabase/migrations/**` | api + frontend-vercel |

---

## 12. Single-page mental model

```text
                    ┌──────────────────┐
                    │  MARKETING SITE  │
                    │  (CMS-powered)   │
                    └────────┬─────────┘
                             │ forms
                             ▼
┌──────────────┐     ┌───────────────┐     ┌─────────────────────────┐
│ CLIENT       │◄───►│  DATA PLANE   │◄───►│ PAINTER HOMEBASE        │
│ /portal      │ RLS │  jobs/events  │     │ /admin                  │
│ my status    │     │  vault/certs  │     │ jobs·board·procurement  │
│ shared docs  │     │  opps/cms     │     │ connections·automations │
└──────────────┘     └───────┬───────┘     └───────────┬─────────────┘
                             │                         │
                    stream in/out                 link → /cms
                             │                         │
                    CRM·Stripe·SAM·email          Payload content
```

**For the painter:** homebase is command center (ops + procurement + website).  
**For the client:** portal is the streamed, filtered view of *their* work.  
**For the public:** CMS + marketing convert attention into jobs that enter the plane.

---

## 13. Status legend

| Component | Status |
|-----------|--------|
| Marketing site | **Live** |
| Lead API + Supabase leads | **Live** |
| `/admin` leads + some tables | **Live (partial homebase)** |
| `/portal` OAuth + my leads | **Live (thin)** |
| Payload CMS `/cms` | **Planned (arch v2 locked)** |
| Jobs stream / kanban / steps | **Target** |
| Procurement suite | **Target (phased)** |
| BYO CRM / Stripe webhooks | **Target** |
| SAM-assisted finder | **Target (OSS-assisted)** |

---

## 14. Non-goals (keep the map honest)

- Replacing Jobber/ServiceTitan as full field ops  
- Hosting BidNet as a scraped mirror  
- One auth system for clients + Payload editors + all staff without roles  
- Convex as CMS  
- Docker CMS on free Fluid as default  

---

*When implementing, prefer execution under this map + Payload plan; re-open architecture loop only if topology (one project, auth split, projection model) changes.*
