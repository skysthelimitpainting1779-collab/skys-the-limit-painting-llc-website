---
type: policy
title: Dead Letter Governance
description: Rules for quarantine and failures
tags: [agents, failures, quarantine]
---

## Dead Letter Governance

- If a tool or process fails irrecoverably, halt execution.
- Create an error trace in this directory.
- Update `.learnings/ERRORS.md` with the root cause.
