# Code Directory Context: Source Root

**Directory Path:** `src/`  
**Purpose:** Entry point and master routers governing the initialization, global styling, and structure of the React Vite website codebase.  

> [!NOTE]
> ### 🧬 LLM CHEAT SHEET: CODEBASE ROOT QUICK REFERENCE
> *   **Framework Stack:** React 18, Vite, TypeScript.
> *   **Styling System:** Vanilla semantic CSS in `src/index.css` (Tailwind is NOT used).
> *   **Orchestration Coordinates:**
>     *   `App.tsx` — Master URL Router (react-router) and Transition Wrapper (framer-motion).
>     *   `main.tsx` — framework mounting element at DOM node `#root`.
>     *   `types.d.ts` — Global TypeScript compile-time variables.
> *   **Subdirectory Map:**
>     *   `src/pages/` — endpoint views (routed by `App.tsx`).
>     *   `src/components/` — reusable, responsive visual cards and layouts.
>     *   `src/lib/` — contact API handlers and Google SEO wrappers.
>     *   `src/data/` — localized ad campaign matrices.

---

## 1. Functional Directory Roles

This directory holds the entry points for the React 18 / TypeScript framework:

*   **App.tsx** — Master application shell. Governs URL routing using react-router, integrates layout transitions using framer-motion, and injects pages dynamically.
*   **main.tsx** — Standard React initialization script that renders the `<App />` component into the DOM tree at the target element `#root`.
*   **index.css** — The comprehensive custom stylesheet containing CSS custom properties (color variables, typography tokens), reset templates, scroll behaviors, animations, and typography declarations. No Tailwind is used; all controls are custom custom-designed.
*   **types.d.ts** — Global TypeScript definitions ensuring type safety across component data parameters.

---

## 2. Codebase Directories Layout

These subfolders categorize the application's source files:
*   `pages/` — Encompasses all end-point page layouts and details (interior residential page, exterior commercial page, etc.).
*   `components/` — Encompasses all modular interface blocks (BeforeAfterSlider comparative tool, LeadForm questionnaire, ConversionHeader, etc.).
*   `lib/` — Helper endpoints and state scripts (analytics wrappers, client submit utilities).
*   `data/` — JSON datastores hosting localized geographic targeted landing page payloads.
*   `assets/` — Image, logo, and video assets referenced by React page templates.
