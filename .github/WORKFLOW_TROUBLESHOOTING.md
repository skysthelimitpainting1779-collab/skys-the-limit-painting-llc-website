# Workflow troubleshooting

## Learning pipeline (Entire → Turso)

Workflow: `learn-pipeline.yml` runs **after** `CI/CD Pipeline` completes (and weekly).

```text
CI finish → entire-to-agentos → Turso learn_* tables → RECOMMENDATIONS.md artifact
```

Secrets (recommended for shared memory):

- `TURSO_DATABASE_URL` = `libsql://…`
- `TURSO_AUTH_TOKEN`

Without secrets, job uses ephemeral `file:./.agents/agent-os.db` and uploads artifacts.

Local:

```bash
npm run learn:pipeline -- --conclusion success --pipeline ci --job quality
npm run learn:query
npm run learn:recommend -- ci
```

Schema docs: `.agents/knowledge/LEARNING_TURSO.md`

## Local = CI

```bash
npm ci
npm run lint:ci          # react + types + md + knip
node scripts/agent-os.js bootstrap && npm test
npm run build
# or all-in-one:
npm run ci
```

## PR Automation (the good stuff)

Workflow: `.github/workflows/pr-automation.yml`

| Job | Purpose |
|-----|---------|
| Branch normalize | `feature/`→`feat/`, `bugfix/`→`fix/`, auto-rename via API |
| PR title | Conventional Commits title; tries auto-fix |
| Labels | Path areas + size XS–XL + `preview:ready` |
| Vercel verify | READY for PR SHA + HTTP health (`VERCEL_TOKEN`) |
| Auto review | Structured review / request-changes |
| Sticky dashboard | One living PR comment (marker `agent-os-dashboard`) |
| **PR automation all green** | Single required status for branch protection |

Local:

```bash
npm run branch:normalize:json
npm run pr:title
npm run vercel:verify
npm run pr:review
npm run pr:label
npm run pr:dashboard
```

**Branch protection (recommended required checks):**

1. `PR automation all green`  
2. `1 · Quality (lint · knip · test · build)` from CI/CD Pipeline  


## Git standards fail

Branch must start with: `feat/` `fix/` `chore/` `docs/` `infra/` `agent/` `devin/` `dependabot/`

Commits: Conventional Commits `type(scope): subject`  
CI sets `GIT_GUARD_STRICT=1` (warnings become errors).

## Knip fails

Config: `knip.json`. Ignores `.agents/**`, skills, graphify-out.  
Only **unused files** and **unused dependencies** fail CI (exports are off).

```bash
npm run lint:knip
```

## Markdownlint fails

Config: `.markdownlint.json` + `.markdownlintignore`.

```bash
npm run lint:md
```

## Duplicate CodeQL

CodeQL runs only in `codeql.yml`. `security-scan.yml` is npm audit + dependency review.

## Entire / hooks noise in CI

CI sets `HOOKS_SKIP`, `ENTIRE_SYNC_SKIP`, `GRAPHIFY_SKIP_HOOK` so agent hooks never run on runners.

## Node version

Use `.nvmrc` (`24.0.0`). Workflows use `node-version-file: '.nvmrc'`.
