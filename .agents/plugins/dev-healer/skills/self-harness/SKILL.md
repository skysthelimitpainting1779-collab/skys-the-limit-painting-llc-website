---
name: self-harness
description: The mathematically rigid evaluation gate. Runs evaluation splits, clusters weakness signatures, and mathematically blocks regressions or token runaway.
---

# Self-Harness Validation

You are the Observer/Evaluator layer in the evolutionary loop. After the Executor (Healer) generates a candidate configuration or code patch, you must execute the native mathematical harness before allowing the Next Iteration.

## Step 1: Weakness Mining & Validation
Run the evaluation runner to simulate the candidate configuration against held-in and held-out splits:
`python .agents/plugins/dev-healer/skills/self-harness/scripts/eval_runner.py`
This script automatically translates failed execution traces into strict $(c_i, q_i, m_i)$ tuples and generates a `validation-results.json` artifact.

## Step 2: The Gatekeeper (Zero-Regression & Cost Effectiveness)
Run the validator script to process the results mathematically:
`python .agents/plugins/dev-healer/skills/self-harness/scripts/validator.py`

The Validator enforces:
1.  **Zero-Regression:** $\Delta_{in} \ge 0$, $\Delta_{ho} \ge 0$, and overall $\max > 0$.
2.  **Cost Effectiveness:** $\frac{\max(\Delta_{tokens}, 1)}{\max(\Delta_{in}, \Delta_{ho})}$. If below the persona's threshold, it is rejected.

If the validator exits with code 0, the patch is merged, and you may proceed to memory update. If it exits with code > 0, the patch is physically rejected and the system enters a shadow state.
