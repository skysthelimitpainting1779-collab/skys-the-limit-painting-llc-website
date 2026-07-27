# B20 Convex, Clerk, authorization, and migration evidence

## Implemented foundation

- STL-101: Convex package, auth config, provider boundary, and explicit development/preview/production tier contracts.
- STL-102: Clerk session mapping, ordered/sticky user lifecycle synchronization, exact-ID invitation acceptance/revocation, role hierarchy, redirect allowlisting, and retry-safe webhook handling; Convex remains the only resource-authorization authority.
- STL-103: deny-by-default Convex authorization, active tenant/project grants, disabled-user enforcement, and current-session MFA for privileged roles.
- STL-104: neutral root layout with separate marketing and protected route groups; protected routes fail closed without valid Clerk/Convex runtime configuration.
- STL-105: pure client/runtime/deployment schemas with server-only loaders. `CONVEX_DEPLOY_KEY` is isolated from protected runtime code.
- STL-106: CRM foundation tables and access-path indexes.
- STL-107: immutable audit facts, content-bound events and idempotency, stable-result replay, and lease-based webhook retry/recovery.
- STL-108/STL-109: offline-only Supabase, Payload, and Directus inventory manifests that refuse credentials and report unavailable live evidence explicitly.
- STL-110: deterministic offline handoff, fail-closed deployment-identity preflight, source-provenance-safe atomic CRM upserts, bounded opaque Convex target-inventory export, and checksum-aware reconciliation. No live import has been run.

## Vercel Marketplace integrations

- Clerk resource `skys-limit-clerk-preview` (`ir_57PGFkpe8UFzVctS`), Free, connected to project `website` for Preview and Development.
- Convex resource `skysthelimit` (`store_OKNjrL7AQNXqXMGR`), Free, connected by the user-completed Marketplace setup for Production and Preview as required by Convex automated deploys.
- The unconnected duplicate `skys-limit-convex-preview` was removed with explicit user approval.
- Secret values were never logged. No application deployment, production migration, traffic change, or provider disconnect occurred.

## Discovery and documentation evidence

- Post-merge checkpoint: `509d17258646`; observed `origin/main`: `45aae73febc7`. Neither reference is an approval record.
- Graphifyy incremental update: 5,956 nodes, 7,367 edges, 538 communities.
- Graphifyy query traversed the B20 Clerk/Convex auth, protected-route, event/idempotency, and reconciliation symbols before final verification.
- Read-only Graphify inventory: G20 is `pending`; it names `security-verification` as the primary skill and requires Graphify, Vercel, GitHub, and Vercel official-documentation evidence before readiness.
- Read-only Context7 inventories: `/websites/convex_dev` documents `CLERK_JWT_ISSUER_DOMAIN` in Convex auth configuration and separate development/production instances; `/websites/vercel` documents a project as the unit for repository, environment-variable, and deployment configuration.
- Local Vercel baseline records opaque team `team_bseTA2AuCO6A2fCOVY9ubrJo` and project `prj_L3ZMoQ79YLx9G2o6Lg9OubqO9H8m`; the two-service binding is the `website` web project plus the `skysthelimit` Convex Marketplace integration. This is local recorded evidence only, not a live read.
- Environment names only: `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_JWT_ISSUER_ENV`, `NEXT_PUBLIC_APP_ENV`, and `NEXT_PUBLIC_CONVEX_URL`; no values were read or recorded.

## Verification

- Mandatory `npm run goal:verify -- --build` at `2026-07-27T14:38:02.276Z`: lint passed, 383/383 tests passed, and the Next.js production build passed.
- Identity/lifecycle focused suite: 43/43 passed. Convex typecheck, anonymous local function push, root TypeScript, and an independent Next/Turbopack production build also passed.
- Independent security review found and verified repairs for stale-user resurrection, invitation-ID lifecycle binding, role escalation, redirect validation, post-provider authorization races, and unknown-invitation retry behavior.
- Skill `repeatable-workflow-capture`: system validation passed.
- `npm run skills:validate`: 66 routes passed.
- `npm run host:compile`: passed and mirrored 78 host-native skills.
- `git diff --check`: passed.
- STL-110 combined focused suite: 25/25 passed using injected CLI responses; coverage includes source-relabel attacks, replay, source-provenance conflict, deployment-environment mismatch before mutation, post-import target-payload mutation, pagination, target shape, and checksum reconciliation. Tests performed no live mutation or cloud target export.
- Convex backend typecheck (`npx tsc -p convex/tsconfig.json`) and migration/operator syntax checks passed. Local `convex run --help` confirmed the explicit `--deployment`, `--codegen`, and `--typecheck` flags without contacting a deployment.
- Anonymous local Convex push (`CONVEX_AGENT_MODE=anonymous npx convex dev --once`) passed at `127.0.0.1:3210`; this proves local deployability only and did not contact or mutate a cloud deployment.
- Skill `convex-migration-operator`: system validation, repository skill routing validation, and host-adapter compilation passed.

## Exact remaining remote evidence gaps before G20 approval

- Authorized offline snapshots or read-only exports for the live Supabase, Payload, and Directus inventories. Current reports correctly remain blocked rather than inferring live state.
- Approved execution of the prepared handoff against an explicitly named non-production Convex deployment, followed by a real opaque target inventory export and checksum reconciliation. The repository-owned path now exists, but only mocked calls have been verified.
- Configure and verify `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_JWT_ISSUER_ENV`, `NEXT_PUBLIC_APP_ENV`, and `NEXT_PUBLIC_CONVEX_URL` in each appropriate Convex/Vercel environment without exposing secret values.
- During the provenance repair, no remote read, deployment, or mutation occurred. The later authenticated Preview checkpoint is recorded separately below.

## Preview deployment checkpoint

- Authenticated Vercel evidence now confirms Preview deployment `dpl_NBj421UhyoSTFsUmBMSN5xQzMjCo` for commit `a780e68b7e462f3a782f3d777bedf3531dc520ce`.
- The Vercel/Convex integration selected the exact non-production Convex deployment `hidden-roadrunner-577`, environment `Preview`, and injected the public Convex URLs for the application build.
- Vercel environment-name inventory confirms `CONVEX_DEPLOY_KEY` and `NEXT_PUBLIC_APP_ENV` are scoped to Preview. Values were not recorded.
- The Preview build stopped because the Convex deployment itself lacks `NEXT_PUBLIC_APP_ENV`. The Vercel deploy key can deploy code but cannot administer Convex deployment environment variables.
- Credential scratch `E:\SkysLimitScratch\g20-convex-20260727T113802545` was created at `2026-07-27T18:38:02.5935594Z` and deleted at `2026-07-27T18:38:12.0003796Z`. Deletion was verified; no secret value or secret hash was retained; the attempted Convex environment update did not succeed.
- The remaining Preview blocker is authenticated Convex-owner configuration of non-secret `NEXT_PUBLIC_APP_ENV=preview` on `hidden-roadrunner-577`, followed by a fresh Preview build and read-only target inventory/reconciliation.

G20-FOUNDATION-READY remains pending. No approval is inferred; it requires the listed remote evidence and an explicit named-approver record.
