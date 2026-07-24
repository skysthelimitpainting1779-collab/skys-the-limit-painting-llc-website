---
name: workflow_universal_ci
description: The Root DAG Node for CI validation and git auto-commit.
---

# Universal CI Workflow (DAG Root)

This is Node 1 of the DevHealer Evolution Cascade. You have been triggered because the sidecar detected uncommitted changes or a structural anomaly.

## Step 1: CI Pipeline Scaffold (Programmatic)
Execute the programmatic CI setup script from the `universal-ci` skill to ensure pipelines and ignores are established.
- Run: `python .agents/skills/universal-ci/scripts/setup_ci.py`

## Step 2: Auto-Commit & Validation (Programmatic)
Execute the validation script to test the code and autonomously push it.
- Run: `python .agents/skills/universal-ci/scripts/auto_commit.py`

## Step 3: Cascade Branching
Analyze the exit code of `auto_commit.py`.

- **If Exit Code 0**: The code was perfect. It was committed and pushed. Halt this workflow gracefully. The DAG is complete.
- **If Exit Code > 0**: The code has structural or compilation errors. You MUST explicitly trigger the next node in the DAG to heal the project:
  - Run: `agentapi new-conversation /workflow_heal_project`
  - Provide the stderr output from the failed validation as context to the next agent.
  - Halt this workflow once the next node is triggered.
