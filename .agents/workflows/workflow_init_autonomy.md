---
name: workflow_init_autonomy
description: Initializes true autonomy by leveraging the native schedule tool to act as a perpetual cron.
---

# Autonomous Cron Initialization Workflow

This workflow kicks off true autonomy by setting up a background schedule that wakes the agent periodically to perform checks.

## Step 1: Establish the Schedule
*   Use the native `schedule` tool to create a cron job.
*   **Parameters:**
    *   `CronExpression`: `*/5 * * * *` (Every 5 minutes)
    *   `Prompt`: "CRON PING: Autonomous CI Check. Run tests using the `run_tests` skill and `run_command`. If an anomaly is found, use the `heal-and-evolve` skill and spawn a `healer-researcher` and `healer-repair` subagent in a shared workspace to fix it natively. Do not wait for user input."

## Step 2: Confirmation
*   Verify the schedule task ID is active via `manage_task status`.
*   Output a success message to the user confirming that true autonomy has been initialized.
