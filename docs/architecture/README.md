---
type: documentation
title: Architecture loop runs
description: Durable records of RVPLP+ architecture decisions. Scaffold with npm run arch:loop.
tags: [architecture, loop]
---

# Architecture loop runs

**Workflow:** [`.agents/workflows/architecture-loop.md`](../../.agents/workflows/architecture-loop.md)  
**Skill:** `architecture-loop`  
**Scaffold:**

```bash
npm run arch:loop -- init --slug my-decision --title "Short decision title"
npm run arch:loop -- list
```

Each run is a dated markdown file filled through phases **0 FRAME → 8 CLOSE**.

## First instance (pre-scaffold)

| Decision | Record |
|----------|--------|
| Payload CMS topology (2026-07-09) | [`../ARCHITECTURE_CMS_LOOP.md`](../ARCHITECTURE_CMS_LOOP.md) + plan/handoff/STACK v2 |

After that, prefer files in this directory: `YYYY-MM-DD-<slug>.md`.
