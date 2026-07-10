<!-- markdownlint-disable -->
# Code Directory Context: Page Views

**Directory Path:** `src/pages/`  
**Purpose:** Defines the primary public-facing layouts, service descriptions, and localized marketing lanes.  

> [!NOTE]
> ### 🧬 LLM CHEAT SHEET: CODEBASE PAGES QUICK REFERENCE
> *   **Primary Routes Map:**
>     *   `Home.tsx` — Hero visuals, before/after comparison tool, trust badges, services overview, and LeadForm.
>     *   `About.tsx` — Owner story (Anthony Briseno) and quality values.
>     *   `Contact.tsx` — Phone/text hooks, price-range calculator entry, booking fallback, and contact forms.
>     *   `Projects.tsx` — Portfolio showcase (residential, commercial, striping).
>     *   `Services.tsx` -> `ServiceInterior.tsx` / `ServiceExterior.tsx` / `ServiceCommercial.tsx` / `ServiceStriping.tsx` (Service specialties).
>     *   `LandingPage.tsx` — Programmatic landing page feeding from `src/data/landingPages.ts`, with estimate, price-range, phone, and LeadForm conversion paths.
>     *   `ServiceArea.tsx` — Active service coverage route powered by the reusable fast service-area map.
> *   **MN Compliance Gate:** Every page must state **"registered MN specialty contractor"** and **owner-operator workers' comp exemption (MN Statute 176.041)** when referencing insurance/licensing.

---

## 1. Functional Directory Roles

This folder contains the master React page components. Each page represents a distinct URL endpoint routed dynamically inside the main application wrapper:

*   **About.tsx** — Documents the trade-built, owner-led company story while keeping brand craftsmanship and preparation ahead of founder-first marketing.
*   **Capabilities.tsx** — Corporate capabilities statement with verified specialty contractor, insurance, NAICS, SWIFT, and public-sector readiness details; unverified SAM.gov active claims are not made.
*   **Commercial.tsx** — Thin wrapper rendering the commercial market payload through `MarketPage.tsx`.
*   **Contact.tsx** — Interactive contact portal with phone/text links, price-range calculator entry, booking fallback, and a standard estimate request form.
*   **Estimate.tsx** — Interactive room price-range calculator with presets, clamped numeric inputs, cabinet add-on scope, planning-range disclosure, and lead submission fallback.
*   **Home.tsx** — Primary landing page for Sky's the Limit Painting LLC. Displays hero section, before/after visual comparison slider, trust anchors, core values, services grid, and qualifying lead capture form.
*   **LandingPage.tsx** — High-performance local/service landing page structure designed for targeted local ad campaigns, loading content dynamically from data/landingPages.ts.
*   **NotFound.tsx** — Premium 404 error page to guide lost traffic back to the primary conversion flows.
*   **Projects.tsx** — High-end showcase portfolio of completed residential, commercial, millwork, and parking lot striping projects.
*   **PublicSector.tsx** — Thin wrapper rendering the public-sector market payload through `MarketPage.tsx`.
*   **Residential.tsx** — Thin wrapper rendering the residential market payload through `MarketPage.tsx`.
*   **Review.tsx** — Review routing funnel that sends happy clients to Google and captures lower ratings privately with visible failure recovery guidance.
*   **ServiceArea.tsx** — Interactive service area overview detailing coverage across the Twin Cities metropolitan area with a lightweight accessible coverage map and city links.
*   **ServiceCommercial.tsx** — Specialized bidding and project execution guide for commercial property managers and facilities, focusing on high-durability coatings.
*   **ServiceExterior.tsx** — Detail page for high-durability exterior painting, detailing pressure washing, scrape/prime, and weather-resistant coating applications.
*   **ServiceInterior.tsx** — Detail page for premium interior residential painting, highlighting surface preparation focus (sanding, drywall repair, dust extraction) and cutting-in techniques.
*   **ServiceStriping.tsx** — Detailed overview of high-durability parking lot pavement striping and municipal/commercial marking capabilities.
*   **Services.tsx** — Overview of the core commercial, residential, and specialty service categories.

---

## 2. Compliance Constraints

*   **Licensing Declarations:** All references to credentials must explicitly read registered MN specialty contractor to comply with Minnesota corporate rules.
*   **Workers' Comp Exemptions:** Any mention of certificates of insurance states clearly that workers' comp certificates are provided on request for partners while maintaining exempt owner-operator status under MN Statute 176.041.
