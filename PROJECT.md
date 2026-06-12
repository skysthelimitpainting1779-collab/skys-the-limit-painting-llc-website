# Project: Sky's the Limit Painting LLC Visual Redesign & Functionality Audit

## Architecture
- React / Vite Single Page Application (SPA) statically prerendered with dynamic routing.
- CSS styling built with Tailwind CSS (v4) and global HSL variables (`src/index.css`).
- Data layers defined in `src/data/landingPages.ts` and `src/data/markets.ts`.
- Structured schemas defined in `src/lib/seo.ts` injected into pages using `<PageMeta />`.
- Lead processing endpoints via Serverless API style in `api/leads.ts` and `api/manychat.ts`.
- Navigation structure in `src/components/ConversionHeader.tsx` and layout in `src/components/Layout.tsx`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Testing Suite | Setup comprehensive opaque-box E2E test suite in `tests/` covering Tiers 1-4. | None | PLANNED |
| 2 | Compliance & Contractor Registration | Audit and update compliance statements on all pages (registered MN specialty contractor, owner-operator workers' comp exemption MN Statute 176.041), ensure no forbidden claims. | M1 | PLANNED |
| 3 | Visual Redesign, Contrast & Emoji Ban | Redesign pages with bento grids, micro-animations (Framer Motion), check HSL color compliance, verify zero emojis in source/components, ensure contrast compliance (#FF5A00 uses #050505 text). | M2 | PLANNED |
| 4 | Offline-first Lead Queue & API Audit | Audit `Estimate.tsx` calculator presets/calculations/bounds, check review routing logic in `Review.tsx`, implement local storage offline lead queue in `LeadForm.tsx`, verify API handlers `api/leads.ts` and `api/manychat.ts` with tests. | M3 | PLANNED |
| 5 | Performance, SEO & Build Hygiene | Verify sitemap (`scripts/generate-sitemap.js`, `public/sitemap.xml`), static prerendering (`scripts/prerender.mjs`), page performance, no debug lines/console.logs, all linting/testing/building commands pass. | M4 | PLANNED |
| 6 | Final E2E Test Pass & Adversarial Hardening | Run 100% of E2E tests, resolve any bugs found, run Tier 5 adversarial testing for white-box coverage. | M1, M5 | PLANNED |

## Code Layout
- `src/components/`: Reusable UI elements (BeforeAfterSlider, LeadForm, layout, mapping, cursors, micro-animations)
- `src/pages/`: Main page views (`Home`, `About`, `Contact`, `Estimate`, `Projects`, `Review`, `Capabilities`, `ServiceArea`, `LandingPage`)
- `src/data/`: Data models and content lists (`markets.ts`, `landingPages.ts`)
- `src/lib/`: Library utilities (`analytics.ts`, `contact.ts`, `seo.ts`)
- `api/`: Backend API routes for lead parsing and ingestion (`leads.ts`, `manychat.ts`)
- `tests/`: Integration, unit, and E2E validation test scripts

## Interface Contracts
### `src/components/LeadForm.tsx` ↔ `api/leads.ts`
- **Request Type**: `POST /api/leads` with JSON body payload containing:
  - `name`: string (required)
  - `phone`: string (required)
  - `email`: string (required)
  - `city`: string (required)
  - `address`: string
  - `market`: string
  - `projectType`: string
  - `propertyType`: string
  - `timeline`: string
  - `budgetRange`: string
  - `contactMethod`: string
  - `photosUrl`: string
  - `details`: string
  - `source`: string
- **Response Type**: `200 OK` with `{ success: true, leadId: string }` or `400 Bad Request` or `502 Bad Gateway` (fails to submit to webhook).
- **Offline Fallback**: Saves payload to `localStorage` under a queue key when connection is offline, triggers flush when navigator goes online.

### `src/pages/Review.tsx` ↔ Google Reviews vs Private Feedback Form
- **Rating threshold**: >= 4 stars -> Redirects user directly to Google Business Profile review link.
- **Rating threshold**: < 4 stars -> Renders private feedback form (LeadForm style) to route privately.
