# Painter Homebase Shell + Jobs Projection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve `/admin` from a single large marketing-admin page into a **painter homebase** shell with Overview, Jobs, Board, and module nav — backed by a Supabase **jobs projection** (leads + events + docs) that both staff and the client portal can read.

**Architecture:** Staff surface stays at `/admin` (Supabase session / staff gate via `src/proxy.ts`). CMS stays at `/cms` (Payload). Homebase is SSOT in **Database mode**; optional CRM streams **into** projection later via ingest. UI uses **shadcn/ui** (project already has `components.json`, style `base-nova`; today only `card` + marketing widgets under `src/components/ui`).

**Tech Stack:** Next.js App Router, Supabase (`@supabase/ssr`), shadcn/ui (Radix), Lucide, Tailwind v4 tokens.

**Authority:** `docs/SYSTEM_MAP_E2E.md` · `.agents/STACK.md` · shadcn skill (compose with Card/Tabs/Table/Sheet/Badge).

**Linear:** Project **Product Platform 2026** · Milestone **M2 — Homebase shell + jobs**.

**Depends on (do not re-implement):** SKY-5 (pg→Supabase leads) Done; SKY-9/11 lead delivery/Resend for reliable inbound jobs.

---

## File map

| Path | Responsibility |
|------|----------------|
| `src/app/admin/layout.tsx` | Homebase chrome (sidebar + top bar) |
| `src/app/admin/page.tsx` | Overview dashboard (split out from monolith) |
| `src/app/admin/jobs/page.tsx` | Jobs list |
| `src/app/admin/jobs/[id]/page.tsx` | Job detail + stream |
| `src/app/admin/board/page.tsx` | Kanban board |
| `src/components/homebase/sidebar.tsx` | Nav modules |
| `src/components/homebase/job-status-badge.tsx` | Status badge |
| `src/components/ui/*` | Add via `npx shadcn@latest add ...` |
| `src/lib/homebase/jobs.ts` | Server data access for jobs/events |
| `src/lib/homebase/types.ts` | Job, JobEvent, JobDocument types |
| `supabase/migrations/YYYYMMDDHHMMSS_homebase_jobs_projection.sql` | Schema |
| `tests/homebase-jobs.test.mjs` | Projection helpers |

---

### Task 1: Install shadcn primitives for product UI

**Files:**
- Modify: `src/components/ui/*` via CLI
- Keep: `components.json` (do not re-init unless broken; style is `base-nova`)

- [ ] **Step 1: Add components (non-interactive)**

```bash
npx shadcn@latest add button badge tabs table sheet separator dropdown-menu dialog alert-dialog input label select scroll-area skeleton avatar
```

