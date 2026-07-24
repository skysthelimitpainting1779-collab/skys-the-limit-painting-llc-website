---
name: run_tests
description: Executes Jest and Playwright tests.
---

## Run Tests Skill

Execute `npm test` or `npx playwright test`. 
The results will be intercepted by the `PostToolUse` hook and stored in the operational logs for the sidecar to analyze.
