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

- Graphifyy incremental update: 5,956 nodes, 7,367 edges, 538 communities.
- Graphifyy query traversed the B20 Clerk/Convex auth, protected-route, event/idempotency, and reconciliation symbols before final verification.
- Context7 `/websites/convex_dev`: Clerk issuer domain belongs in `convex/auth.config.ts`; development and production Clerk instances must be configured separately per Convex deployment.
- Context7 `/websites/convex_dev`: `npx convex run <function> '<JSON>' --deployment <explicit>` can invoke internal queries and mutations; operator execution omits `--push`, disables implicit codegen/typecheck, and requires an explicit deployment selection.
- Context7 `/clerk/clerk-docs`: Next.js runtime identity uses Clerk publishable configuration plus server-only `CLERK_SECRET_KEY`, independent of Convex deployment credentials.

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

## Evidence still required before G20 approval

- Authorized offline snapshots or read-only exports for the live Supabase, Payload, and Directus inventories. Current reports correctly remain blocked rather than inferring live state.
- Approved execution of the prepared handoff against an explicitly named non-production Convex deployment, followed by a real opaque target inventory export and checksum reconciliation. The repository-owned path now exists, but only mocked calls have been verified.
- Configure and verify `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_JWT_ISSUER_ENV`, `NEXT_PUBLIC_APP_ENV`, and `NEXT_PUBLIC_CONVEX_URL` in each appropriate Convex/Vercel environment without exposing secret values.
- Commit the checkpoint, create a Preview deployment, and verify the approved Vercel web/integrations service topology and internal-only integration binding. No preview deployment has been created in this batch yet.

G20-FOUNDATION-READY must remain pending until these items have evidence and the named approver records approval.
