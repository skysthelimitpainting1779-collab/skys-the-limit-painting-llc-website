# Payload CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Payload 3 at `/cms` inside this Next.js 16 app with published case studies powering `/projects` via `src/lib/cms/*`, Vercel Blob media, pooled Postgres, and zero portal/leads regressions.

**Architecture:** Single Vercel Fluid project. Payload routes under App Router; admin `routes.admin = '/cms'`. Public reads use Local API + cache tags; fallback chain Payload published → Supabase portfolio → static. Do **not** mount over `src/app/admin`. Do **not** add `/cms` to `src/proxy.ts` Supabase matcher.

**Tech Stack:** Next.js 16, React 19, Payload 3, `@payloadcms/db-postgres`, `@payloadcms/storage-vercel-blob`, Vercel Blob, pooled Postgres, `cacheComponents` / cache tags, `vercel.ts`.

**Authority:** `docs/PAYLOAD_CMS_PLAN.md` v2 · `docs/HANDOFF_PAYLOAD_CMS.md` · `.agents/STACK.md` · Vercel skills `knowledge-update`, `env-vars`, `deployments-cicd`, `next-cache-components`.

**Linear:** Project **Product Platform 2026** · Milestone **M1 — Payload CMS**.

---

## File map (create / modify)

| Path | Responsibility |
|------|----------------|
| `src/payload.config.ts` | Payload root config (secret, db, blob, admin path `/cms`) |
| `src/collections/CaseStudies.ts` | Case study collection |
| `src/collections/Markets.ts` | Markets collection |
| `src/collections/Users.ts` | Payload users (installer may scaffold) |
| `src/globals/SiteConfig.ts` | Site config global |
| `src/app/(payload)/**` | Payload admin + API routes (installer layout) |
| `src/lib/cms/client.ts` | getCaseStudies / getMarkets / getSiteConfig / cmsAssetUrl |
| `src/lib/cms/types.ts` | Public CMS types (map from Directus shapes) |
| `src/views/Projects.tsx` | Switch to `lib/cms` fallbacks |
| `src/lib/directus/client.ts` | Deprecate / thin shim after cutover |
| `next.config.ts` | Blob `images.remotePatterns` |
| `vercel.ts` | Path-scoped CSP for `/cms` if preview needs it |
| `.env.example` | PAYLOAD_SECRET, DATABASE_URI, BLOB token placeholders |
| `tests/cms-payload.test.mjs` | published filter, empty DB, asset URL |
| `scripts/verify-portal-cms.mjs` | Extend Payload path checks |

---

### Task 1: Phase 0 locks (env + infra)

**Files:**
- Modify: `.env.example`
- Docs: `docs/PAYLOAD_CMS_PLAN.md` (L0 checkboxes)

- [ ] **Step 1: Choose DB**

Use **one** pooled Postgres URL (Supabase transaction pooler **or** Neon Marketplace). Never use direct high-max connections under Fluid.

- [ ] **Step 2: Document env names in `.env.example`**

