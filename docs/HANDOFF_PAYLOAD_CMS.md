---
type: handoff
title: Handoff — Payload CMS implementation prompt
description: Research-validated implementer prompt for Payload 3 on Next 16 / Vercel Fluid. Architecture locks in PAYLOAD_CMS_PLAN v2.
tags: [handoff, payload, cms, prompt]
version: 2.0.0
date: 2026-07-09
---

# Handoff: Payload CMS (implementer prompt)

**Status:** Architecture **v2 locked** — implement next (do not re-open Convex / Docker-CMS / Directus-on-Fluid).  
**Full plan:** [`PAYLOAD_CMS_PLAN.md`](./PAYLOAD_CMS_PLAN.md) (v2.0.0)  
**Stack SSOT:** [`.agents/STACK.md`](../.agents/STACK.md)  
**Orchestrator:** [`.agents/domains/ORCHESTRATOR.md`](../.agents/domains/ORCHESTRATOR.md)

---

## System prompt (paste for next agent)

```text
You are implementing Payload CMS 3 inside the existing Sky's the Limit Painting Next.js 16 app on Vercel Fluid (Node 24).

LOCKED DECISIONS (do not re-litigate):
1. Payload 3 in THIS Next app — one Vercel project, single service.
2. Admin at /cms only (routes.admin = '/cms'). Never overwrite src/app/admin.
3. Media: Vercel Blob only for production (no local disk on Fluid).
4. DB: Postgres pooled URL only (Supabase transaction pooler OR Neon Marketplace). Server-only.
5. Public reads: Payload Local API via src/lib/cms/* — fallback Payload published → Supabase portfolio → static.
6. Keep Supabase Auth portal + leads + Turso Agent OS. Do not migrate them to Payload or Convex.
7. Do NOT add Vercel Services multi-app, Dockerfile.vercel CMS, or vercel.json next to vercel.ts.
8. Do NOT add /cms to src/proxy.ts Supabase matcher. Payload has its own users.
9. Public CMS fetchers: cache tags + revalidate on publish. Never cache portal/session.
10. Authority: Vercel plugin skills + docs/PAYLOAD_CMS_PLAN.md + .agents/STACK.md.

MINIMUM SHIPPABLE:
- /cms works in dev
- case-studies (+ markets/site-config if time)
- Projects.tsx uses lib/cms with graceful fallbacks
- portal tests still pass
- pin Payload package versions in PR
- verify on Vercel preview (admin + Blob + publish + /projects), not only localhost

VERIFY: npx tsc --noEmit; portal + cms tests; npx @vercel/config compile after vercel.ts CSP changes.
```

---

## What we decided (research → validate → improve)

| Topic | Decision |
|-------|----------|
| CMS | Payload 3 in-app |
| Not Directus on Fluid | Stateful long-running CMS ≠ free always-on Docker; Services/Dockerfile.vercel still request-scale, not Compose VPS |
| Not Convex | No CMS admin UX; portal/leads rewrite cost |
| Not Services split for CMS | Multi-framework Services are for polyglot backends later |
| Blob | Locked for media |
| Pooler | Locked for Postgres |
| `/cms` | Locked admin path |
| Cache tags | Locked for public content freshness |

Vercel 2026 context (do not ignore): Fluid default, Active CPU, Node 24, `vercel.ts`, Blob public/private, Functions long max duration, sensitive env redaction in build logs, optional Rolling Releases / promote for cutover.

---

## Current state (as of handoff)

### Already working

| Area | Location | Notes |
|------|----------|--------|
| Directus client (replace) | `src/lib/directus/client.ts` | Types + getters + graceful empty |
| Projects CMS hook | `src/views/Projects.tsx` | CMS → Supabase portfolio → static; “Live from CMS” badge |
| Portal OAuth | `/portal/login`, `/auth/callback`, `/auth/signout` | Supabase Google/GitHub |
| Portal data | `src/lib/auth/portal.ts`, `portal-data.ts` | Gate + leads by email |
| Portal RLS | `supabase/migrations/20260709210000_portal_leads_select_by_email.sql` | Apply on remote if missing |
| Proxy gate | `src/proxy.ts` | `/admin`, `/portal`, `/auth/callback` only |
| Frontier config | `vercel.ts`, `next.config.ts` (`cacheComponents: true`) | No dual `vercel.json` |
| Directus legacy | `docker-compose.yml`, `directus/*`, `docs/DIRECTUS_AND_PORTAL.md` | Deprecate after Payload |
| Sample content | `directus/seed/case-studies.sample.json` | Payload seed source |
| Schema notes | `directus/schema/collections.json` | Field parity |
| Tests | `tests/directus-client.test.mjs`, `portal-*.test.mjs` | Retarget/add `tests/cms-payload.test.mjs` |
| Verify script | `scripts/verify-portal-cms.mjs` | Extend for Payload paths |

