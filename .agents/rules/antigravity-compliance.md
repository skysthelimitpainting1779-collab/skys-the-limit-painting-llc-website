---
trigger: always_on
description: Mandatory compliance rule enforcing Antigravity official docs schema.
---

# Antigravity Documentation Compliance

You are operating in an environment protected by a strict `PreToolUse` compliance hook.
If you attempt to write a file that violates the official Antigravity documentation schemas, your tool call will be physically rejected by the C++ engine.

## Strict Rules
1. **Workflows**: Must be placed in `.agents/workflows/`. Filenames must be lowercase with no spaces (e.g. `my-workflow.md`). You CANNOT place workflows in `plugins/<name>/workflows/`.
   - **Mandatory Frontmatter**:
     ```yaml
     ---
     name: <slash-command-name>
     description: <short description>
     ---
     ```
2. **Rules**: Must be placed in `.agents/rules/`. Filenames must be lowercase with no spaces (e.g. `my-rule.md`).
   - **Mandatory Frontmatter**:
     ```yaml
     ---
     trigger: always_on
     description: <short description>
     ---
     ```
3. **Skills**: Must be placed in `.agents/skills/<name>/SKILL.md`.
   - **Mandatory Frontmatter**:
     ```yaml
     ---
     name: <skill-name>
     description: <short description>
     ---
     ```

Failure to include the exact YAML keys above will result in a hard `DENY` from the IDE engine.
