---
id: architectural_decisions
name: "Architectural Decisions & Guardrails"
type: policy
description: "Unified rules and design tokens enforced globally in this workspace."
---

# Architectural Decisions & Guardrails

Unified policies and safety rules enforced across the workspace.

## Enforced Policies

- **[contrast]** POL-001: Safety orange elements (#FF5A00) must use dark charcoal (#050505) text.
- **[emoji]** POL-002: No emojis in source code or React components.
- **[radius]** POL-003: All border-radius properties must be set to 0px or rounded-none globally.
- **[side_effects]** POL-004: External side effects require an idempotency key, recorded effect state, and approval when sensitive.
- **[rollback]** POL-005: The harness may quarantine and recommend recovery, but it must not automatically revert user files.
- **[proactive-health]** POL-006: Proactively audit and heal at session start (Node version consistency to 24.x, stale CI-INCIDENT cleanup, .gitignore for generated .agents/skills/*/lib/). Append POL entries after each healing task.
- **[automated-prs]** POL-007: Dependabot & Automated PR Policy: Detect Dependabot PRs automatically. For lockfile conflicts, recommend `@dependabot rebase` or close + wait. For workflow changes, advise manual Web UI merge due to OAuth scope. Never force-merge failing PRs; treat this as self-healing maintenance.

