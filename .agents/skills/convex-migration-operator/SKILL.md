---
name: convex-migration-operator
description: Safely validate, apply, export, and reconcile approved offline CRM migration handoffs against an explicitly selected Convex deployment. Use for every repeated Convex migration execution, replay, target inventory export, and reconciliation operation.
---

# Convex Migration Operator

Use `npm run migration:convex --` for the complete operator path.

1. Generate the sensitive handoff outside the repository with `prepare-import.mjs --dry-run`.
2. Run operator `--dry-run` with explicit `--deployment` and `--environment`; verify its opaque run ID, count, and checksum.
3. Before `--apply`, obtain migration approval and pass both `--confirm-run-id` and `--confirm-deployment` exactly. Production additionally requires `--allow-production`.
4. Never add `--push`; deploy reviewed Convex functions separately before migration execution.
5. Require the deployment identity preflight to match `--environment` before any mutation or export. Never bypass a mismatch by relabeling a deployment.
6. Export the target inventory to a new path outside the repository. The export must contain only opaque canonical IDs, checksums, entity names, and reconciliation status.
7. Run `reconcile.mjs --dry-run` with the original handoff and exported Convex target inventory.
8. Stop on any conflict, checksum mismatch, malformed CLI response, or deployment-selection mismatch. Do not retry with changed inputs under the same run ID.

Do not store handoffs, target inventories, credentials, or raw dynamic execution
output in the repository. Sanitized gate evidence may record opaque provider IDs,
counts, timestamps, and cleanup results. Do not log operation payloads or raw
provider errors.

## Preview environment administration

The Vercel-managed Preview deploy key can deploy code but cannot administer
Convex deployment environment variables. For a missing non-secret Preview
variable, authenticate as the Convex project owner, select the exact named
Preview deployment in the Convex dashboard, set only the approved variable,
and verify the deployment name and value before triggering a new Preview build.
Never retry this account-admin operation with a deploy key.

## Clerk Preview issuer discovery

When the Convex Preview deployment needs `CLERK_JWT_ISSUER_DOMAIN`, run
`scripts/derive-clerk-preview-issuer.ps1`. It reads the existing Vercel Preview
publishable key only inside an access-restricted scratch directory, validates
the `pk_test_` tier, decodes Clerk's documented Frontend API origin, deletes the
scratch directory, and returns only the non-secret HTTPS issuer origin plus
sanitized lifecycle evidence.
