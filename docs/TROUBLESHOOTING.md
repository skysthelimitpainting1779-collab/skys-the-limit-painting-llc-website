> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[INDEX.md]]
> *   **Relative Path:** [INDEX.md](../../obsidian-vault/wiki/INDEX.md)
> *   **Absolute Path:** [INDEX.md](file:///C:/Users/Johnny%20Cage/DEV/obsidian-vault/wiki/INDEX.md)

# Troubleshooting Guide

> Brain routing note: troubleshoot from `../AGENTS.md`, `../../AGENTS.md`, `../../business_vault/vault_index.md`, and `../../business_vault/marketing/omni_sync_dashboard.md` before treating this local doc as current reality.

## 🔴 `npm ci` Dependency Installation Issues

- **Symptoms**: Node version conflicts or lockfile mismatch.
- **Remedy**:
  1. Confirm your active shell runs Node 20.x or 22.x (required by the Vite/Tailwind configuration).
  2. Clear the target folder cache: delete `node_modules` and `package-lock.json` and reinstall cleanly via `npm install`.

## 🔴 TypeScript Type Check Failures

- **Symptoms**: Build fails during compiler check or `npm run lint` raises errors.
- **Remedy**:
  1. Make sure no React type references are missing. Confirm `@types/react` and `@types/react-dom` exist under `devDependencies` in `package.json`.
  2. Run `npm run lint` directly. Focus first on resolving module resolution conflicts or dynamic routing types inside `src/pages/LandingPage.tsx` or similar files.
  3. Avoid using `as any` type assertions. Build structured TS Interfaces matching API responses.

## 🔴 Build & Prerender Errors

- **Symptoms**: `npm run build` fails during the post-build prerendering phase.
- **Remedy**:
  1. Verify the error stack: the prerender compiler runs in Node ESM mode (`scripts/prerender.mjs`). Any ES modules import mismatch will crash the build.
  2. Confirm sitemap generation script `scripts/generate-sitemap.js` is executable and does not contain syntax errors.
  3. Ensure that target write paths under `dist/` are writable and that folder permissions exist.

## 🔴 Missing Assets or Media Errors

- **Symptoms**: Images or loop videos fail to load (404).
- **Remedy**:
  1. Check `public/` directory. All assets (e.g. `public/videos/hero.mp4`) must be positioned under `public/`.
  2. Verify referencing paths in React code: always prefix paths with a forward slash (e.g. `/videos/hero.mp4`, not `./videos/hero.mp4`).

## 🔴 Lead Form Submission & Webhook Failures

- **Symptoms**: Form displays processing states but fails to complete submission.
- **Remedy**:
  1. Open local DevTools and review the console and network requests for `/api/leads` or `/api/manychat`.
  2. Inspect Vercel log dashboard for webhook execution timeouts or Resend API response errors.
  3. Ensure that `RESEND_API_KEY` is present and active inside environment configuration variables.

