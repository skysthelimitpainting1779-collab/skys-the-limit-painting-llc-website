---
type: policy
title: Checkpoint Governance
description: Rules for maintaining checkpoints
tags: [agents, state, checkpoints]
---

## Checkpoints Governance

- Always generate a JSON checkpoint before and after executing a task phase.
- Format: `CHK-<TASK>-<TIMESTAMP>-<PHASE>.json`
- Include task, phase, timestamp, and status.
