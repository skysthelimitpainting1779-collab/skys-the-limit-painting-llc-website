# Code Directory Context: Source Root

**Directory Path:** `src/`  
**Purpose:** Entry point and master routers governing the initialization, global styling, and structure of the React Vite website codebase.

> [!NOTE]
>
> ### 🧬 LLM CHEAT SHEET: CODEBASE ROOT QUICK REFERENCE
>
> - **Framework Stack:** React 19, Vite, TypeScript, React Router 7.
> - **Styling System:** Tailwind CSS 4 Vite integration plus custom semantic CSS in `src/index.css`.
> - **Orchestration Coordinates:**
>   - `App.tsx` — Master URL Router (react-router), route-level lazy loading, Suspense fallback, and Transition Wrapper (Motion for React).
>   - `main.tsx` — framework mounting element at DOM node `#root`.
>   - `types.d.ts` — Global TypeScript compile-time variables.
> - **Subdirectory Map:**
>   - `src/pages/` — endpoint views (routed by `App.tsx`).
>   - `src/components/` — reusable, responsive visual cards, layouts, conversion CTAs, and the fast service-area map.
>   - `src/lib/` — contact API handlers and Google SEO wrappers.
>   - `src/data/` — localized ad campaign matrices.

---

## 1. Functional Directory Roles

This directory holds the entry points for the React 19 / TypeScript framework:

- **App.tsx** — Master application shell. Governs URL routing using react-router, lazy-loads secondary page chunks with React Suspense for faster first load, integrates layout transitions using Motion for React, and injects pages dynamically including the `/service-area` coverage map route.
- **main.tsx** — Standard React initialization script that renders the `<App />` component into the DOM tree at the target element `#root`.
- **index.css** — The comprehensive custom stylesheet containing CSS custom properties (color variables, typography tokens), reset templates, slightly zoomed-out global scale, accessible focus outlines, reduced-motion safeguards, scroll behaviors, animations, and typography declarations, layered with Tailwind CSS 4 support from the Vite plugin.
- **types.d.ts** — Global TypeScript definitions ensuring type safety across component data parameters.

---

## 2. Codebase Directories Layout

These subfolders categorize the application's source files:

- `pages/` — Encompasses all end-point page layouts and details (interior residential page, exterior commercial page, etc.).
- `components/` — Encompasses all modular interface blocks (BeforeAfterSlider comparative tool, LeadForm questionnaire, ConversionHeader, ConversionFooterCta, etc.).
- `lib/` — Helper endpoints and state scripts (analytics wrappers, client submit utilities).
- `data/` — JSON datastores hosting localized geographic targeted landing page payloads.
- `assets/` — Image, logo, and video assets referenced by React page templates.
