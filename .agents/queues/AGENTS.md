---
type: policy
title: Task Queues & Priority Streams
description: Momentum queue definitions managed centrally in state.json
tags: [agents, queues, state]
---

## Task Queues & Priority Streams

The `.agents/queues/` directory logic is now deprecated and replaced by the centralized `state.json` file. All queues (NOW, NEXT, BLOCKED, IMPROVE, RECURRING) are stored in the `.agents/state.json` unified state tree under the `queues` array.

Tasks transition automatically based on dependency resolution and priority settings.

> [!IMPORTANT]
> Do NOT create individual markdown files in this directory. The runtime engine reads purely from `.agents/state.json`.
