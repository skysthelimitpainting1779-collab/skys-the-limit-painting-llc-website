# Website Context Map

**Directory Path:** `c:\Users\Johnny Cage\DEV\skysthelimit-collab`  
**Purpose:** Token-efficient routing map for the public Sky's the Limit Painting LLC React/Vite website.

> [!NOTE]
> ### 🧬 LLM CHEAT SHEET: WEBSITE QUICK REFERENCE
> * **Full generated code index:** `business_vault/marketing/website_codebase_index.md`.
> * **Framework:** React 19, Vite, TypeScript, React Router 7, Tailwind CSS 4.
> * **Primary app source:** `src/` with local routing maps in `src/context.md`, `src/pages/context.md`, `src/components/context.md`, `src/lib/context.md`, and `src/data/context.md`.
> * **Agent routing:** `.agents/AGENTS.md` and `CLAUDE.md` are compatibility routers into `.agents/AGENTS.md` and `business_vault/vault_index.md`.
> * **Website docs:** `docs/context.md` routes local website documentation back to the Obsidian brain.
> * **Website skillpacks:** reusable design, Vercel, CRO, SEO, and marketing skills live under `../.agents/skills/`; old temp bundles are not active sources.
> * **Lead intake APIs:** `api/leads.ts` and `api/manychat.ts`.
> * **Build and verification:** `npm run lint`, `npm test`, `npm run build`.
> * **Generated public SEO:** `scripts/prerender.mjs`, `scripts/generate-sitemap.js`, `public/sitemap.xml`, `public/robots.txt`.

---

## Primary Routes

| Route | Owner File | Purpose |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | Main conversion homepage with hero, proof, market lanes, process, and lead capture. |
| `/residential` | `src/pages/Residential.tsx` + `src/components/MarketPage.tsx` | Residential market page rendered from `src/data/markets.ts`. |
| `/commercial` | `src/pages/Commercial.tsx` + `src/components/MarketPage.tsx` | Commercial market page rendered from `src/data/markets.ts`. |
| `/public-sector` | `src/pages/PublicSector.tsx` + `src/components/MarketPage.tsx` | Public-sector readiness page rendered from `src/data/markets.ts`. |
| `/projects` | `src/pages/Projects.tsx` | Portfolio and case-study proof page. |
| `/about` | `src/pages/About.tsx` | Company story and trade-built differentiation. |
| `/contact` | `src/pages/Contact.tsx` | Main estimate request and direct contact page. |
| `/estimate` | `src/pages/Estimate.tsx` | Interactive room cost calculator and lead capture path. |
| `/review` | `src/pages/Review.tsx` | Review routing and private feedback recovery funnel. |
| `/capabilities` | `src/pages/Capabilities.tsx` | Corporate capabilities, compliance, NAICS, SWIFT, and readiness details. |
| `/service-area` | `src/pages/ServiceArea.tsx` + `src/components/ServiceAreaMap.tsx` | Fast accessible Twin Cities coverage map with local service-area links. |
| `/service-areas/:slug` | `src/pages/LandingPage.tsx` + `src/data/landingPages.ts` | Local SEO city landing pages. |
| `/painting-services/:slug` | `src/pages/LandingPage.tsx` + `src/data/landingPages.ts` | Service SEO landing pages. |

---

## Exact Edit Targets

| Task Type | Start Here |
| --- | --- |
| Header, footer, mobile sticky CTA, site frame | `src/components/Layout.tsx`, `src/components/ConversionHeader.tsx` |
| Universal conversion CTA before footer | `src/components/ConversionFooterCta.tsx` |
| Lead form behavior, offline fallback, analytics events | `src/components/LeadForm.tsx`, `src/lib/contact.ts`, `src/lib/analytics.ts` |
| Three-market pages | `src/components/MarketPage.tsx`, `src/data/markets.ts` |
| City/service landing pages | `src/pages/LandingPage.tsx`, `src/data/landingPages.ts` |
| Service-area map and coverage route | `src/components/ServiceAreaMap.tsx`, `src/pages/ServiceArea.tsx` |
| Interactive calculator | `src/pages/Estimate.tsx` |
| Review funnel | `src/pages/Review.tsx` |
| Compliance/public-sector claims | `src/pages/Capabilities.tsx`, `src/data/markets.ts`, `business_vault/reality_register.md` |
| SEO/prerender/sitemap | `scripts/prerender.mjs`, `scripts/generate-sitemap.js`, `public/sitemap.xml` |
| Website docs and agent routing | `.agents/AGENTS.md`, `CLAUDE.md`, `docs/context.md`, `docs/*.md` |

---

## Documentation Routing

Website documentation is subordinate to the Obsidian brain. For durable claims, start at `../business_vault/vault_index.md`, then use this context map, `docs/context.md`, and the exact website doc needed.

Superpowers planning docs now live in `../business_vault/marketing/superpowers/`; do not recreate `docs/superpowers/` inside the website tree.

---

## Verification Hooks

Run after website edits:

```powershell
Set-Location "c:\Users\Johnny Cage\DEV\skysthelimit-collab"
npm run lint
npm test
npm run build
```

Run after any workspace edit:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Johnny Cage\DEV\compile-all.ps1"
```

Run after any vault Markdown edit:

```powershell
graphify update .
```
