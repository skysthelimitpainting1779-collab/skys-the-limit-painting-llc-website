# AGENTS.md

Portable kernel for **any** coding agent. Host-native specialists compile from `.agents/specialists.json`.

**Product:** skysthelimit · **Tasks:** Linear `SKY-XX` · **Stack:** [`.agents/STACK.md`](.agents/STACK.md)

---

## Commands

```bash
npm install && npm run dev
npm run lint
npm test
npm run build
npm run lifecycle:verify
npm run graph:query -- "<task>"
npm run goal -- status
npm run goal:verify
npm run ship:eval
npm run host:compile          # regenerate Claude/Cursor/Codex/Copilot/Gemini adapters
```

---

## Entire CLI

**Installed globally:** via Scoop (`scoop install entire/cli`) - v0.8.42  
**Purpose:** Session checkpointing linked to Git commits for all coding agents

**Enabled agents:** Cursor, Gemini CLI, Codex  
**Git hooks:** Integrated via Husky (`.husky/prepare-commit-msg`, `commit-msg`, `post-commit`, `post-rewrite`, `pre-push`)

**Maintenance:**
- Keep Entire CLI updated: `scoop update entire/cli`
- Verify hooks after npm install: Husky may overwrite; check `.husky/*` files contain Entire calls
- Add new agents: `entire agent add <name>` (claude-code, copilot-cli, cursor, gemini, codex, etc.)
- Disable Vercel deployments for `entire/**` branches: `entire configure`

**Hard denial:** Never remove Entire hooks or disable checkpointing without explicit approval.

---

## Host layout (native)

| Host | Always-on | Specialists | Skills |
|------|-----------|-------------|--------|
| **All** | this file | `.agents/specialists.json` | `.agents/skills/` |
| **Claude** | `CLAUDE.md` → `@AGENTS.md` | `.claude/agents/*.md` | `.claude/skills/` |
| **Cursor** | `.cursor/rules/00-agents-kernel.mdc` | `.cursor/agents/` + `specialist-*.mdc` | path via rules |
| **Codex** | `AGENTS.md` | `.codex/agents/*.toml` | `.agents/skills/` |
| **Antigravity** | `GEMINI.md` + `.agents/rules/` | `.agents/rules/specialists.md` | `.agents/skills/` |
| **Copilot** | `.github/copilot-instructions.md` | path rules | `.github/skills/` |

Map: [`.agents/HOST_NATIVE.md`](.agents/HOST_NATIVE.md)  
**Zero theater:** only host-native paths + hard hooks. No domains/queues/hub_db/ontology novels.  
`npm run agents:zero-theater` · `npm run host:compile`

---

## Behavior (Karpathy)

1. **Think before coding** — state assumptions; ask if unclear; surface tradeoffs.
2. **Simplicity first** — minimum code; no speculative abstractions.
3. **Surgical changes** — only what the task requires.
4. **Goal-driven** — verifiable success; loop until `npm run goal:verify` passes.

## Mandatory discovery and reuse

- **Graphifyy first:** Before navigating or searching code, query the codebase knowledge graph with `search_graph`, `trace_path`, `get_code_snippet`, `query_graph`, or the repository `graph:*` commands. Fall back to `rg` only for literals/config/non-code or when graph results are insufficient.
- **Context7 first:** Before implementing or changing behavior from an external library, framework, provider, or API, query its current official documentation through Context7. Record the selected library ID and the contract that affects the change.
- **Skill before repetition:** Before performing a workflow a second time—or when the plan already shows it will recur—create or update a repository skill under `.agents/skills/` and route subsequent executions through it. Use `repeatable-workflow-capture`; validate the skill, run `npm run skills:validate`, and compile host adapters.

---

## Ship loop (RPI)

Non-trivial work:

```bash
npm run goal -- start "short title"
npm run goal -- phase research   # graph:query + research.md
npm run goal -- phase plan
npm run goal -- phase implement
npm run goal:verify
npm run goal -- done
```

Skill: `ship-loop` (`.agents/skills/ship-loop/`).

## Governed lifecycle

- Call `execution_graph_preflight` before selecting work.
- Read `execution_graph_cursor` and `execution_graph_node`, then acquire one writer lease with `lifecycle_checkpoint_begin`.
- Use one task branch and worktree per active writer. Never mutate `main` directly.
- Before checkpoint completion, write a secret-free per-node telemetry request and run `npm run telemetry:gate -- --input <absolute-request-path>`. Stop on any nonzero exit, append the passing result at the exact committed head with `lifecycle_record_telemetry_decision`, and include the decision hashes in evidence.
- Complete the checkpoint only after a clean commit and passing evidence. Cross-node completion supplies the terminal `completed_stage`; `lifecycle_checkpoint_complete` creates the graph-validated handoff.
- Every governed commit after `5eb385d33976503cdac81e982ed74fbbc7f6839c` requires `Execution-Program`, `Execution-Node`, `Checkpoint-ID`, and `Evidence-SHA256` trailers.
- The authoritative execution plan is `.agents/execution/skys-limit-sequential-tdd-execution-graph-audited.jsonl`. `.graph/` is planning history only.
- See `docs/DEVELOPMENT_LIFECYCLE.md` for Git, CI, Vercel, rollback, and recovery rules.

---

## Delivery acceptance & recovery

**Acceptance gate:** `npm run goal:verify` is the mandatory pre-delivery gate.
It runs lint + test (and optionally `--build`) and writes a timestamped result to
`.agents/goals/_eval/last.json`. No production deployment is accepted without a
passing verify result tied to the current revision.

**CI gate:** GitHub Actions (`.github/workflows/ci.yml`) runs git-standards,
dependency audit, tests, and build on PRs to `main` and branch pushes.

**Recovery route (owner: repo maintainer):**

```bash
# Rollback Vercel production to the previous deployment
npx vercel rollback --yes

# Or promote a known-good deployment
npx vercel promote <deployment-url>
```

- Vercel auto-deploys on push to `main`; a failed deploy is recoverable via the
  Vercel dashboard or CLI rollback within 90 days.
- For database migrations: `supabase db reset` (local) or restore from Supabase
  dashboard backup (production).
- Never force-push to `main`; revert via `git revert <sha>` and re-deploy.

---

## Project style

- Next.js App Router · TypeScript under `src/`
- Target architecture: [`.agents/CURRENT_DECISIONS.md`](.agents/CURRENT_DECISIONS.md)
- Measured Craft UI: semantic geometry · `#FF5A00` on charcoal · **no emojis** in product source
- Root cause only · public claims verifiable

## UI execution

- Route every non-trivial interface change through
  `.agents/skills/award-winning-ui-orchestration/SKILL.md`.
- Use the official shadcn MCP for component discovery and source-owned
  customization. Keep the modules in `registry.json` independently installable.
- Pair one UI executor with one independent verifier for every UI execution node.
- Preserve the existing Convex/Clerk provider and query ownership boundaries;
  UI work must not create a parallel provider or data layer.

---

## Context

| Always | On demand | Never bulk-load |
|--------|-----------|-----------------|
| This file | One skill `SKILL.md` | `graphify-out/wiki/**`, `GRAPH_REPORT.md` |
| | Specialist agent for the path | Full skill packs, hub dumps |

Hard denials (hooks): emoji in `src/`, wiki dumps, soft-skips, next/dynamic+ssr:false, recreate purged bloat. Soft env cannot disable denials.

---

## Evals / improve

```bash
npm run ship:eval
npm run ship:improve    # purge + hard purge + prevent + health + eval
```
