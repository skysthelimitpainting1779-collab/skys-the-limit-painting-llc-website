# Project Charter & Objectives

Durable memory of project objectives, constraints, and runtime profile.

## Active Goals

### Goal GOAL-1

- **Description**: Agent OS closed-loop first milestone
- **Status**: in_progress
- **Budget**: $1
- **Spent**: $0.0000

## Security & Contrast Rules

- **POL-001 [contrast]**: Safety orange elements (#FF5A00) must use dark charcoal (#050505) text.
- **POL-002 [emoji]**: No emojis in source code or React components.
- **POL-003 [radius]**: All border-radius properties must be set to 0px or rounded-none globally.
- **POL-004 [side_effects]**: External side effects require an idempotency key, recorded effect state, and approval when sensitive.
- **POL-005 [rollback]**: The harness may quarantine and recommend recovery, but it must not automatically revert user files.
- **POL-006 [proactive-health]**: Proactively audit and heal at session start (Node version consistency to 24.x, stale CI-INCIDENT cleanup, .gitignore for generated .agents/skills/*/lib/). Append POL entries after each healing task.
- **POL-007 [automated-prs]**: Dependabot & Automated PR Policy: Detect Dependabot PRs automatically. For lockfile conflicts, recommend `@dependabot rebase` or close + wait. For workflow changes, advise manual Web UI merge due to OAuth scope. Never force-merge failing PRs; treat this as self-healing maintenance.
