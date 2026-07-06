# Workflow Troubleshooting Guide

This guide covers common CI/CD pipeline issues and how to fix them.

## Node Version Deprecation
**Issue:** `Node 20 is being deprecated` or similar setup-node warnings.
**Fix:** Ensure the project uses `.nvmrc` with a specific pinned version (e.g., `24.0.0`) and that workflows use `node-version-file: '.nvmrc'`. Do not use `NODE_VERSION: '24.x'`.

## Inconsistent CodeQL Versions
**Issue:** Security scan fails or warns about mismatched CodeQL action versions.
**Fix:** Ensure `init`, `autobuild`, and `analyze` steps in `security-scan.yml` all use the exact same action version (e.g., `v4.36.3`).

## Dependabot Auto-Merge Fails
**Issue:** `$PR_URL` is undefined when Dependabot tries to auto-merge.
**Fix:** Ensure `PR_URL` is defined at the job level in `dependabot-auto-merge.yml`, not just in the step where it's used.

## Deployments Triggering Unexpectedly
**Issue:** Production deployment runs on every push to main instead of just releases.
**Fix:** Ensure `if: startsWith(github.ref, 'refs/tags/v')` is present on the `deploy-production` job in `release.yml`.

## CI Health Check Hook Failure
**Issue:** `git push` is aborted due to a CI health check failure.
**Fix:** Run `bash .github/scripts/ci-health-check.sh` locally to see which checks failed and address them before pushing again.
