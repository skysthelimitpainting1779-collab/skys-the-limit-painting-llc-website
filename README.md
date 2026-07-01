---
type: documentation
title: Sky's the Limit Painting LLC Website Repository
description: Production Next.js 16 website for Sky's the Limit Painting LLC (MN Specialty Contractor — Painting, IR816596). Includes the Agent OS control plane, hardened CI/CD, a design system, and the full marketing/lead-generation site.
tags: [documentation, website, nextjs, painting, compliance, agent-os]
---

# Sky's the Limit Painting LLC — Website

Production-ready website for **Sky's the Limit Painting LLC**, an owner-operated, fully insured registered Minnesota Specialty Contractor (Painting, MN ID: IR816596) based in Inver Grove Heights and serving the Twin Cities metro. The site drives lead generation, automated estimate intake, and local/service-area SEO across residential, commercial, and public-sector markets.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui (`components.json`), `motion` (Framer Motion)
- **Backend / Data**: Supabase (Postgres, Auth, Storage) via `@supabase/ssr`
- **Email**: Resend
- **Video-as-code**: Remotion (hero and per-market loops in `remotion/`)
- **Analytics**: Vercel Analytics + Speed Insights, GA, custom event tracking
- **Hosting**: Vercel

## Agent Operating Manual

Use [.agents/AGENTS.md](.agents/AGENTS.md) as the source of truth for agent work — it defines the wiki-first workflow, verification gate, claim guardrails, and Google Open Knowledge standard. Enforced policies (POL-001…POL-007) are the source of truth in `scripts/agent-os.js` and are generated into `.agents/decisions.md` on bootstrap.

## Setup

Requires **Node 24.x** (matches CI) and npm.

1. **Install dependencies**
   ```bash
   npm ci
   ```

2. **Run the dev server** (http://localhost:3000)
   ```bash
   npm run dev
   ```

3. **Build for production** (also generates `sitemap.xml` / `robots.txt` via `postbuild`)
   ```bash
   npm run build
   ```

4. **Lint & typecheck** (git-standards guard + `tsc --noEmit`)
   ```bash
   npm run lint
   ```

5. **Run the test suite** (bootstrap the Agent OS ledgers first, exactly as CI does)
   ```bash
   node scripts/agent-os.js bootstrap && npm test
   ```

### Environment variables

Copy `.env.example` and fill in what you need. `src/lib/env.ts` resolves variables across standard, `NEXT_PUBLIC_`, `VITE_`, and Vercel integration `backend_` / `NEXT_PUBLIC_backend_` prefixes, so a Vercel-Supabase integration works without manual renaming. The site degrades gracefully (static fallbacks) when Supabase is not configured.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Home |
| `/residential`, `/commercial`, `/public-sector` | Market lanes |
| `/painting-services/[slug]` | Service landing pages (interior, exterior, cabinet refinishing, deck & fence, commercial repaints, …) |
| `/service-area`, `/service-areas/[slug]` | Coverage map + per-city local SEO pages |
| `/estimate` | Room Cost Calculator / estimate intake |
| `/projects` | Work gallery |
| `/about`, `/capabilities`, `/contact` | Company, capabilities statement, lead form |
| `/refer`, `/review` | Referral program, Google review funnel |
| `/admin` | Internal console |
| `/api/leads`, `/api/storage/upload-url`, `/api/memory`, `/api/manychat` | API routes |

## SEO & Structured Data

Structured data must follow [docs/google-open-knowledge.md](docs/google-open-knowledge.md): keep JSON-LD aligned with visible content, use stable entity IDs, validate changed URLs with the Google Rich Results Test, and avoid unsupported claims. The site emits `PaintingContractor`/`HousePainter`, `Service`, `BreadcrumbList`, `LocalBusiness`, and `FAQPage` schema (`src/lib/seo.ts`, `src/app/layout.tsx`). Homepage metadata, canonical, OpenGraph, and the `FAQPage` block live in `src/app/page.tsx` and `src/app/HomeClient.tsx`.

## Claim Guardrails

Marketing copy reflects only verified facts:

- **Insurance**: Fully insured (general liability + commercial auto/tools); COI available for qualified commercial/public-sector opportunities.
- **Registration**: Registered MN Specialty Contractor (Painting), MN ID: IR816596. Owner exempt from workers' comp under MN Statute 176.041.
- **Credentials**: Journeyworker Painter & Decorator background only — no DBE/TGB, government-certified, EPA, "licensed," or "bonded" claims unless separately verified.
- **Owner-operated** positioning is emphasized; reviews use honest proof, not fabricated testimonials or star counts.

## CI/CD Posture

- **Node**: `24.x` across `ci.yml`, `release.yml`, and `security-scan.yml`.
- **Supply chain**: all GitHub Action steps pinned to 40-character commit SHAs; Dependabot manages bumps. `dependency-review-action` (v5) and CodeQL run on every PR.
- **Lint gate**: `scripts/enforce-git.js` enforces branch-name prefixes (`feat/`, `fix/`, `chore/`, `docs/`, `infra/`, `devin/`, `agent/`, `dependabot/`) and Conventional Commits.
- **No auto-commits**: workflows never push back to branches; failures are reported, not auto-healed by committing.

## Verification Checklist

- `npm run lint`, `node scripts/agent-os.js bootstrap && npm test`, and `npm run build` all green.
- Browser-check `/`, a market lane, `/estimate`, `/projects`, and `/contact` after visual or copy changes.
- Validate any changed structured data with the Google Rich Results Test.
