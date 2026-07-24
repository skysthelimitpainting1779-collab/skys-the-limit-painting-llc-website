---
name: workflow_cascade
description: Orchestrates a massive backlog of tickets using a Directed Acyclic Graph (DAG) to enforce strict dependency resolution across isolated worktrees.
---

# Cascading Workflow (DAG Orchestrator)

You have been invoked to resolve a massive backlog of tickets (e.g., 200 Linear or GitHub issues). Do not attempt to resolve them simultaneously, as dependency collisions will crash the repository.

You MUST operate as a strict DAG Architect.

## Step 1: The Graph Analyzer
1. Pull all open tickets assigned to DevHealer.
2. Construct a `dependency-graph.json` artifact mapping each ticket to a Tier.
   - **Tier 1 (Infrastructure)**: Database schemas (Supabase RLS, tables, migrations), server configurations, and core architectural dependencies. You MUST pass instructions to the `resolver` subagent to query `context7` for Supabase Postgres best practices.
   - **Tier 2 (Backend APIs)**: Routes, Server Actions, edge functions, or handlers that depend on the Tier 1 schema.
   - **Tier 3 (Frontend UI)**: React components, client-side fetching, and UI states that depend on Tier 2 APIs.

## Step 2: Tier 1 Execution (Concurrency Throttled)
1. Spawn isolated background subagents for all Tier 1 tickets ONLY.
   `invoke_subagent --workspace=share --role=resolver --ticket=[ID]`
2. **TOKEN SAFETY GUARANTEE**: The orchestrator daemon (`integration-sidecar.py`) natively enforces a strict `ThreadPoolExecutor` queue with `MAX_CONCURRENCY=4`. Only 4 agents will ever run at the exact same time. It is physically impossible to exceed this without passing an `--override-concurrency` flag.
3. The `No-Clone` ontology policy applies. Do not clone the repo. Use native shared workspaces.

## Step 3: The Dependency Lock
1. Place a hard lock on Tier 2 and Tier 3 execution. 
2. Poll the Git state (`git log`, `git pull`).
3. You are strictly forbidden from spawning Tier 2 subagents until all Tier 1 Pull Requests have been successfully merged into `master`.

## Step 4: Cascading Resolution
1. Once Tier 1 is merged, unlock Tier 2.
2. Force the orchestrator to fetch the fresh `master` branch.
3. Spawn isolated subagents for Tier 2. Because they are branching off the updated `master`, they will have immediate access to the new database schemas built by Tier 1.
4. Repeat the Dependency Lock for Tier 3.