### Collisions (hard)

- **`src/app/admin`** = Supabase marketing admin → Payload at **`/cms`**.
- **CSP** in `vercel.ts` is marketing-tight → may need **path-scoped** `/cms` headers after preview smoke.
- **`images.remotePatterns`** currently Supabase + Directus localhost → add Blob; remove Directus after cutover.

---

## Your job

Follow **Phase 0 locks → Phase 1–3** in `PAYLOAD_CMS_PLAN.md`. Phase 0 checkboxes are **blocking**.

### Domain routing

| Paths | Domain |
|-------|--------|
| `src/app/(payload)/**`, `src/collections/**`, `src/lib/cms/**`, `src/payload.config.ts` | **content-market** (+ **frontend-vercel** for App Router glue) |
| `src/views/Projects.tsx` | content-market / frontend-vercel |
| `vercel.ts`, env, preview deploy | **ci-devops** + Vercel plugin |
| Portal files | leave unless regression |

```bash
npm run domain:route -- src/lib/cms/client.ts
npm run domain:prompt -- content-market
```

---

## Do / don’t

### Do

- Payload **Local API** from Server Components.
- Server-only `PAYLOAD_SECRET`, `DATABASE_URI`, Blob token.
- Map public types so `Projects.tsx` stays almost the same.
- Fallback chain: **Payload published → Supabase portfolio → static**.
- `cacheTag` + revalidate on collection change.
- Pin `payload` + `@payloadcms/*` versions in PR description.
- Smoke **preview** deploy before calling done.
- Mark secrets **Sensitive** on Vercel.

### Don’t

- Replace Supabase Auth with Payload Users for **portal**.
- Leads collection as portal SSOT.
- Convex.
- `vercel.json` beside `vercel.ts`.
- `/cms` in `proxy.ts` Supabase matcher.
- Local disk media in production.
- Payload Jobs (v1 non-goal).
- Dockerfile / VCR / Services for CMS.
- Break industrial UI (radius 0, orange/charcoal).
- Invent metrics or skip tests.

---

## Suggested commands

```bash
npm run agentos:health
npm run domain:list

# After Payload work
npx tsc --noEmit
npx tsx --test tests/portal-auth.test.mjs tests/portal-dashboard.test.mjs tests/portal-data.test.mjs
# add tests/cms-payload.test.mjs

npx @vercel/config compile
# preview: vercel deploy (or git push PR) then test /cms + /projects
```

---

## Env

```env
PAYLOAD_SECRET=
DATABASE_URI=              # POOLED
BLOB_READ_WRITE_TOKEN=     # confirm name with storage adapter docs

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Remove after cutover
# NEXT_PUBLIC_DIRECTUS_URL=
```

```bash
vercel env pull .env.local --yes
```

---

## Successor checklist

- [ ] Payload version + install approach recorded in PR
- [ ] Admin path `/cms` documented
- [ ] Seed steps for first case study
- [ ] Prod + preview env keys listed (server-only, Sensitive)
- [ ] Grep clean of `@directus/sdk` in `src/` (or deprecated shim)
- [ ] Cache revalidation demonstrated after publish
- [ ] Preview deploy verified (honest note if only local)
- [ ] Tests green

---

## Product context

- Site: https://www.skysthelimitpaintingllc.com  
- Contractor: Sky’s the Limit Painting LLC (MN IR816596)  
- Portal: clients see **their** estimate/lead status by OAuth email  

---

## One-line mission

> **Scaffold Payload 3 at `/cms` with Blob + pooled Postgres, model case-studies/markets/site-config, switch `Projects.tsx` to `src/lib/cms` with cache tags + fallbacks, leave Supabase portal alone, retire Directus after parity — no Docker CMS, no Convex, no Services split.**
