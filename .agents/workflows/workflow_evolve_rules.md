---
name: workflow_evolve_rules
description: workflow_evolve_rules workflow
---

# Rule Evolution & Compacting Trajectory
This workflow implements our strict code knowledge adaptation policy without breaching system file constraints.

## Trajectory Sequence
1. Analyze the successful remediation logs to isolate the root programming failure.
2. Draft a highly specific constraint rule targeting the error class and place it in `.agents/rules/`.
3. **Summarize-and-Compact Evolution Strategy**: If a rule file already exists, edit the file in place using the summarize-and-compact rewrite strategy. Do not blindly append logs or debugging traces.
4. Keep all rule Markdown files strictly below the **12,000-character cap** to prevent silent platform truncation.
