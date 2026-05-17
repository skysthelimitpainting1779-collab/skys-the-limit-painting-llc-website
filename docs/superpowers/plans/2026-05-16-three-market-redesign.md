# Three-Market Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the site around Residential, Commercial, and Public Sector market lanes while keeping Vercel as the deployment target.

**Architecture:** Add a shared market data module, reusable market page component, new top-level route pages, updated navigation/footer, and a redesigned homepage. Redirect legacy service URLs into the new architecture.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS 4, lucide-react, motion/react, react-router-dom.

---

### Task 1: Architecture Contract

**Files:**
- Create: `tests/site-architecture.test.mjs`

- [x] **Step 1: Write the failing test**

The test checks top-level routes, navigation order, approved homepage positioning, and forbidden claim language.

- [x] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-architecture.test.mjs`

Expected: fail because `/residential`, `/commercial`, and `/public-sector` are not implemented yet.

### Task 2: Shared Market Model

**Files:**
- Create: `src/data/markets.ts`
- Create: `src/components/MarketPage.tsx`
- Create: `src/pages/Residential.tsx`
- Create: `src/pages/Commercial.tsx`
- Create: `src/pages/PublicSector.tsx`

- [ ] **Step 1: Add market data**

Create one typed source of truth for residential, commercial, and public-sector content.

- [ ] **Step 2: Add reusable market page**

Render hero, capability sections, process, proof, insurance/COI language, and CTA from the shared data.

- [ ] **Step 3: Add page wrappers**

Each top-level page imports the shared component with its market slug.

### Task 3: Routing And Navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/ConversionHeader.tsx`
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Add new top-level routes**

Add `/residential`, `/commercial`, and `/public-sector`.

- [ ] **Step 2: Redirect legacy service routes**

Use `<Navigate replace />` so old links still resolve.

- [ ] **Step 3: Update nav/footer**

Primary nav becomes Residential, Commercial, Public Sector, Projects, About, Contact.

### Task 4: Homepage Redesign

**Files:**
- Replace: `src/pages/Home.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Replace old service-list homepage**

Build the hero, three-lane market section, proof stack, process, selected work, and final CTA.

- [ ] **Step 2: Add visual utilities**

Add grid/road-line/measurement motifs in CSS.

- [ ] **Step 3: Preserve estimate action**

Keep the email-draft estimate handoff and phone CTA.

### Task 5: Verification

**Files:**
- No production file changes expected.

- [ ] **Step 1: Run architecture contract**

Run: `node --test tests/site-architecture.test.mjs`

- [ ] **Step 2: Run TypeScript and production build**

Run: `npm run lint` and `npm run build`

- [ ] **Step 3: Browser verify**

Open `http://127.0.0.1:3001/`, `/residential`, `/commercial`, `/public-sector`, and `/contact`. Check first viewport, mobile viewport, console health, and visible claim guardrails.

