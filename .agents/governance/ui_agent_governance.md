---
id: ui_agent_governance
name: "Governance Policy: UI Agent Governance & Visual Guardrails"
type: policy
description: "Governance constraints for UI modification agents including directory restrictions, allowed skillpacks, visual guidelines, and verification loops."
tags: [governance, ui, guardrails, accessibility, design-system]
references: [architectural_decisions]
---

# Governance Policy: UI Agent Governance & Visual Guardrails

**Status**: Active  
**Domain**: Design System Compliance & AI Agent Operations

This document establishes the boundaries, constraints, and audit requirements for any autonomous or semi-autonomous AI agent performing user interface modifications.

---

## 1. Directory Access Restrictions

UI modification agents must operate under a principle of least-privilege folder access. They are restricted to making modifications in specific directories and are barred from editing core configuration files:

- **Permitted Directories**:
  - `src/components/` — Shared UI components and layouts.
  - `src/app/` — App Router pages, client components, and styles.
  - `public/` — Static assets, icons, and illustrations.
- **Prohibited Directories & Files**:
  - `backend/` — Direct backend services and APIs (obsolete/removed).
  - `.github/workflows/` — CI/CD automation and pipeline files.
  - `scripts/` — System bootstrap, build, validation, and custodian scripts.
  - `package.json` & `package-lock.json` — Dependency and version definitions.
  - `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` — Build system and parser configs.

---

## 2. Limitations on Allowed Skillpacks

UI agents are only permitted to load and use skillpacks that directly assist in component rendering and design styling:

- **Allowed Skillpacks**:
  - `shadcn` — Component configuration, installation, and custom registry integration.
  - `nextjs` — Next.js client-side component patterns and App Router layouts.
  - `react-best-practices` — Component structuring, hooks, and typescript patterns.
- **Prohibited Skillpacks**:
  - `accidental-data-loss-prevention` — System-level infrastructure protections.
  - Database administration, shell execution, or general back-office server administration tools.

---

## 3. Visual Guardrails & Design Tokens

To maintain the premium industrial, brutalist aesthetic of the brand, all styling modifications must strictly adhere to the following rules:

### A. Contrast Compliance (Safety Orange Rule)
- **Rule**: Background elements using Safety Orange (`#FF5A00` or Tailwind `bg-orange-safety`) must strictly use Dark Charcoal (`#050505` or Tailwind `text-black-primary`) for all overlying text, glyphs, and icons.
- **Prohibited**: Under no circumstances is white text (`#FFFFFF` or `text-white`) permitted on a safety orange background. White text on orange fails WCAG 2.1 AA contrast guidelines.

### B. Global Border Radius (Strict 0px Rule)
- **Rule**: All buttons, inputs, cards, containers, badges, dialogs, and modals must use a strict `0px` border radius or Tailwind `rounded-none`.
- **Prohibited**: No rounded corners are allowed. Any `rounded`, `rounded-md`, `rounded-lg`, or customized border-radius is a compliance failure.

---

## 4. Verification & Testing Protocol

Before any UI modification is proposed or committed:
1. **Accessibility Audits**: Run accessibility validation tests.
2. **Execution Gate**: Execute `npm test` locally to verify that all component, layout, and utility tests pass with zero errors.

---

## 5. Adversarial Critique-Auditor Loop

Autonomous UI modifications must be subjected to a multi-agent validation process before staging:

```
┌─────────────────┐       Staged Code       ┌─────────────────┐
│                 │ ──────────────────────> │                 │
│    UI Agent     │                         │  Auditor Agent  │
│  (Implementer)  │ <────────────────────── │   (Critique)    │
└─────────────────┘      Fix Violations     └─────────────────┘
```

1. **Staging Stage**: The modifying UI agent writes code modifications to a staging workspace or branch.
2. **Critique Stage**: A separate Auditor agent inspects the modified code against this governance policy. The auditor checks:
   - Check if any class contains rounded corners (e.g. `rounded-*`).
   - Check if safety orange backgrounds have white text.
   - Check if any prohibited files or directories were modified.
3. **Reconciliation**: If violations are found, the Auditor rejects the changes and provides a detailed error report. The UI agent must correct the code and re-submit it.
4. **Final Approval**: Once the Auditor verifies 100% compliance and all local tests pass, the change can be merged.
