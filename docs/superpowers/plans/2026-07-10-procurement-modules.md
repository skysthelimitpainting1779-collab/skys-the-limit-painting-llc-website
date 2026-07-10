# Procurement Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add procurement command-center modules under painter homebase so staff can track certifications, bid-ready vault docs, opportunities (incl. SAM assist), scoring, estimates, proposals, compliance deadlines, and primes — without building a second product.

**Architecture:** Modules live under `/admin/procurement/*` as App Router pages inside the homebase shell (M2). Data in Supabase projection tables. Prefer **OSS assist** (SAM.gov API / AutoRFP-style) over rewriting CRM. Company vault is **not** client-visible unless explicitly shared to a job.

**Tech Stack:** Next.js, Supabase, shadcn (Table, Card, Badge, Sheet, Tabs, Dialog), optional PDF generation later, SAM.gov public API for federal opportunities.

**Authority:** `docs/SYSTEM_MAP_E2E.md` §6 Procurement · Flow C/D.

**Linear:** Project **Product Platform 2026** · Milestone **M3 — Procurement tools**.

**Depends on:** M2 homebase shell + jobs projection.

---

## File map

| Path | Responsibility |
|------|----------------|
| `src/app/admin/procurement/page.tsx` | Hub |
| `src/app/admin/procurement/certs/page.tsx` | Certification dashboard |
| `src/app/admin/procurement/vault/page.tsx` | Bid Ready Vault |
| `src/app/admin/procurement/opportunities/page.tsx` | List + create |
| `src/app/admin/procurement/score/page.tsx` | Opportunity score rules UI |
| `src/app/admin/procurement/estimator/page.tsx` | Estimate scenarios |
| `src/app/admin/procurement/proposals/page.tsx` | Proposal packages |
| `src/app/admin/procurement/portals/page.tsx` | MN/federal portal cards |
| `src/app/admin/procurement/compliance/page.tsx` | Renewal deadlines |
| `src/app/admin/procurement/primes/page.tsx` | Prime directory |
| `src/lib/procurement/*` | Domain logic |
| `supabase/migrations/*_procurement.sql` | Schema |
| `src/app/api/procurement/sam/route.ts` | Optional SAM proxy (server) |

---

### Task 1: Schema

**Files:**
- Create: `supabase/migrations/*_procurement.sql`

```sql
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  code text not null, -- TGB | CERT | DBE | SAM_UEI | ...
  name text not null,
  status text not null default 'not_started', -- not_started | in_progress | active | expired
  progress_pct int default 0,
  expires_at date,
  notes text,
  updated_at timestamptz default now()
);

create table if not exists public.vault_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null, -- w9 | coi | bonding | financial | other
  storage_path text not null,
  expires_at date,
  created_at timestamptz default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text, -- sam | manual | mn_portal
  external_id text,
  agency text,
  due_at timestamptz,
  status text default 'watching', -- watching | pursuing | submitted | won | lost
  score int,
  naics text,
  url text,
  created_at timestamptz default now()
);

create table if not exists public.estimates (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  line_items jsonb not null default '[]',
  total_cents bigint default 0,
  created_at timestamptz default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  title text not null,
  status text default 'draft',
  package jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.compliance_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_at date,
  related_cert_id uuid references public.certifications(id),
  status text default 'open'
);

create table if not exists public.primes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact jsonb default '{}',
  notes text
);
```

- [ ] **Step 1:** Write migration matching existing RLS patterns (staff-only for procurement tables).

- [ ] **Step 2:** Commit

```bash
git commit -m "feat(procurement): schema for certs vault opportunities estimates"
```

---

### Task 2: Lib + hub UI

**Files:**
- Create: `src/lib/procurement/{types,certs,vault,opportunities}.ts`
- Create: hub + first two pages (certs, vault)

- [ ] **Step 1:** CRUD helpers with Supabase server client.

- [ ] **Step 2:** Hub page with Card grid linking modules + readiness % (active certs / total + vault required docs present).

- [ ] **Step 3:** Certs dashboard — Table + status Badge + progress.

- [ ] **Step 4:** Vault — list + upload via existing signed URL pattern (`/api/storage/upload-url` — SKY-7).

- [ ] **Step 5:** Commit

```bash
git commit -m "feat(procurement): hub, certifications dashboard, bid vault"
```

---

### Task 3: Opportunities + SAM assist

**Files:**
- Create: opportunities list/create UI
- Optional: `src/app/api/procurement/sam/route.ts`

- [ ] **Step 1:** Manual opportunity create form.

- [ ] **Step 2:** SAM search proxy (server-only API key if required; rate-limit; never expose secrets to client).

- [ ] **Step 3:** Import selected SAM hit → `opportunities` row (`source: 'sam'`).

- [ ] **Step 4:** Portals page — static instrumented link cards (MN/federal) with last-visited local state OK for v1.

- [ ] **Step 5:** Commit

```bash
git commit -m "feat(procurement): opportunities list + SAM assist + portals"
```

---

### Task 4: Score, estimator, proposals (MVP)

**Files:**
- Create: score rules pure function + UI
- Create: estimator line items editor
- Create: proposal draft assembler (JSON package; PDF later)

```ts
// src/lib/procurement/score.ts
export function scoreOpportunity(input: {
  naicsMatch: boolean
  daysUntilDue: number
  certReady: boolean
  bondingOk: boolean
}): number {
  let s = 0
  if (input.naicsMatch) s += 30
  if (input.daysUntilDue >= 14) s += 20
  else if (input.daysUntilDue >= 7) s += 10
  if (input.certReady) s += 30
  if (input.bondingOk) s += 20
  return Math.min(100, s)
}
```

- [ ] **Step 1:** Unit tests for `scoreOpportunity`.

- [ ] **Step 2:** Estimator stores `line_items` jsonb; total derived.

- [ ] **Step 3:** Proposal draft links estimate + vault checklist missing flags.

- [ ] **Step 4:** Commit

```bash
git commit -m "feat(procurement): score estimator proposals MVP"
```

---

### Task 5: Compliance + primes + analytics stub

- [ ] **Step 1:** Compliance list derived from cert `expires_at` + manual items.

- [ ] **Step 2:** Primes directory CRUD.

- [ ] **Step 3:** Analytics stub page — counts by opportunity status (SQL group by).

- [ ] **Step 4:** AI Assistant page — **stub only** in v1 (link to future RAG); do not block milestone.

- [ ] **Step 5:** Commit

```bash
git commit -m "feat(procurement): compliance primes analytics stub"
```

---

## Self-review

| Module | Task |
|--------|------|
| Certs | 2 |
| Vault | 2 |
| Opportunities + Finder | 3 |
| Portals | 3 |
| Score / Estimator / Proposals | 4 |
| Compliance / Primes / Analytics | 5 |
| AI Assistant | stub Task 5 |

---

## Execution handoff

Plan complete at `docs/superpowers/plans/2026-07-10-procurement-modules.md`.
