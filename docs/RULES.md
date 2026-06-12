> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[INDEX.md]]
> *   **Relative Path:** [INDEX.md](../../obsidian-vault/wiki/INDEX.md)
> *   **Absolute Path:** [INDEX.md](file:///C:/Users/Johnny%20Cage/DEV/obsidian-vault/wiki/INDEX.md)

# Repository Rules

> Brain routing note: workspace policy is governed by `../AGENTS.md`, `../../AGENTS.md`, and `../../business_vault/vault_index.md`. This file only captures local website code rules.

## 🧬 Code Standards & Agent Discipline

To ensure consistency and maintain the high quality of the codebase, all agents must strictly follow these rules:

1. **Language & Types**:
   - Write all application code in strict TypeScript.
   - Run type checks locally via `npm run lint` (`tsc --noEmit`). No type assertions (`as any` or `any`) are permitted unless mathematically unavoidable and explicitly commented.
   
2. **Production Code Hygiene**:
   - Banned outputs: Do not commit `console.log`, `console.debug`, or developer debugging breakpoints in production files.
   - Use standardized API telemetry/logging paths via proper handlers.

3. **Strict Design & Accessibility Constraints**:
   - Keep colors tied to the central HSL design tokens declared in `src/index.css`.
   - **Contrast Safety Warning**: Safety Orange (`#FF5A00`) surfaces must use Dark Charcoal (`#050505`) text to satisfy WCAG AA contrast compliance. White text on safety orange is strictly banned.
   - **Emoji Ban**: Emojis in source code files, React components, strings, or HTML markup are strictly BANNED. The only exception is the DNA emoji (`🧬`) which is reserved exclusively for markdown documentation files.

4. **Directory Structure**:
   - Reusable components: `src/components/`
   - Static/dynamic pages: `src/pages/`
   - Static configurations and content data: `src/data/`
   - Serverless API functions: `api/`
   - Utility code, hooks, and routing: `src/lib/`

## 🛠️ Verification Gates Before Merge

All modifications must pass local verification checks before they are submitted or merged. Run these commands:

```bash
# Verify TypeScript compiles successfully
npm run lint

# Run the unit and integration test suites
npm test

# Run the production build and verify static prerendering
npm run build
```

Verify in a local browser via `npm run dev` for any visual changes to confirm layouts, contrast compliance, and interaction responsiveness.

## 🔀 Git & Branching Standards

- **Branch Naming**: Keep branches short, descriptive, and prefix them correctly:
  - `feat/...` for new features or layouts.
  - `fix/...` for bug fixes, style repairs, or type fixes.
  - `chore/...` or `docs/...` for setup, dependency upgrades, or documentation changes.
- **Commit Messages**: Follow standard semantic prefixes (e.g. `feat: ...`, `fix: ...`). Keep commits atomic and clean.

## 🔒 Security Rules

- **API Secret Storage**: Never commit `.env` or cleartext configurations to Git.
- **Example configs**: Keep `.env.example` updated with safe placeholder values.
- Treat lead processing endpoints (`api/leads.ts`, `api/manychat.ts`) and analytics handlers as high-integrity security boundaries.

