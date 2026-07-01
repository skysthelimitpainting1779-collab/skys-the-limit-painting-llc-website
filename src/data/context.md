# Code Directory Context: Dynamic Operations Data

**Directory Path:** `src/data/`  
**Purpose:** Serves as the static data payloads that feed local ad campaigns and geographic target matrices.

> [!NOTE]
>
> ### 🧬 LLM CHEAT SHEET: OPERATIONS DATA QUICK REFERENCE
>
> - **Dynamic Payload Data Stores:**
>   - `landingPages.ts` — Holds structured page configurations (custom headlines, tailored benefits, localized portfolios) loaded dynamically by `src/pages/LandingPage.tsx`.
>   - `markets.ts` — Structured three-market payload for residential, commercial, and public-sector readiness pages.

---

## 1. Functional Directory Roles

This folder holds operational datasets that are parsed dynamically by view templates to output customized page content without database calls:

- **landingPages.ts** — Dynamic payload data store for all localized ad campaign landing pages and service SEO pages.
- **markets.ts** — Structured three-market payload for residential, commercial, and public-sector readiness pages; public-sector copy must stay evidence-safe and avoid unverified SAM.gov active claims.
