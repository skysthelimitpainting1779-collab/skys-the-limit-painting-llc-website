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

Do not store handoffs, target inventories, credentials, or dynamic execution output in the repository. Do not log operation payloads or raw provider errors.
