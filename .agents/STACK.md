---
type: knowledge
title: Target Tech Stack (Vercel frontier 2026)
description: Codified frontier stack — Fluid, Next 16, vercel.ts, Node 24, Payload CMS, hybrid auth; Docker/Services rules.
tags: [stack, vercel, nextjs, fluid, frontier, payload]
version: 2.0.0
---

# Target tech stack — Vercel frontier (2026)

**Authority:** Vercel plugin skills (`knowledge-update`, `deployments-cicd`, `env-vars`, `auth`, `next-cache-components`). Model memory loses when it conflicts.

**CMS plan:** [`docs/PAYLOAD_CMS_PLAN.md`](../docs/PAYLOAD_CMS_PLAN.md) (architecture v2) · handoff [`docs/HANDOFF_PAYLOAD_CMS.md`](../docs/HANDOFF_PAYLOAD_CMS.md)

## Platform (Vercel) — **one project, one Next service**

**Decision (Vercel plugin + architecture loop 2026-07-09):** Frontend + API + portal + **Payload CMS** live in **one Vercel project** as a **single Next.js 16 app** on **Fluid Compute**. Do not split the CMS into a second service or container unless a future ADR reopens topology.

```text
┌─ Vercel project: skysthelimit-website (Fluid + Node 24) ────────┐
│  Next.js 16 App Router  (single service)                        │
│  ├─ Marketing UI (RSC / client)                                 │
│  ├─ /api/*  (leads, cron, storage, …)                           │
│  ├─ /portal + OAuth callback (Supabase session cookies)         │
│  ├─ /admin  Supabase marketing admin (existing)                 │
│  ├─ /cms    Payload 3 admin + API (in-app)                      │
│  ├─ src/lib/cms/*  Local API public readers                     │
│  └─ src/proxy.ts (Node) — session refresh + portal/admin gate   │
│       matcher: /admin, /portal, /auth — NOT /cms                │
│  Config: vercel.ts (@vercel/config) only                        │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           ▼                  ▼                  ▼
    Supabase              Postgres (pooled)   Vercel Blob
    Auth + leads          Payload data        CMS media
           │
           ▼
    Turso (Agent OS memory only)
```

| Layer | Choice | Notes |
|-------|--------|--------|
| Project shape | **1 Vercel project** | No separate “backend” deploy for the site |
| Service shape | **1 Next app** | Not multi-service for CMS |
| Compute | **Fluid Compute** (default) | Node runtime; Active CPU pricing |
| Runtime | **Node.js 24.x** | 18 deprecated |
| Project config | **`vercel.ts` + `@vercel/config`** | Only config file (no dual `vercel.json`) |
| API / backend | **`src/app/api/*`** on Fluid | Same deploy as UI |
| CMS | **Payload 3** at `/cms` | Local API; Blob media; pooled Postgres |
| Data (product) | Supabase + Payload Postgres + Turso | Not Vercel Postgres/KV (retired) |
| Observability | Analytics + Speed Insights | Already wired |

### Docker / VCR / Services (Vercel mid-2026)

Platform now supports more than “no Docker ever”:

| Primitive | What it is | Our use |
|-----------|------------|---------|
| **Vercel Services** | Multiple frameworks in one project; rewrites + bindings | **Not for CMS.** Optional later for polyglot backends (e.g. Python/Go) |
| **`Dockerfile.vercel` / container Functions** | OCI image as Fluid Function (`$PORT`, scale-to-zero) | **Not for CMS.** OK for justified stateless HTTP (FFmpeg, etc.) |
| **VCR** | Project OCI registry | Only if we ship a container Function |
| **Docker-in-Sandbox** | Test deps / agents | Dev/test only |

| Workload | On Vercel? | Why |
|----------|------------|-----|
| Next site + API + Payload | **Native Next on Fluid** | No Docker needed |
| Payload admin/media | **In-app + Blob + pooler** | Same deploy |
| Directus (legacy) | **Compose / VPS / external URL only** | Stateful long-running CMS is a poor “always-on” Fluid hobby fit; container Functions still scale to zero and are not Compose |
| Stateless custom image | **Maybe** | Pinned need + VCR; separate ADR |
| Multi-service monorepo | **Maybe later** | Requires config ADR (`services` vs `vercel.ts`-only policy) |

**Do not:** treat Sandbox Docker or `Dockerfile.vercel` as a free VPS for Directus.

## Convex — should we move?

**Short answer: not as a full replacement right now.** Convex is excellent for **real-time collaborative / reactive** products. This product is primarily **marketing + lead capture + light client portal + CMS content**.

| Concern | Today | Convex full move? |
|---------|--------|-------------------|
| Marketing pages + SEO | Next RSC + static/CMS | Fine either way |
| Lead forms + RLS | Supabase `leads` + JWT email policy | Would rewrite schema + API + portal |
| OAuth portal | Supabase Auth (Google/GitHub) | Rebuild auth + sessions |
| CMS | **Payload 3 (target)** / Directus legacy | Convex is not a CMS admin UX |
| Agent OS memory | Turso | Keep — Convex ≠ Turso agent schema |
| Real-time multiplayer | Low need | Convex strength unused |
| Migration cost | — | **High**, multi-week, little CRO upside |

**When Convex *would* be better:** live estimate collaboration, real-time dispatch board, multi-user contractor ops app.

**If we ever adopt Convex:** bounded domain only — **not** rip-and-replace Supabase + Payload + Turso.

## App framework

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** App Router + React **19** |
| Cache | **`cacheComponents: true`** — tag public CMS reads; never cache portal/session |
| Network boundary | **`src/proxy.ts`** (Node; Next 16 rename from middleware) |
| Auth (portal) | **Supabase Auth OAuth** (Google/GitHub) + session cookies |
| Auth (CMS) | **Payload Users** (separate from portal) |
| CMS content | **Payload 3** → `src/lib/cms` → `/projects` (fallback Supabase portfolio / static) |
| CMS media | **Vercel Blob** |
| CMS DB | **Pooled Postgres** (Supabase pooler or Neon Marketplace) |
| UI | Tailwind v4 + Shadcn; **radius 0**; safety orange + charcoal |
| Fonts | **`next/font` Geist** only (no blocking Google Fonts CSS) |

## Agent OS

| Layer | Choice |
|-------|--------|
| Kernel | `.agents/AGENTS.md` + `ONTOLOGY.md` |
| Domains | `.agents/domains/*` with state/errors/successes → Turso |
| Decisions | **Vercel plugin mandatory** for platform choices |

## Do not

- Edge-only middleware as default
- Deploy Directus (or any stateful CMS) as always-on free Fluid Docker / “VPS mode”
- Put Payload under `/admin` without rename + proxy plan
- Add `/cms` to Supabase `proxy.ts` matcher
- Hand-roll Vercel OAuth token exchange (use managed auth / Supabase providers)
- Reintroduce `vercel.json` alongside `vercel.ts` for this app (reopen only with Services ADR)
- Replace portal auth or leads with Payload/Convex in the CMS migration
- Production local-disk uploads for CMS media
