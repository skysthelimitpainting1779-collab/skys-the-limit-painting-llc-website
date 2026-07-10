# Client Portal Projection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/portal` from “list my leads” to a **client window** on the homebase projection: my jobs, filtered timeline, shared documents — without giving clients staff tools or CRM write access.

**Architecture:** Supabase Auth OAuth unchanged (`/portal/login`, `/auth/callback`). RLS: email-scoped. Client reads `leads` + `job_events` where `visibility = 'client'` + `job_documents` where `client_visible`. Optional signed ingest `POST /api/portal/ingest` for CRM/Stripe/SAM → projection (staff systems write; portal only displays).

**Tech Stack:** Next.js, Supabase SSR, shadcn Card/Badge/Table/Separator, existing portal gate in `src/lib/auth/portal.ts`.

**Authority:** `docs/SYSTEM_MAP_E2E.md` Flow A/B/F · `docs/DIRECTUS_AND_PORTAL.md` (portal section; CMS separate).

**Linear:** Project **Product Platform 2026** · Milestone **M4 — Client portal projection**.

**Depends on:** M2 jobs projection schema (`job_events`, `job_documents`). OAuth already shipped.

---

## File map

| Path | Responsibility |
|------|----------------|
| `src/lib/auth/portal-data.ts` | Extend: jobs list, events, docs by email |
| `src/lib/auth/portal.ts` | Gate unchanged unless needed |
| `src/app/portal/page.tsx` | Jobs list UI |
| `src/app/portal/jobs/[id]/page.tsx` | Detail: status, timeline, shared docs |
| `src/app/api/portal/ingest/route.ts` | Signed webhook upsert |
| `src/lib/portal/ingest.ts` | Normalize external payloads |
| `tests/portal-*.test.mjs` | Extend coverage |
| `supabase/migrations/*` | RLS for client events/docs (if not in M2) |

---

### Task 1: Portal data access

**Files:**
- Modify: `src/lib/auth/portal-data.ts`

- [ ] **Step 1: Read current helpers** — list leads by email.

- [ ] **Step 2: Add**

```ts
export async function getPortalJob(userEmail: string, jobId: string) { /* lead if email matches */ }
export async function getPortalTimeline(userEmail: string, jobId: string) {
  // job_events where lead_id = jobId AND visibility = 'client' AND lead.email = userEmail
}
export async function getPortalDocuments(userEmail: string, jobId: string) {
  // job_documents where client_visible and lead email matches
}
```

- [ ] **Step 3: Tests** — unauthenticated / wrong email returns empty or null.

```bash
node --test tests/portal-data.test.mjs
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(portal): job detail timeline and shared docs queries"
```

---

### Task 2: Portal UI

**Files:**
- Modify: `src/app/portal/page.tsx`
- Create: `src/app/portal/jobs/[id]/page.tsx`
- Use shadcn Card, Badge, Separator (install if missing from M2)

- [ ] **Step 1: List** — cards for each job: status badge, created date, open detail.

- [ ] **Step 2: Detail** — timeline list (client events only); shared docs with download links (signed read URLs).

- [ ] **Step 3: Empty states** — Card + copy when no jobs.

- [ ] **Step 4: No CRM write** — optional “message painter” can insert `job_events` kind `client.message` only (optional v1.1).

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(portal): jobs list and detail projection UI"
```

---

### Task 3: Ingest API (stream TO portal)

**Files:**
- Create: `src/app/api/portal/ingest/route.ts`
- Create: `src/lib/portal/ingest.ts`

- [ ] **Step 1: Auth** — shared secret header `x-portal-ingest-secret` or HMAC; server-only env `PORTAL_INGEST_SECRET`.

- [ ] **Step 2: Accept JSON**

```ts
type IngestBody = {
  source: 'crm' | 'stripe' | 'sam' | 'automation'
  external_id?: string
  email: string
  status?: string
  event_kind: string
  event_body?: Record<string, unknown>
  // upsert strategy: match external_id or email+title
}
```

- [ ] **Step 3:** Upsert lead/job + append `job_events` (set visibility carefully: payment updates may be client-visible).

- [ ] **Step 4: Tests** for reject missing secret + happy path normalize.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(portal): signed ingest webhook for external projection updates"
```

---

### Task 4: Verification

- [ ] **Step 1:** Unauthenticated `/portal` → login redirect (existing).

- [ ] **Step 2:** OAuth user sees only own email jobs.

- [ ] **Step 3:** Staff marks doc `client_visible` → appears in portal detail.

- [ ] **Step 4:** Portal tests + `npx tsc --noEmit`.

```bash
node --test tests/portal-*.test.mjs
npx tsc --noEmit
```

---

## Self-review

| Spec | Task |
|------|------|
| Client jobs list | 2 |
| Timeline filtered | 1–2 |
| Shared docs | 1–2 |
| Ingest stream TO portal | 3 |
| No CRM write from client | 2 |
| Auth unchanged | 1–2 |

---

## Execution handoff

Plan complete at `docs/superpowers/plans/2026-07-10-client-portal-projection.md`.
