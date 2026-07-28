# Development Lifecycle

This lifecycle is shared by humans, Codex, and Antigravity. Git remains the
source of code truth; the audited JSONL defines allowed execution order; the
local control-plane database records runtime coordination.

## State ownership

| State | Authority | Git policy |
|---|---|---|
| Application code and migrations | Git branch and PR | Tracked |
| Execution plan and stop gates | `.agents/execution/*-audited.jsonl` | Tracked, hash-pinned |
| Worktree code graph | `graphify-out/graph.json` | Generated, ignored |
| Checkpoints, leases, handoffs, deployments | `%LOCALAPPDATA%/SkyDevControlPlane/graphify.db` | Never tracked |
| Session transcript checkpoint | Entire CLI | Git-linked refs |
| Production deployment | Vercel Git integration | Exact commit SHA |

`.graph/` is legacy planning history only. It cannot authorize execution or
store live progress.

## Work loop

1. Sync and query the shared graph with `graphify_db_sync`,
   `graphify_db_search`, and `graphify_db_neighbors`.
2. Call `execution_graph_preflight`, then read the cursor and selected node.
3. Create one `agent/<task>` worktree from an audited or checkpointed head.
4. Acquire the single program writer lease with
   `lifecycle_checkpoint_begin`.
5. Work stage by stage: write a failing test, confirm RED, implement the
   smallest change, confirm GREEN, then run affected regression tests.
6. Write a hash-addressed evidence receipt with `npm run lifecycle:evidence --
   --input <draft.json>`, then commit it with the required lifecycle trailers.
7. Run `npm run lifecycle:verify`. The pre-push hook requires a clean tree,
   fresh Graphify and SQLite state, and the exact integration ref.
8. Complete the checkpoint with the receipt hash and the actual terminal
   `completed_stage` for a cross-node transition. This releases the writer
   lease and creates a graph-validated pending handoff at the exact commit.
9. Push explicitly with
   `git push origin HEAD:agent/skys-limit-convex-os`; Entire records the session.
10. The next agent accepts the handoff before beginning the next checkpoint.

Only one writer lease exists per execution program. Read-only graph queries and
reviews can run concurrently.

## Commit contract

Every non-merge commit after audited baseline
`5eb385d33976503cdac81e982ed74fbbc7f6839c` uses Conventional Commits and these
trailers:

```text
fix(scope): concise outcome

Execution-Program: stl-post-g20-sequential-tdd-v1
Execution-Node: AUDIT-SECURITY-REMEDIATION
Checkpoint-ID: cp-20260728-001
Evidence-SHA256: <64 lowercase hex characters>
```

The evidence digest names
`.agents/execution/evidence/<digest>.json`. CI hashes that committed receipt,
checks its program and node against the audited graph, and requires passing
verification. Receipt authors cannot self-assert review approval. The separate
`Independent PR Approval` check runs the verifier from the protected base
revision, not the PR checkout. It reruns for head changes, ready/draft
transitions, review submissions, edits, and dismissals, and requires a trusted
reviewer other than the author to approve the exact head SHA. The local
pre-push gate also requires the receipt digest in every outgoing commit's
completed SQLite checkpoint.

Do not commit databases, WAL files, logs, generated Graphify output, runtime
checkpoint files, secrets, or `.env` files. Do not force-push `main`.

## Pull requests and CI

PRs remain draft while the execution cursor or an approval gate says blocked.
The PR body records program, node, checkpoint, evidence hash, and handoff.

CI checks the pinned graph and sidecars, reruns semantic/schema validation,
validates all governed commits, rejects runtime state, then runs repository
contracts, lint/typecheck, and tests. Branch protection must require
Independent PR Approval, Repository Quality, CodeQL, dependency review, and
the Vercel preview check. `Independent PR Approval` is intentionally red while
the PR is draft.

## Vercel

Vercel Git integration owns builds and deployments; GitHub Actions does not run
`vercel deploy` or rebuild the application. Deployment verification resolves
the event's exact commit (`client_payload.git.sha` for Vercel dispatch or
`deployment.sha` for GitHub deployment status), checks out that SHA, and
smoke-tests the supplied HTTPS URL.

Production changes remain blocked until the audited G70 approval is explicit.
Rollback is `vercel rollback` or promotion of a known-good deployment, followed
by a ledger deployment record tied to the restored commit.

## Database operation

`SKY_DEV_CONTROL_PLANE` can point launchers at the workspace containing the
shared `dev` repository when parent-directory discovery is unavailable, such as
in CI or an isolated checkout. `SKY_DEV_RUNTIME` overrides the database
location. The default is `%LOCALAPPDATA%/SkyDevControlPlane` on Windows and
`~/.local/share/sky-dev-control-plane` when `LOCALAPPDATA` is unavailable.
Post-commit and post-checkout Graphify hooks bootstrap or update the worktree
graph and sync SQLite only after a completed rebuild. Pre-push fails when
`graphify-out/graph.json` or its SQLite mirror was not built at `HEAD`.

Local SQLite is canonical for agents sharing this machine. Turso is a valid
later replication target when coordination must span machines, but it must use
the same append-only event IDs and hashes, one remote writer lease transaction,
and local SQLite as an offline cache. Vercel application data and lifecycle
control data remain separate.

## Recovery

- Stale graph: rebuild Graphify, then run
  `python scripts/execution/sync_graphify_control_plane.py --prune`.
- Dirty worktree: commit governed work or move unrelated changes to another
  worktree; do not bypass preflight.
- Expired lease: acquire a new checkpoint only after confirming the prior
  session is inactive.
- Failed handoff: keep it pending with blockers; do not advance the cursor.
- Invalid audited graph: restore the manifest-pinned artifact and stop execution.
