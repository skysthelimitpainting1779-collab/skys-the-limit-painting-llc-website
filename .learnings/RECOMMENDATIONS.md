---
type: ledger
title: Learning Recommendations (from Turso)
description: Cold-start guidance produced by learn-pipeline for agents.
tags: [learning, turso, recommendations]
---

# Learning recommendations

> Updated: 2026-07-10T09:01:19.052Z

## Top lessons (need attention)

| Score | Category | Title | Prevention |
|------:|----------|-------|------------|
| 1.1 | domain:api | [api] Lead email validation | Domain api: fix in jurisdiction; see .agents/domains/api/learnings/ |
| 1.1 | shell-powershell | PowerShell mangles JSON stdin for active-prevention check | Use npm run learn:prevent:test or JSON file + Get-Content -Raw; never rely on pw |
