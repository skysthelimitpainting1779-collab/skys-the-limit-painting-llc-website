---
id: mandatory_error_learning
name: "Governance Policy: Mandatory Error Learning Protocol"
type: policy
description: "Non-negotiable self-healing protocol requiring instant postmortem logs on any command or tool failure."
tags: [governance, debugging, self-healing]
references: [architectural_decisions]
---

# Governance Policy: Mandatory Error Learning Protocol

**Status**: Active  
**Domain**: Operational Control & System Integrity

## Protocol Rule

When any terminal command, compilation runner, test, or filesystem tool fails (returns a non-zero exit code or an exception), the executing agent must immediately **stop** and document the incident before resuming:

1. Identify the exact root cause.
2. Append a structured `## [ERR-YYYYMMDD-NNN]` block to `.learnings/ERRORS.md`.
3. Include working and broken code snippets labeled `# CORRECT` and `# WRONG`.
4. State a concrete prevention rule to guide future runs.

## Rationale

Without deterministic memory, agentic loops repeatedly fall into the same failure trajectories (such as PowerShell quoting bugs or switch parameter misuse). Documenting the error immediately forces the system to cache its mistakes and retrieve them dynamically in subsequent runs, creating a self-healing capability ratchet.

## Log Block Structure

```markdown
## [ERR-YYYYMMDD-NNN] Description

**Logged**: Timestamp
**Priority**: high | medium | low
**Status**: resolved | quarantined
**Area**: Area

### Summary [ERR-YYYYMMDD-NNN]

Context.

### Error [ERR-YYYYMMDD-NNN]

Error text.

### Fix / Learning [ERR-YYYYMMDD-NNN]

Explanation + working example.

### Metadata [ERR-YYYYMMDD-NNN]

- Prevention: concrete prevention rule
```
