---
trigger: always_on
glob:
description: development-ontology rule
---

# Workspace Guidelines & Anomaly Ontology
This rule is Always-On and enforces project integrity guidelines for all developer agents.

## Enforced Standards
* **Process Handle Hygiene**: All background compilers, watchers, or test runners spawned in isolated worktrees must be explicitly terminated prior to subagent shutdown to prevent Windows directory lockups (Access is denied errors).
* **Workspace Isolation**: Multi-step codebase refactors or experimental repairs must be performed inside isolated background branches via New Worktree Mode.
* **Pathing Normalization**: Programmatically convert all backslashes (`\`) to forward slashes (`/`) in path strings prior to testing permissions, drive letters must be stripped during evaluation.
* **Character Capacity Safeguard**: Never commit log dumps, compile warnings, or stack traces directly into rule files. Rule updates must use a rewrite-in-place compacting pattern to stay well below 12,000 characters.
* **Syntax Validation**: Prior to committing any Javascript/Node.js changes, verify syntax validity (e.g., by running `node --check <file>`) to ensure no syntax errors or unclosed parentheses are introduced and prevent `ToolFailure` anomalies.
* **PowerShell String Escaping**: When scaffolding configuration files via terminal commands (e.g., `echo '{"scripts": {"test": "..."}}' > package.json`) on Windows PowerShell, single-quote encapsulation does not preserve double quotes correctly. Always use the `write_to_file` tool directly to scaffold JSON config files instead of terminal echoing.
* **No-Clone External Integrations**: When resolving external triggers (GitHub/Linear tickets), NEVER perform a full `git clone` of the repository. Instead, always execute inside the existing local repository using `git worktree add` or `invoke_subagent --workspace=worktree` to create a lightweight, isolated branch. This preserves disk space, bandwidth, and execution speed.
* **Architectural Hierarchy (Hooks > MCP)**: Deterministic IDE hooks (`hooks.json`) are the primary, first-class mechanism for context injection, security enforcement, and workflow orchestration. They run proactively and deterministically. Model Context Protocol (MCP) servers are strictly second-class citizens, reserved for optional, reactive cross-team tool sharing. Never attempt to replace a proactive hook with a reactive MCP tool.
* **Anomaly Resolution Flow**: For compilation/syntax errors (`ToolFailure`), locate the error via the healing state, perform diagnostic compilation and repair within an isolated worktree branch, verify with `run_tests_hardened.py`, cleanly teardown the worktree, and apply the validated fix back to the main repository.