```env
# Payload (server-only — never NEXT_PUBLIC_)
PAYLOAD_SECRET=
DATABASE_URI=postgresql://...   # POOLED / transaction mode
BLOB_READ_WRITE_TOKEN=

# Public site (unchanged)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

- [ ] **Step 3: Confirm proxy does not gate `/cms`**

Read `src/proxy.ts`. Matcher must remain `/admin`, `/portal`, `/auth` only — **no** `/cms`.

- [ ] **Step 4: Branch**

```bash
git checkout -b feat/payload-cms
```

---

### Task 2: Scaffold Payload 3 into existing Next app

**Files:**
- Create: `src/payload.config.ts`
- Create: `src/app/(payload)/**` (per official Next blank installer)
- Modify: `package.json` (pin Payload versions)

- [ ] **Step 1: Install (pin exact versions in PR)**

```bash
npx create-payload-app@latest
# Prefer official "existing Next.js" / blank install docs for Payload 3 + Next 16.
# Pin: payload, @payloadcms/next, @payloadcms/db-postgres, @payloadcms/storage-vercel-blob, @payloadcms/richtext-lexical (if used)
```

- [ ] **Step 2: Force admin path**

In `src/payload.config.ts` (or equivalent):

```ts
export default buildConfig({
  // ...
  routes: {
    admin: '/cms',
  },
  // secret: process.env.PAYLOAD_SECRET
  // db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })
  // plugins: [vercelBlobStorage({ ... })]
})
```

- [ ] **Step 3: Smoke local**

```bash
npm run dev
# Open http://localhost:3000/cms — first-user / login loads
```

Expected: Payload admin shell; **not** `src/app/admin` overwritten.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/payload.config.ts src/app/(payload)
git commit -m "feat(cms): scaffold Payload 3 with admin at /cms"
```

---

### Task 3: Collections + Blob + seed

**Files:**
- Create: `src/collections/CaseStudies.ts`, `Markets.ts`
- Create: `src/globals/SiteConfig.ts`
- Seed source: `directus/seed/case-studies.sample.json`
- Schema notes: `directus/schema/collections.json`

- [ ] **Step 1: CaseStudies fields** (map from Directus)

status (`draft|published|archived`), sort, type, location, problem, prep (array), result, image/beforeImage/afterImage (upload → Blob), market (`residential|commercial|public-sector`).

- [ ] **Step 2: Access control**

Anonymous/public: read **published** only. Payload users: full.

- [ ] **Step 3: Seed one published case study** from sample JSON.

- [ ] **Step 4: Blob smoke** — upload image in `/cms` media; confirm Blob URL.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(cms): case-studies, markets, site-config + Blob storage"
```

---

### Task 4: `src/lib/cms` public read path

**Files:**
- Create: `src/lib/cms/types.ts`, `src/lib/cms/client.ts`
- Modify: `src/views/Projects.tsx`
- Modify: `next.config.ts` remotePatterns for Blob host

- [ ] **Step 1: Implement graceful getters**

```ts
// src/lib/cms/client.ts — shape (implement with Payload Local API)
export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    // Local API: payload.find({ collection: 'case-studies', where: { status: { equals: 'published' } } })
    // on misconfig / empty → return []
  } catch {
    return []
  }
}

export function cmsAssetUrl(file: unknown): string | null {
  // normalize Blob / relative Payload media URL
}
```

- [ ] **Step 2: Fallback chain in Projects**

**Payload published → Supabase portfolio → static.** Never 500 empty CMS.

- [ ] **Step 3: Cache tags**

Public fetchers: `'use cache'` + `cacheTag('cms:case-studies')` (or Next 16 equivalent). Payload `afterChange` / `afterDelete` → `revalidateTag` / `revalidatePath('/projects')`.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(cms): lib/cms public reads + Projects fallback chain"
```

---

### Task 5: Hardening + cutover

**Files:**
- Create: `tests/cms-payload.test.mjs`
- Modify: `scripts/verify-portal-cms.mjs`, `docs/DIRECTUS_AND_PORTAL.md`
- Maybe: `vercel.ts` path-scoped `/cms` headers

- [ ] **Step 1: Tests** — published filter, empty DB → `[]`, `cmsAssetUrl` helper.

```bash
node --test tests/cms-payload.test.mjs
node --test tests/portal-*.test.mjs
npx tsc --noEmit
```

Expected: all green; portal unchanged.

- [ ] **Step 2: Preview deploy** — `/cms` login, Blob upload, publish, `/projects` shows CMS badge.

- [ ] **Step 3: If CSP blocks admin** — path-scoped headers for `/cms` in `vercel.ts`; then:

```bash
npx @vercel/config compile
```

- [ ] **Step 4: Prod cutover** — Sensitive env on Vercel; prefer preview → promote / Rolling Release; freeze Directus from default path.

- [ ] **Step 5: Commit**

```bash
git commit -m "test(cms): payload unit tests + verify script + legacy Directus docs"
```

---

## Self-review

| Spec item | Task |
|-----------|------|
| `/cms` admin | Task 2 |
| Collections parity | Task 3 |
| lib/cms + Projects | Task 4 |
| Blob + pooler | Tasks 1–3 |
| Cache revalidate | Task 4 |
| Portal unchanged | Task 5 |
| No Convex / Services / Docker CMS | Locks (do not open) |
| No `/admin` overwrite | Task 2 |

---

## Execution handoff

Plan complete at `docs/superpowers/plans/2026-07-10-payload-cms.md`.

1. **Subagent-Driven (recommended)** — one subagent per task + review  
2. **Inline Execution** — executing-plans with checkpoints  
