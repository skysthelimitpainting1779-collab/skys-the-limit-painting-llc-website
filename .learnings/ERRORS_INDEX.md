---
type: ledger
title: Error Learning Index
description: Token-cheap cold-start for agents. Full dumps in archive/; state in index.json.
tags: [errors, learning, index, self-heal]
---

# Error Learning Index

> **Agent cold-start:** read THIS file only (not full `ERRORS.md`).
> Updated: 2026-07-10T09:08:40.017Z | Unique: 10 | Records: 25 | Dupes suppressed: 7 | Auto-heals: 1

## Open / needs attention

- **ERR-20260710-9a60** [general/medium] Synthetic failure dedupe-test-1783674519332 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260710-4bfd** [general/medium] Synthetic failure dedupe-test-1783674427016 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260710-834e** [general/medium] Synthetic failure dedupe-test-1783674420360 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260710-e4d2** [general/medium] Synthetic failure dedupe-test-1783674404787 (2x) — Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run ver
- **ERR-20260710-4c3b** [shell-powershell/medium] PowerShell mangles JSON stdin for active-prevention check (1x) — Use npm run learn:prevent:test or JSON file + Get-Content -Raw; never rely on pwsh-escaped JSON pipes for prevention dry-runs

## Top lessons (deduped)

| ID | Cat | Status | × | Lesson |
|----|-----|--------|---|--------|
| ERR-20260710-9a60 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-4bfd | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-834e | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-e4d2 | general | open | 2 | Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regre |
| ERR-20260710-87d7 | general | resolved | 1 | Semgrep Guardian blocks Write/Edit when not logged in. Log into guardian MCP for real scans, or acce |
| ERR-20260710-1770 | general | resolved | 1 | After Machine PATH fix, fully restart IDE/agent shells. agentos:health uses registry PATH for bash.o |
| ERR-20260710-28e9 | general | resolved | 1 | ROOT CAUSE: bare bash was WSL System32 before Git. Fix: Admin scripts/fix-windows-bash-path.ps1 prep |
| ERR-20260710-4c3b | shell-powershell | open | 1 | Use npm run learn:prevent:test or JSON file + Get-Content -Raw; never rely on pwsh-escaped JSON pipe |
| ERR-20260709-2e26 | nextjs-render | resolved | 1 | Never use next/dynamic with { ssr: false } inside Server Components. Import client leaves statically |
| ERR-20260709-070a | shell-powershell | resolved | 1 | On Windows, prefer `node scripts/...` over nested powershell -Command. Never assign values to switch |

## Loop commands

```bash
node scripts/learning-loop.mjs status
node scripts/learning-loop.mjs heal
node scripts/learning-loop.mjs compact
node scripts/learning-loop.mjs record --title "..." --error "..." --command "..."
```

## Read order for agents

1. `.learnings/ERRORS_INDEX.md` (this file)
2. `.agents/governance/PREVENTION_RULES.md` (if relevant category)
3. `.learnings/index.json` for machine counters (optional)
