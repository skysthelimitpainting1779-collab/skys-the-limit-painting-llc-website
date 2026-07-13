---
name: workflow-plan-review-execute
description: Autonomous Plan-Review-Execute loop using critic agents for high stakes tasks.
---
# Autonomous Plan-Review-Execute Loop

This workflow orchestrates a highly reliable loop designed for high-stakes modifications (e.g., refactoring core abstractions). It utilizes a self-contained reviewer (the Devil's Advocate subagent) to evaluate plans before execution, guaranteeing zero manual user reviews.

## Rules of Engagement
1. **Zero Prompts**: You must not block on user approval. The "Review" step must be handled programmatically by invoking the `devils-advocate` subagent or evaluating against strict ontological guidelines.
2. **Zero Code**: Do not output code for the user to copy. Modify the files directly.
3. **Execution Context**: Always execute verification scripts via `python run_tests_hardened.py`.

## The Loop
### Phase 1: Plan
1. Retrieve contextual data via MCP graph tools.
2. Generate an implementation plan internally.

### Phase 2: Review (Critic Agent)
1. Pass the internal implementation plan to the `devils-advocate` subagent.
2. Instruct the subagent to red-team the proposal for performance impacts, security vulnerabilities, or dependencies breakages (as per `eval-guardrails.md`).
3. If the plan is rejected, modify the plan based on the subagent's feedback and repeat Phase 2.

### Phase 3: Execute
1. Implement the approved plan step-by-step.
2. Verify syntax and tests after execution.

**Termination Condition**: The loop ends when the code passes all tests and static analysis.
