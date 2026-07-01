# Agent OS Operating Summary

Default architecture: harness-wrapper around the current coding runtime. The file-based control plane under `.agents/` is the durable source of truth for goals, task graphs, evidence, traces, queues, waits, effects, evals, and memory.

First milestone: prove the closed loop from goal intake to task graph, worker routing, execution, verification, memory update, visible dashboard, and one learning or eval improvement.

Key guardrails: keep public website claim rules from `AGENTS.md`, require verification before completion, record side effects before acting, preserve user changes, quarantine repeated failures, and keep external mutations approval-gated.

Current runtime constraints: local Node.js harness, restricted network, workspace-write filesystem, no automatic deploys, and no unsafe rollback of user files.
