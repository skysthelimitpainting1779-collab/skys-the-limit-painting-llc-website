# CI/CD workflows

## Pipeline topology

| Workflow | Trigger | Responsibility |
|---|---|---|
| `ci.yml` | Pushes and pull requests for governed branches | Git standards, then the reusable quality gate |
| `quality-gate.yml` | Reusable workflow and manual dispatch | Workflow contract, install, lint/typecheck, tests, Next.js build |
| `security-scan.yml` | Push, pull request, weekly schedule | Production dependency audit and pull-request dependency review |
| `codeql.yml` | Push, pull request, weekly schedule | The only CodeQL analysis workflow |
| `release.yml` | `v*` tags or confirmed manual dispatch | Reuse the quality gate, deploy a Vercel production artifact, publish a GitHub release for tags |
| `learn-pipeline.yml` | Successful `CI` completion or manual dispatch | Active-prevention self-test and rebuild verification |
| `ci-health-check.yml` | Daily schedule or manual dispatch | Run the reusable quality gate and maintain one deduplicated health incident issue |

## Local quality gate

```bash
npm run ci:contract
npm ci
npm run lint:ci
npm test
npm run build
```

`npm run ci:contract` verifies that every `npm run` command and every local script or reusable-workflow path referenced from `.github/workflows` exists. It also requires steps from the same action repository, such as CodeQL `init` and `analyze`, to use the same pinned ref. Run it whenever a workflow or `package.json` script changes.

## Required deployment secrets

- `VERCEL_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `PAYLOAD_SECRET`
- `DATABASE_URI`

The quality gate tolerates absent application secrets only when the application build itself tolerates them. Production deployment fails immediately when `VERCEL_TOKEN` is missing.

## Production release

Preferred release path:

1. Merge a green pull request into `main`.
2. Create and push a tag such as `v1.2.3` on that `main` commit.
3. `release.yml` reruns the canonical quality gate.
4. The workflow verifies that the tag commit belongs to `main`.
5. Vercel is pulled, built, and deployed with `--prebuilt --prod`.
6. GitHub release notes are generated after deployment succeeds.

Manual production deployment is available through `workflow_dispatch`; select the intended ref and explicitly enable `deploy_production`.

## Dependency updates

Dependabot opens dependency pull requests, but the repository does not auto-merge them. Review and merge only after CI, CodeQL, and Dependency Security are green. Do not restore workflow-driven auto-merge unless repository rulesets require those checks before merge.

## Branch coverage

CI runs for `main`, `staging`, and the branch prefixes enforced by `scripts/enforce-git.js`:

`feat/`, `fix/`, `chore/`, `docs/`, `infra/`, `devin/`, `agent/`, and `dependabot/`.

For pull requests, Git Guard validates the author-controlled PR title rather than GitHub's generated merge-commit message. Conventional titles may contain repeated scopes used by dependency automation, such as `chore(deps)(deps-dev): ...`.

## Failure routing

- A workflow command, local path, or shared action-ref mismatch fails at **Validate workflow contracts** before dependency installation.
- Lint and type failures fail at **Lint and typecheck**.
- Test failures fail at **Run tests**.
- Build failures fail at **Build Next.js app**.
- Missing Vercel credentials fail at **Verify production credentials**.
- The scheduled health workflow creates one open `CI health check failed` issue and comments on it for repeated failures; it closes the issue after recovery.

## Node version

`.nvmrc` is the single source of truth. Every Node workflow uses `node-version-file: '.nvmrc'`.
