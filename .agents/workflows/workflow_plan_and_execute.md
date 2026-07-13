---
name: workflow-plan-execute
description: Autonomous Plan-and-Execute loop for long-horizon tasks.
---
# Autonomous Plan-and-Execute Loop

This workflow orchestrates a Plan-and-Execute loop for complex, multi-step engineering tasks. It relies entirely on autonomous execution, requiring zero user prompting.

## Rules of Engagement
1. **Zero Prompts**: Do not ask the user for design decisions. If a trade-off is required, invoke the `devils-advocate` subagent to make the decision.
2. **Zero Code**: You must implement all steps autonomously using file modification tools. Do not output raw code for the user to copy.
3. **Execution Context**: Always execute background commands via `python run_tests_hardened.py`.

## The Loop
### Phase 1: Plan
1. Research the codebase using the `codebase-memory-mcp` tools.
2. Formulate a comprehensive, step-by-step roadmap in an artifact file (e.g., `scratch/internal_plan.md`).

### Phase 2: Execute
1. Step-by-step, implement the items on the roadmap.
2. After each step, run static analysis or tests to verify integrity.
3. If a step fails, you must adapt the implementation autonomously without querying the user.

**Termination Condition**: The loop ends when all roadmap steps are completed and the final integration test or compilation step passes successfully.