- [ ] **Step 2: Verify Geist/font tokens** after CLI (shadcn skill: fix circular `--font-sans` if init rewrote CSS).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui components.json
git commit -m "chore(ui): add shadcn primitives for homebase"
```

---

### Task 2: Jobs projection schema (Supabase)

**Files:**
- Create: `supabase/migrations/*_homebase_jobs_projection.sql`

- [ ] **Step 1: Design tables** (v1 — additive to existing `leads` where possible)

Preferred approach: **extend `leads`** with columns for kanban + type, plus new child tables — avoid big-bang rename.

```sql
-- Example shape (adjust to existing leads columns before applying)
alter table public.leads
  add column if not exists pipeline_status text default 'new',
  add column if not exists job_type text, -- residential | commercial | municipal
  add column if not exists kanban_column text default 'lead';

create table if not exists public.job_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  kind text not null, -- lead.created | status.changed | note | doc.shared
  body jsonb default '{}',
  visibility text not null default 'staff', -- staff | client
  created_at timestamptz not null default now(),
  created_by text
);

create table if not exists public.job_documents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  title text not null,
  storage_path text not null,
  client_visible boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS: staff service role / staff policy for admin; client select on leads already by email;
-- job_events: client can select where visibility = 'client' and lead email matches
-- job_documents: client select where client_visible and lead email matches
```

- [ ] **Step 2: Apply migration to dev; document remote apply**

```bash
# use project’s existing supabase workflow
```

- [ ] **Step 3: Commit migration**

```bash
git commit -m "feat(homebase): jobs projection migration (events + docs)"
```

---

### Task 3: Server lib for jobs

**Files:**
- Create: `src/lib/homebase/types.ts`, `src/lib/homebase/jobs.ts`
- Pattern: mirror `src/lib/auth/portal-data.ts` (server-only Supabase)

- [ ] **Step 1: Types**

```ts
export type PipelineStatus = 'new' | 'qualified' | 'quoted' | 'submitted' | 'awarded' | 'in_progress' | 'done' | 'lost'
export type KanbanColumn = 'lead' | 'qualify' | 'quote' | 'submitted' | 'awarded' | 'in_progress' | 'done'

export interface HomebaseJob {
  id: string
  email: string | null
  name: string | null
  pipeline_status: PipelineStatus
  kanban_column: KanbanColumn
  job_type: string | null
  created_at: string
  // map other existing lead fields
}

export interface JobEvent {
  id: string
  lead_id: string
  kind: string
  body: Record<string, unknown>
  visibility: 'staff' | 'client'
  created_at: string
}
```

- [ ] **Step 2: Data access**

```ts
// src/lib/homebase/jobs.ts
export async function listJobsForStaff(): Promise<HomebaseJob[]> { /* service or staff client */ }
export async function getJob(id: string): Promise<HomebaseJob | null> { /* ... */ }
export async function listJobEvents(leadId: string, opts?: { clientVisibleOnly?: boolean }): Promise<JobEvent[]> { /* ... */ }
export async function updateJobColumn(id: string, column: KanbanColumn): Promise<void> {
  // also insert job_events status.changed
}
```

- [ ] **Step 3: Unit tests** for mapping / empty lists.

```bash
node --test tests/homebase-jobs.test.mjs
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(homebase): jobs data access layer"
```

---

### Task 4: Homebase shell UI

**Files:**
- Modify: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`
- Create: `src/components/homebase/sidebar.tsx`
- Create: route pages under `src/app/admin/*`

- [ ] **Step 1: Sidebar nav**

```tsx
// modules from SYSTEM_MAP_E2E
const nav = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/board', label: 'Board' },
  { href: '/admin/procurement', label: 'Procurement' }, // stub until M3
  { href: '/admin/connections', label: 'Connections' }, // stub
  { href: '/cms', label: 'Website CMS', external: true },
]
```

- [ ] **Step 2: Overview** — summary Cards: open jobs count, due this week placeholder, next actions, link to Board.

- [ ] **Step 3: Jobs list** — shadcn `Table` + `Badge` for status; row → `/admin/jobs/[id]`.

- [ ] **Step 4: Job detail** — status, event stream (`ScrollArea`), client_visible docs flag.

- [ ] **Step 5: Board** — columns as Cards; drag optional v1 (buttons to move column OK for MVP).

- [ ] **Step 6: Do not break** existing portfolio/testimonials admin until extracted; either keep under “Website” sub-nav or leave temporary section on Overview.

- [ ] **Step 7: Commit**

```bash
git commit -m "feat(homebase): admin shell with overview, jobs, board"
```

---

### Task 5: Wire lead.created event

**Files:**
- Modify: `src/app/api/leads/route.ts` (or post-insert helper)

- [ ] **Step 1:** After successful lead insert, insert `job_events` row `kind: 'lead.created'`, `visibility: 'client'`.

- [ ] **Step 2:** Coordinate with SKY-9/11 so delivery env is configured (homebase still stores events even if email fails).

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(homebase): emit lead.created job event on form submit"
```

---

## Self-review

| Spec (SYSTEM_MAP) | Task |
|-------------------|------|
| Actors staff homebase | Task 4 |
| jobs + job_events + docs | Task 2–3 |
| Kanban board | Task 4 |
| Projection rule DB mode | Task 2–5 |
| Auth split /admin vs /cms | Shell only; no Payload changes |
| shadcn product UI | Task 1 |

---

## Execution handoff

Plan complete at `docs/superpowers/plans/2026-07-10-painter-homebase-shell.md`.

1. Subagent-Driven (recommended)  
2. Inline Execution  
