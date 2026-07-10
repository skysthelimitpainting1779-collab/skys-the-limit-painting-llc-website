---
type: documentation
title: Directus CMS + Client Portal + OAuth
description: Run Directus locally, wire OAuth via Supabase, use the protected client portal.
tags: [directus, oauth, portal, vercel]
---

# Directus CMS, OAuth, and client portal

> **Legacy CMS path.** Product decision (architecture **v2**): marketing CMS → **Payload 3** in-app at `/cms` (Blob + pooled Postgres).  
> Plan: [`PAYLOAD_CMS_PLAN.md`](./PAYLOAD_CMS_PLAN.md) · Handoff: [`HANDOFF_PAYLOAD_CMS.md`](./HANDOFF_PAYLOAD_CMS.md) · Stack: [`.agents/STACK.md`](../.agents/STACK.md).  
> Portal OAuth + Supabase leads below **remain** after Payload cutover.  
> Do **not** re-home Directus onto Vercel Services / `Dockerfile.vercel` as the CMS strategy.

## Vercel plugin + frontier stack (mandatory)

| Decision | Choice | Why (Vercel-aligned) |
|----------|--------|----------------------|
| CMS (target) | **Payload 3** inside Next at `/cms` | Local API on Fluid; see plan v2 locks |
| CMS (legacy) | **Self-hosted Directus** (`docker compose`) or external URL | Not free always-on Fluid; not default Docker-CMS |
| Site host | **Next.js 16 on Fluid** + **Node 24** | Plugin defaults; Active CPU Functions |
| Project config | **`vercel.ts`** (`@vercel/config`) | Replaces `vercel.json` |
| Cache | **`cacheComponents: true`** in `next.config.ts` | Tag public CMS; never portal session |
| Session / OAuth | **Supabase Auth** (Google + GitHub) + **`src/proxy.ts`** | Fluid Node proxy; not Edge-only auth |
| Env | `NEXT_PUBLIC_*` public only; secrets via `vercel env` (Sensitive) | env-vars skill |
| Redirect URL | `{SITE}/auth/callback` | Allow-list in Supabase + provider console |

Do **not** deploy Directus as always-on free Fluid Docker/VPS. Do **not** reintroduce `vercel.json` next to `vercel.ts`. Do **not** put Payload under `/admin`.

### One Vercel project

Frontend (App Router) + backend (`src/app/api/*`) + portal + **Payload `/cms`** share **one** Vercel project and one Fluid deploy. Local Directus remains **compose-only** for legacy content work until cutover.

### Convex

Not the default. See `.agents/STACK.md` — full Convex migration is deferred; product fit is weak vs rewrite cost. Target hybrid: Next on Fluid + Supabase Auth/leads + **Payload CMS** + Turso agent memory.

## 1) Start Directus (local)

```bash
# requires Docker Desktop / engine
docker compose up -d
# Admin UI: http://localhost:8055
# Login: ADMIN_EMAIL / ADMIN_PASSWORD from .env.directus
```

1. Create collections matching `directus/schema/collections.json` (`case_studies`, `markets`, `site_config`).
2. Grant **Public** role **read** on published items (or use a static token in server-only code later).
3. Import sample items from `directus/seed/case-studies.sample.json`.
4. In app env (`.env.local`):

```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
```

When Directus is down, `getCaseStudies()` returns `[]` and `/projects` falls back to Supabase portfolio or static cards.

## 2) OAuth (portal)

1. Supabase Dashboard → Authentication → Providers → enable **Google** and/or **GitHub**.
2. Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://www.skysthelimitpaintingllc.com/auth/callback`
   - Preview: `https://*.vercel.app/auth/callback` (or project preview URLs)
3. App env (already used by Supabase client):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. User flow:
   - `/portal/login` → `signInWithOAuth` → IdP → `/auth/callback` → session cookie → `/portal`

## 3) Client portal

| Route | Access |
|-------|--------|
| `/portal/login` | Public |
| `/portal` | **Protected** — redirect to login if no session |
| `/auth/callback` | OAuth code exchange |
| `/auth/signout` | POST sign-out |

Portal data: leads in Supabase where `email` matches the signed-in user (estimate requests).

### RLS (required for real data)

Migration `supabase/migrations/20260709210000_portal_leads_select_by_email.sql` replaces the
placeholder policy `using (false)` with:

```sql
lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
```

Apply to the linked project:

```bash
supabase db push
# or run the SQL in the Supabase SQL editor
```

Without this, authenticated portal users always see **zero** leads.

## 4) Verify

```bash
npm test -- tests/portal-auth.test.mjs tests/directus-client.test.mjs tests/portal-data.test.mjs
npm run lint:types
```

Docker not available? Unit tests still exercise the real Directus client against a stub HTTP server and pure portal gates.
