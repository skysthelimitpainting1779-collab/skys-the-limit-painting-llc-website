---
name: workflow-react
description: Autonomous ReAct loop for dynamic, exploratory tasks without user intervention.
---
# Autonomous ReAct Loop

This workflow orchestrates a standard ReAct (Reason -> Act -> Observe) agent loop designed to operate 100% autonomously.

## Rules of Engagement
1. **Zero Prompts**: You must not ask the user for clarification. Use the Devil's Advocate subagent if ambiguity arises.
2. **Zero Code**: You must perform all file modifications yourself. Do not output code blocks and ask the user to copy-paste.
3. **Execution Context**: Always execute verification scripts via `python run_tests_hardened.py` to ensure process tree sweeping and prevent directory lockups.

## The Loop
1. **Reason**: Analyze the current error or feature request using the `memory-manager` skill to retrieve episodic memories. You MUST run `search_web` to look up exact errors, and use the `context7` MCP to fetch the latest documentation for the relevant APIs before proceeding. (The `context-injector-hook` will block you if you skip this).
2. **Act**: Invoke tools (e.g., `multi_replace_file_content`, `replace_file_content`) to address the issue. 
3. **Observe**: Run tests or static analysis natively via `run_command` (using the `run_tests` skill) to verify the state of the codebase. Check the output with `manage_task`.
4. **Repeat**: If the observation fails, reason about the failure using the `reflection-engine` skill and act again.

**Termination Condition**: The loop ends *only* when the observation phase returns a successful exit code (e.g., `node --check` returns 0).
