---
trigger: always_on
description: Enforces the Pre-Implementation Evaluation gate and Devil's Advocate subagent rules.
---
# Pre-Implementation Evaluation Guardrails

To prevent the autonomous DevHealer loop from introducing architectural regressions or technical debt, all developer agents MUST adhere to the following evaluation policy:

## 1. Mandatory Pre-Flight Evaluation
*   Before writing any code to the workspace, you MUST evaluate the theoretical blast radius of your proposed fix.
*   Consider performance impacts, security vulnerabilities, downstream dependency breakages, and alignment with the `development-ontology.md` guidelines.

## 2. The Trade-Off Trigger
*   If your proposed fix is strictly positive (e.g., fixing a simple syntax error), proceed immediately.
*   If your proposed fix involves ANY engineering trade-offs (such as bypassing a linter rule, introducing a temporary hack, or changing an established architectural pattern), you MUST invoke the `devils-advocate` subagent for adversarial review.

## 3. Red-Team Resolution
*   If the `devils-advocate` rejects your code, you must formulate a new approach or stop and ping the user for manual intervention. You may not merge code rejected by the Devil's Advocate.
