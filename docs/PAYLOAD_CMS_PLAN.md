---
type: plan
title: Payload CMS architecture plan
description: Locked architecture — Payload 3 inside one Next.js Vercel Fluid project; research-validated against Vercel 2026 (Fluid, Services, Docker/VCR, Blob, cacheComponents).
tags: [payload, cms, vercel, plan, architecture]
version: 2.0.0
date: 2026-07-09
status: approved-for-implement
---

# Plan: Payload CMS (architecture v2)

**Status:** Decision locked — implement Phase 1–3.  
**Handoff / agent prompt:** [`HANDOFF_PAYLOAD_CMS.md`](./HANDOFF_PAYLOAD_CMS.md)  
**Stack SSOT:** [`.agents/STACK.md`](../.agents/STACK.md)  
**Authority:** Vercel plugin (`knowledge-update`, `env-vars`, `deployments-cicd`, `next-cache-components`) + this plan when they conflict with model memory.

---

## Goal kind

code-change / infrastructure

## Improvement loop (how this plan was hardened)

**Canonical loop (reuse):** [`.agents/workflows/architecture-loop.md`](../.agents/workflows/architecture-loop.md) · skill `architecture-loop` · `npm run arch:loop`  
**This run:** [`ARCHITECTURE_CMS_LOOP.md`](./ARCHITECTURE_CMS_LOOP.md)

| Step | What we did |
|------|-------------|
| **Frame** | CMS host on Fluid 2026; portal stays Supabase; one project |
| **Research** | Vercel changelog + docs (Fluid, Node 24, `vercel.ts`, Blob, Active CPU, Services, Dockerfile.vercel/VCR, bindings). Payload Local API + Blob. |
| **Validate** | `vercel.ts`, `proxy` `/admin`, Directus fallbacks, STACK |
| **Draft** | v1 Payload-in-Next |
| **Pressure** | cost, CSP, pooler, Docker-not-VPS, preview DB |
| **Lock / Codify** | v2 Blob, pooler, `/cms`, cache tags, env matrix, Services non-goals |
| **Prompt / Close** | Handoff system prompt; approved-for-implement |

---

## Decision (locked)

