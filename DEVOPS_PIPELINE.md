# CI/CD Pipeline & DevOps Architecture Guide

This document outlines the CI/CD pipeline configuration and Vercel environments for the **Sky's the Limit Painting** website repository.

---

## 1. CI/CD GitHub Actions Pipeline (`.github/workflows/ci.yml`)

The CI/CD pipeline is designed as a sequential gate-keeping system to verify codebase health before code can be merged or deployed.

### Pipeline Triggers & Configuration
- **Triggers**: Executed on any `push` or `pull_request` targeting the `main` or `staging` branches.
- **Concurrency**: Grouped by workflow and branch/PR reference with `cancel-in-progress: true` enabled to prevent redundant runs.
- **Permissions**: Hardened with least-privilege defaults (`contents: read`, `pull-requests: write` for posting preview URLs).

### Sequential Pipeline Jobs
The pipeline runs in a strict sequential order. A failure in any stage prevents subsequent stages from running:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  ① Lint Check │ ───> │   ② Testing  │ ───> │  ③ Next Build│
└──────────────┘      └──────────────┘      └──────────────┘
```

#### Job 1: Linting (`lint`)
- **Objective**: Verifies type safety and code quality.
- **Command**: `npm run lint` (runs `node scripts/enforce-git.js && node scripts/verify-react-versions.mjs && tsc --noEmit`).
- **Environment**: `ubuntu-latest` running the Node.js version specified in `.nvmrc`.
- **Note**: Does not allow automatic commits or pushes. Failures must be fixed locally.

#### Job 2: Test Suite (`test`)
- **Objective**: Runs unit and integration tests.
- **Dependencies**: Requires `lint` to pass successfully.
- **Command**: `node scripts/agent-os.js bootstrap && npm test` (bootstraps the agent environment, then runs the test runner `tsx --test tests/*.mjs`).
- **Environment**: `ubuntu-latest` with cached dependency structures.

#### Job 3: Production Build (`build`)
- **Objective**: Builds the Next.js production bundle to ensure no compile-time or static generation errors.
- **Dependencies**: Requires `test` to pass successfully.
- **Command**: `npm run build` (runs `next build`).
- **Environment**: `ubuntu-latest` utilizing Next.js build cache restoration for faster compilation.

---

## 2. Vercel Webhook & Deployment Environments

Deployment topologies are mapped to specific git branches and environments via the Vercel integration, facilitating isolated QA testing before production releases.

| Environment | Target Branch | Deployment Scope & Webhook Behavior |
| :--- | :--- | :--- |
| **Production** | `main` | Production-grade deployment served at the primary domain. Triggered when code is pushed/merged to the `main` branch. |
| **Staging** | `staging` | Pre-production staging environment mapped to the `staging` branch. Replicates production data and RLS rules for final integration checks. |
| **Preview** | Feature/PR branches | Ephemeral, dynamically created preview environments built for each Pull Request (`feat/*`, `fix/*`, etc.). Comments the preview URL back to the GitHub PR. |

### Integration Rules
- **Environment Variable Scope**: All secrets (e.g., Supabase service keys, Resend API keys) are configured directly via the Vercel dashboard and scoped to their respective environments (`Production`, `Preview`).
- **No Bot Commits**: Bot-initiated commits or self-healing scripts are strictly prohibited from pushing to the protected `main` and `staging` branches. All repairs must be completed on feature branches and merged via pull requests.
