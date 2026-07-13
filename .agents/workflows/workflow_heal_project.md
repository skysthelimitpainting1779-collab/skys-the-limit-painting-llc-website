---
name: workflow_heal_project
description: Build and heal project anomalies automatically
---
# Trajectory Workflow: Build and Heal Project
# Command: /workflow-heal-project
# Size Cap Compliance: Under 12,000 characters

## Step 1: Secure State Inspection
*   Read current anomaly report from `%ANTIGRAVITY_EXECUTABLE_DATA_DIR%\healing-state.json`.
*   Verify error signature (e.g., `ToolFailure` compilation error).

## Step 2: Isolated Branching (Native Shared Workspace)
*   Check if active environment is inside a Git repository.
*   If initialized, spawn an isolated subagent in Shared Workspace mode:
    `invoke_subagent --workspace=share --role=resolver`

## Step 3: Run Diagnostic Compilation
*   Prepend compile & test runs using the native `run_command` tool (asynchronous):
    `run_command: <your-test-or-build-command>`, followed by `manage_task` to check status.

## Step 4: Proactive Evaluation Gate (Devil's Advocate)
*   Before applying any fix, evaluate the theoretical blast radius.
*   If there are ANY engineering trade-offs (e.g., bypassing linter rules, tech debt), you MUST spawn the `devils-advocate` subagent for adversarial red-teaming.
*   Only proceed to resolution if `devils-advocate` explicitly approves or the fix has strictly positive effects.

## Step 5: Resolve Anomaly
*   Let the subagent resolve database schemas, linter bugs, or compile conflicts.
*   Validate the fix using the `run_command` tool asynchronously to prevent background process locking.
*   **TOKEN LIMITER:** Agents MUST use maximum brevity. Do not output full file contents. Return only exact file diffs and a strict 1-sentence summary of the fix.

## Step 6: Merge & Evolve Rules
*   Kill the subagent using `manage_subagents` to cleanly teardown the shared workspace automatically.
*   Write lessons learned to `.agents/rules/development-ontology.md` following our rewrite-in-place compacting policy to stay strictly under the 12,000-character cap.