| Choice | Value | Why |
|--------|--------|-----|
| CMS | **Payload 3** (Next-native) | Collections in-repo; admin on same deploy; Local API on Fluid |
| Deploy | **Same Vercel project** as marketing + API + portal | One Fluid app; no second CMS host |
| Topology | **Single Next service** — **not** Vercel Services multi-app | Services/Docker are for polyglot backends; CMS belongs in App Router |
| Admin URL | **`/cms`** only | Avoid collision with Supabase `src/app/admin` + `proxy.ts` `/admin` gate |
| Media | **Vercel Blob** (prod + preview) | Official Payload adapter; no ephemeral local disk on Fluid |
| Database | **Postgres via pooler** (Supabase pooler **or** Neon Marketplace) | Fluid concurrency needs transaction pooler; no Vercel Postgres (retired) |
| Public reads | Payload Local API → `src/lib/cms/*` | Same process; no HTTP hop |
| Portal auth | **Supabase Auth** OAuth | Unchanged |
| Leads / RLS | **Supabase** `leads` | Unchanged |
| Agent memory | **Turso** | Unchanged |
| Directus | **Legacy** after parity | Compose/docs only until cutover |
| Convex | **Out of scope** | Not a CMS admin; high rewrite cost |
| Docker / VCR / Services | **Not for this CMS** | See [Platform map](#platform-map-vercel-2026) |

### Why Payload (not Directus / not Convex / not Docker CMS)

| Option | Verdict |
|--------|---------|
| **Directus compose / VPS** | Works as external host; poor free Fluid “always-on” fit; dual deploy mental model |
| **Directus as `Dockerfile.vercel` service** | *Possible* only if pure HTTP + external Postgres + no local state — still worse editor/ops path than Payload-in-Next for this site |
| **Convex** | Realtime ops strength; not draft/publish CMS UX; would rewrite portal + leads |
| **Payload 3 in Next** | **Chosen** — one deploy, Local API, `/cms` admin, Fluid-native |

---

## Platform map (Vercel 2026)

Use this so agents do not rediscover platform surface incorrectly.

| Primitive | Use for this product? | Notes |
|-----------|----------------------|--------|
| Fluid Compute + Node 24 | **Yes** | Default; Active CPU pricing |
| `vercel.ts` + `@vercel/config` | **Yes** | Only project config file |
| `cacheComponents` / `'use cache'` | **Yes** for **public CMS reads**; **never** for admin/portal session |
| Vercel Blob | **Yes** | Case study media |
| Marketplace Postgres (Neon) or Supabase Postgres | **Yes** | Pooled connection string |
| Vercel Services (multi-framework one project) | **No (CMS)** | Reserved if we later add polyglot backend |
| `Dockerfile.vercel` / VCR container Functions | **No (CMS)** | Stateless HTTP extras only (FFmpeg etc.), not Payload |
| Docker-in-Sandbox | **Dev/test only** | Optional; not production CMS |
| Service Bindings | **No (CMS)** | N/A while single Next service |
| Rolling Releases / promote preview | **Optional cutover** | Safer than big-bang publish |

**Hard rule:** Do **not** reintroduce `vercel.json` next to `vercel.ts` for this migration. If a future multi-service backend needs `services` config, that is a **separate** architecture decision (confirm `vercel.ts` support or dual-config policy first).

---

## Acceptance criteria

1. **Payload boots** in this Next app; admin at **`/cms`** in dev + preview.
2. **Collections parity:** `case-studies`, `markets`, `site-config` (map from `src/lib/directus/client.ts`).
3. **Public read path:** `/projects` loads **published** content via `src/lib/cms/*` with fallback **Payload → Supabase portfolio → static** (never 500 on empty/misconfigured DB).
4. **Media:** Vercel Blob; `next/image` `remotePatterns` include Blob host; `cmsAssetUrl()` works.
5. **Cache:** public fetchers use tagged cache; Payload `afterChange` revalidates tags/paths for `/projects` (and markets if wired).
6. **Portal OAuth + leads** unchanged (tests green).
7. **Directus SDK** removed from product paths (or thin deprecated shim).
8. **Tests:** published filter, empty DB, asset URL helper; portal tests still pass.
9. **Env:** server-only secrets; prod vs preview matrix documented; Sensitive vars on Vercel.
10. **Docs:** this plan + handoff + `STACK.md` topology current; Directus docs marked legacy.

## Non-goals (v1)

- Migrating Supabase marketing admin (`/admin`) into Payload.
- Moving portal identity or leads into Payload.
- Convex.
- Multi-tenant CMS.
- Payload **Jobs** queue (explicit non-goal — needs cron/Queues story).
- GraphQL public API (unless installer adds it unused).
- Vercel Services split / Dockerfile CMS host.
- Always-on Docker “VPS mode” for CMS.

---

## Assumed stack versions

- Next.js 16 + React 19 + `cacheComponents: true`
- `vercel.ts` + `@vercel/config`
- Node 24
- Payload 3.x (pin exact versions in PR)
- `@payloadcms/db-postgres` + `@payloadcms/storage-vercel-blob` (or current official Blob package)

---

## Target topology

```text
Vercel project (one) — Fluid + Node 24
└── Next.js 16 (single service)
    ├── src/app/*                 marketing + portal
    ├── src/app/admin/*           Supabase marketing admin (unchanged)
    ├── src/app/(payload)/*       Payload routes (admin + API) → public path /cms
    ├── src/collections/*         Payload collection configs
    ├── src/payload.config.ts     secret, db, blob, routes.admin = '/cms'
    ├── src/lib/cms/*             getCaseStudies / getMarkets / getSiteConfig + cmsAssetUrl
    ├── src/proxy.ts              matcher: /admin, /portal, /auth — NOT /cms
    ├── vercel.ts                 headers/CSP/crons (path-aware for /cms if needed)
    ├── Supabase                  Auth + leads (+ optional portfolio fallback)
    ├── Postgres (pooled)         Payload data only
    ├── Vercel Blob               CMS media
    └── Turso                     Agent OS only
```

**Admin path conflict (resolved):** Payload **`routes.admin = '/cms'`**. Never mount over `/admin` without a full rename + proxy rewrite plan.

**Proxy rule:** Do **not** add `/cms` to Supabase session matcher. Payload Users own CMS auth (separate from portal clients).

---

## Collection mapping

### `case-studies` ← Directus `case_studies`

| Field | Type | Notes |
|-------|------|--------|
| status | select: draft \| published \| archived | public filter = published only |
| sort | number | |
| type | text | |
| location | text | |
| problem | textarea | |
| prep | array of text / json | |
| result | textarea | |
| image | upload → Blob | |
| beforeImage | upload → Blob | |
| afterImage | upload → Blob | |
| market | select: residential \| commercial \| public-sector | |

### `markets` ← Directus `markets`

slug, navLabel, number, title, headline, summary, description, images, accent, proof[], capabilities[], process[], cta, metaTitle, metaDescription, status, sort.

### `site-config` (global)

siteTitle, tagline, phone, email, address, mnContractorId, naicsCode, socials, cta*, announcement*.

**Access control**

| Actor | Read | Write |
|-------|------|--------|
| Anonymous / marketing RSC | **published** only | no |
| Payload admin users | all | yes |
| Portal Supabase users | n/a (not Payload users) | n/a |

Bootstrap: first admin via env seed / create-first-user flow; lock open registration after.

---

## Architecture locks (Phase 0 — complete before code if not already true)

### L0.1 — Database

- [ ] Choose **one:** Supabase Postgres **transaction pooler** URL **or** Neon Marketplace pooled URL.
- [ ] Env name: `DATABASE_URI` (or adapter-documented alias) — **server-only**.
- [ ] Runtime: low `max` pool / pooler-friendly settings (avoid connection storms under Fluid concurrency).
- [ ] Schema: migrate/push strategy documented (prefer explicit migrate in deploy notes; no silent prod wipe).
- [ ] **Preview DB ≠ production write** (separate DB or branch; never PR previews mutating live case studies).

### L0.2 — Media

- [ ] Vercel Blob store + token(s) for production and preview.
- [ ] No production local disk uploads.
- [ ] `next.config.ts` `images.remotePatterns` for Blob hostname(s).

### L0.3 — Admin mount

- [ ] Payload `routes.admin = '/cms'`.
- [ ] Confirm `proxy.ts` does **not** match `/cms`.

### L0.4 — Cache & revalidation

- [ ] Public helpers: `'use cache'` + `cacheTag('cms:case-studies')` (and markets/config tags) **or** equivalent Next 16 cache API.
- [ ] Payload hooks `afterChange` / `afterDelete` → `revalidateTag` / `revalidatePath('/projects')`.
- [ ] Admin + portal routes: dynamic; no static shell caching of session.

### L0.5 — CSP / headers

- [ ] Smoke admin on a Vercel **preview**; if CSP blocks Payload admin, add **path-scoped** headers for `/cms` in `vercel.ts` (do not weaken marketing CSP globally more than necessary).
- [ ] After header edits: `npx @vercel/config compile` / validate.

### L0.6 — Env matrix (Vercel)

| Variable | Prod | Preview | Dev | Sensitive? |
|----------|------|---------|-----|------------|
| `PAYLOAD_SECRET` | unique | unique | local | **yes** |
| `DATABASE_URI` | prod pooler | **non-prod** pooler | local/dev | **yes** |
| Blob token / store | prod | preview-safe | local | **yes** |
| `NEXT_PUBLIC_SUPABASE_*` | unchanged | unchanged | unchanged | no |
| `NEXT_PUBLIC_DIRECTUS_URL` | remove after cutover | — | — | — |

Mark secrets **Sensitive** so build logs redact them (changelog Jul 2026).

---

## Phases

### Phase 0 — Locks (0.5 day)

Complete L0.1–L0.6 checkboxes. Branch: `feat/payload-cms`. Snapshot Directus/seed JSON if any live content.

### Phase 1 — Scaffold Payload 3 (1 day)

- [ ] Install Payload 3 + Postgres adapter + Blob storage (pin versions in PR).
- Prefer **merge into existing app** (official Next blank/install docs), not greenfield monorepo replace.
- [ ] `payload.config.ts`: secret, db, blob, `routes.admin = '/cms'`.
- [ ] Wire `(payload)` App Router routes per installer.
- [ ] `.env.example` keys; no secrets committed.
- [ ] Smoke: `/cms` loads; create one draft case study (local).

### Phase 2 — Collections + access (1 day)

- [ ] Collections/global per mapping.
- [ ] Access: public read published only; admin write.
- [ ] Seed from `directus/seed/case-studies.sample.json`.
- [ ] Blob upload works in dev.

### Phase 3 — App integration (1 day)

- [ ] `src/lib/cms/*`:
  - `getCaseStudies()`, `getMarkets()`, `getSiteConfig()`
  - `cmsAssetUrl()`
  - graceful empty/error → `[]` / `null` (same spirit as Directus client)
- [ ] Point `src/views/Projects.tsx` at `lib/cms`.
- [ ] Preserve fallback: **Payload published → Supabase portfolio → static**.
- [ ] Revalidation hooks wired.
- [ ] Deprecate Directus client (shim or delete).

### Phase 4 — Hardening (0.5–1 day)

- [ ] Unit tests: published filter, empty DB, asset URL.
- [ ] Portal tests still green.
- [ ] CSP verified on **preview** deploy.
- [ ] Update `docs/DIRECTUS_AND_PORTAL.md` → legacy pointer.
- [ ] Domain allow_globs if needed (`content-market`, `frontend-vercel`).
- [ ] `domain:success` + `domain:sync` for content-market / agent-os.

### Phase 5 — Cutover

- [ ] Prod env set (Sensitive).
- [ ] Prefer: validate on **preview** → `vercel promote` or Rolling Release.
- [ ] First real published case studies.
- [ ] Freeze Directus compose from default docs path.
- [ ] Monitor `/projects` “Live from CMS” badge + error logs.

---

## Env checklist

```env
# Payload (server-only — never NEXT_PUBLIC_)
PAYLOAD_SECRET=
DATABASE_URI=postgresql://...   # POOLED / transaction mode

# Vercel Blob (names per @payloadcms/storage-vercel-blob docs)
BLOB_READ_WRITE_TOKEN=

# Public site (unchanged)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

# Legacy — remove after cutover
# NEXT_PUBLIC_DIRECTUS_URL=
```

Pull via `vercel env pull` (do not commit `.env.local`).

---

## Risks

| Risk | Mitigation |
|------|------------|
| `/admin` collision | `/cms` only; proxy untouched for Payload |
| DB connection exhaustion | Transaction pooler; low pool size; no direct high-max connections |
| Stale `/projects` after publish | `cacheTag` + Payload revalidate hooks |
| CSP breaks admin on Vercel | Path-scoped `/cms` headers after preview smoke |
| Preview mutates prod content | Separate preview DB + secrets |
| Active CPU cost from uncached reads | Tag cache public CMS reads |
| Dual CMS during transition | Single `lib/cms` module; one backend switch |
| Agent adds Services/Docker CMS | Non-goals + STACK hard rule |

---

## Verification plan

1. Local: `/cms` → create **published** case study → `/projects` shows it + CMS badge.
2. Wrong/missing DB secret: `/projects` still renders static/Supabase fallback (no 500).
3. Portal: unauthenticated `/portal` → login; OAuth path unchanged.
4. `npx tsc --noEmit` + CMS + portal unit tests.
5. `npx @vercel/config compile` (or validate) after `vercel.ts` edits.
6. **Preview deploy:** admin login, Blob upload, publish, revalidate visible on `/projects`.

---

## Success metrics

- Zero Directus runtime dependency for production marketing content.
- One Vercel project deploy includes CMS admin at `/cms`.
- Portal + leads path green.
- Handoff prompt sufficient for next agent without rediscovery of Docker/Services/CSP/pooler.

---

## Changelog (plan)

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-10 | Initial Payload-in-Next plan |
| 2.0.0 | 2026-07-09 | Architecture locks: Blob, pooler, `/cms`, cache tags, CSP, env matrix; Vercel Services/Docker non-goals; improvement loop documented |
