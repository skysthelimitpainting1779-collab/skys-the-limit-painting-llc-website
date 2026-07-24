---
name: workflow-reflexion
description: Autonomous Reflexion loop for self-correction and high accuracy tasks.
---
# Autonomous Reflexion Loop

This workflow orchestrates a Reflexion (Produce $\rightarrow$ Critique $\rightarrow$ Repair) loop. It relies on iterative, autonomous self-correction without relying on human interaction to debug or critique.

## Rules of Engagement
1. **Zero Prompts**: You must not ask the user for help when an error occurs. You must read the error logs and critique your own work.
2. **Zero Code**: Do not output code fixes as raw text to the user. Implement the repairs directly using file modification tools.
3. **Execution Context**: Always execute background commands via `python run_tests_hardened.py`. The exit codes of these commands drive the Reflexion loop.

## The Loop
1. **Produce**: Write the initial implementation or fix based on the current requirements.
2. **Execute**: Run native async tests using `run_command` (via the `run_tests` skill). Use `manage_task` to read the exit code.
3. **Critique**: If the test fails, use the `reflection-engine` skill to evaluate the exact error. You MUST pass the error stack trace to `search_web` and use the `context7` MCP on the failing library to discover exactly why the failure occurred before attempting a repair.
4. **Repair**: Apply targeted fixes using file modification tools based on the contextual critique. Use the `heal-and-evolve` skill to track anomaly resolution.
5. **Repeat**: Go back to Execute.

**Termination Condition**: The loop ends autonomously only when the `Execute` step yields a clean, zero exit code.
