---
type: ledger
title: Active prevention context
description: Token-cheap inject for agents. Generated — do not hand-edit.
tags: [prevention, active, cold-start]
---

# Active prevention context

> Generated: 2026-07-13T18:00:16.497Z
> **This is not a log.** Agents must OBEY these lessons. Hooks may DENY tool calls that repeat them.

## Iron laws (always)

1. **Root cause only** — never soft-skip, `|| true`, or disable checks as the fix (`.agents/governance/ROOT_CAUSE.md`).
2. **Windows bash** — Git\bin before System32; fix: `npm run hooks:fix-bash-path`; verify `where bash`.
3. **PowerShell** — prefer `node scripts/...` or `.ps1`; no nested `powershell -Command` soup.
4. **Next.js** — never `next/dynamic` + `{ ssr: false }` in Server Components.
5. **Learn → enforce** — after a failure: record, then hard-guard if machine-detectable.

## Top lessons (obey)

| ID | Status | Lesson |
|----|--------|--------|
| ERR-20260710-87d7 | resolved | Semgrep Guardian blocks Write/Edit when not logged in. Log into guardian MCP for real scans, or accept non-blocking policy with explicit pr… |
| ERR-20260710-1770 | resolved | After Machine PATH fix, fully restart IDE/agent shells. agentos:health uses registry PATH for bash.ok. Stale process PATH is expected until… |
| ERR-20260710-28e9 | resolved | ROOT CAUSE: bare bash was WSL System32 before Git. Fix: Admin scripts/fix-windows-bash-path.ps1 prepends Git\bin to Machine PATH. Verify wh… |
| ERR-20260710-4c3b | open | Use npm run learn:prevent:test or JSON file + Get-Content -Raw; never rely on pwsh-escaped JSON pipes for prevention dry-runs |
| ERR-20260709-2e26 | resolved | Never use next/dynamic with { ssr: false } inside Server Components. Import client leaves statically when browser work is already behind us… |
| ERR-20260709-070a | resolved | On Windows, prefer `node scripts/...` over nested powershell -Command. Never assign values to switch parameters. Use .ps1 files for multi-s… |

## Hard-blocked patterns (PreToolUse — cannot soft-skip)

- `next/dynamic` + `ssr: false` in TS/JS → **deny**
- Nested / broken `powershell -Command` → **deny**
- System32-bash soft-skip “fixes” → **deny**
- Emoji in `src/**` product source → **deny**
- Read/write `GRAPH_REPORT.md` or bulk `graphify-out/wiki` → **deny**
- Recreate purged `.agents` bloat (plan/status/dashboard/…) → **deny**
- `|| true` / soft-skip as the “fix” in hooks → **deny**
- Disable prevention without break-glass → **deny**

## Commands

```bash
npm run learn:prevent          # print inject text
npm run learn:prevent:rebuild  # refresh this file
npm run ship:improve           # purge + health + eval loop
node scripts/active-prevention.mjs check < payload.json
```
