---
name: workflow-plan-execute
description: Autonomous Plan-and-Execute loop for long-horizon tasks.
---
# Autonomous Plan-and-Execute Loop

This workflow orchestrates a Plan-and-Execute loop for complex, multi-step engineering tasks. It relies entirely on autonomous execution, requiring zero user prompting.

## Rules of Engagement
1. **Zero Prompts**: Do not ask the user for design decisions. If a trade-off is required, invoke the `devils-advocate` subagent to make the decision.
2. **Zero Code**: You must implement all steps autonomously using file modification tools. Do not output raw code for the user to copy.
3. **Execution Context**: Always execute background commands via `run_command` and `manage_task` natively.

## The Loop
### Phase 1: Plan
1. Research the codebase using the `codebase-memory-mcp` tools.
2. Formulate a comprehensive, step-by-step roadmap using the `adaptive-planner` and `plan_task` skills. You MUST use the `context7` MCP and `search_web` to validate all API assumptions in your plan before proceeding.

### Phase 2: Execute
1. Step-by-step, implement the items on the roadmap using the `generate_code` skill.
2. After each step, run static analysis or tests via native `run_command` to verify integrity.
3. If a step fails, you must adapt the implementation autonomously using the `heal-and-evolve` skill without querying the user.

**Termination Condition**: The loop ends when all roadmap steps are completed and the final integration test or compilation step passes successfully.
