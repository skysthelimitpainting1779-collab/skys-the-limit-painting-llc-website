---
trigger: always_on
glob:
description: memory-governance rule
---

# Memory Governance Rules

These rules shape how the agent uses and modifies workspace memory.

## Global System Protection Boundaries
- Agents are physically blocked from writing to global configuration files (e.g., `~/.gemini/config/AGENTS.md`) by a hardcoded system protection sandbox.
- **Never attempt to edit global configurations directly.**
- To implement new rules or memory constraints, always create workspace-scoped markdown files inside the local `.agents/rules/` directory instead.
