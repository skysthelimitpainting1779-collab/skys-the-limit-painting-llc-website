> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[INDEX.md]]
> *   **Relative Path:** [INDEX.md](../../obsidian-vault/wiki/INDEX.md)
> *   **Absolute Path:** [INDEX.md](file:///C:/Users/Johnny%20Cage/DEV/obsidian-vault/wiki/INDEX.md)

# Deployment Protocol

> Brain routing note: durable deployment truth starts at `../AGENTS.md`, `../../AGENTS.md`, and `../../business_vault/vault_index.md`. Use this file only as the local website deployment checklist.

## 🚀 Target Production Environment

The application is hosted on Vercel. Production deployments are linked automatically to the `main` branch. Preview deployments are generated automatically on pull requests to the `main` and `develop` branches.

## 🛠️ Strict Pre-Deployment Gates (Pre-Flight)

No code should be pushed to `main` or deployed to production without passing the local pre-flight gates. Run the following steps in sequence:

1. **Install Clean Dependencies**:
   ```bash
   npm ci
   ```
2. **Type Check & Linting**:
   ```bash
   npm run lint
   ```
3. **Execution of Automated Tests**:
   ```bash
   node --test tests/site-architecture.test.mjs
   ```
4. **Compile Production Build**:
   ```bash
   npm run build
   ```
   *Note: This command runs both Vite compilation and the static route prerender compiler (which compiles sitemaps, robots rules, and pre-renders static HTML files into `/dist`). Any failure here halts deployment.*

## 🔗 Route Additions & Registration Rules

When creating any new page or dynamic/static route, the following registrations are **MANDATORY** prior to deployment:
1. **Sitemap Registry**: Add the path to the `staticRoutes` list in [generate-sitemap.js](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/scripts/generate-sitemap.js).
2. **Static Compiler Cache**: Add the path, document title, meta description, and schema details to the static route configuration array inside [prerender.mjs](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/scripts/prerender.mjs).
3. **Verify Route Outputs**: Run `npm run build` and check that the target route file (e.g. `/dist/new-route.html`) generates successfully with correct SEO meta headers and NAP schemas.

## 🔑 Secrets & Environment Variables

- Never hardcode or commit API keys, webhook signing secrets, or credentials.
- **Local environment**: Use a ignored `.env` file for local testing.
- **Production environments**: Manage secrets strictly through the Vercel Dashboard Environment Variables panel.
- Prior to pushing changes that rely on new variables, verify they are defined in Vercel.

## 📦 Running Manual Vercel Deployments (If needed)

If you must run a manual deployment from the CLI (e.g. using `vercel-cli-with-tokens` skill):
- **Preview Deployment**:
  ```bash
  vercel deploy
  ```
- **Production Deployment**:
  ```bash
  vercel deploy --prod
  ```
Always verify the deployment URL visually after CLI completion.

## 🔄 Emergency Rollback Protocol

If a production build introduces critical runtime issues or a regression:
1. **Instant Rollback**: Open the Vercel Dashboard, go to **Deployments**, locate the last known-good deployment, click the actions menu, and select **Promote to Production**.
2. **Git Synchronization**:
   - Create a hotfix reversion branch: `fix/revert-change-description`.
   - Revert the offending commit: `git revert <commit-hash>`.
   - Open a PR, merge, and allow the CI/CD pipeline to deploy the clean reverted state to `main`.

