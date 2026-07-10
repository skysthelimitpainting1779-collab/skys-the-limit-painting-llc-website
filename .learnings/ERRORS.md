---
type: ledger
title: Error Learning Log (active)
description: Compact active failures.
tags: [errors, learning, self-heal]
---

# Errors Log (Active)

> Agents: read .learnings/ERRORS_INDEX.md first.


## [ERR-20260709-b484] OKF validator failed on auto-compiled wiki stubs

**Category**: okf-wiki | **Status**: auto-healed | **Count**: 1

### Prevention
Auto-compiled wiki pages under .agents/wiki are exempt from semantic OKF checks. Only hand-authored docs need type/title/timestamp and a real Synthesis section. Prefer tags: [graphify, auto-compiled] + last_sync.

## [ERR-20260709-070a] PowerShell switch/quoting misuse

**Category**: shell-powershell | **Status**: resolved | **Count**: 1

### Prevention
On Windows, prefer `node scripts/...` over nested powershell -Command. Never assign values to switch parameters. Use .ps1 files for multi-statement scripts; escape $ as `$ inside double-quoted -Command strings.

## [ERR-20260709-2e26] next/dynamic ssr:false in Server Component

**Category**: nextjs-render | **Status**: resolved | **Count**: 1

### Prevention
Never use next/dynamic with { ssr: false } inside Server Components. Import client leaves statically when browser work is already behind useEffect.

## [ERR-20260709-a408] Synthetic failure dedupe-test-1783624769367

**Logged**: 2026-07-09T19:19:29.444Z
**Fingerprint**: `b97a68b78fddb696`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: test
**Count**: 1

### Summary
Synthetic failure dedupe-test-1783624769367 — `node -e "process.exit(1)"`

### Error (snippet)
```text
unique-marker-dedupe-test-1783624769367 boom
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: .learnings/archive/ERR-20260709-a408-b97a68b78fddb696.txt
- Healable: false


## [ERR-20260709-2f10] Synthetic failure dedupe-test-1783625186720

**Logged**: 2026-07-09T19:26:26.862Z
**Fingerprint**: `2fc1edb424a9ec69`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: test
**Count**: 1

### Summary
Synthetic failure dedupe-test-1783625186720 — `node -e "process.exit(1)"`

### Error (snippet)
```text
unique-marker-dedupe-test-1783625186720 boom
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: .learnings/archive/ERR-20260709-2f10-2fc1edb424a9ec69.txt
- Healable: false


## [ERR-20260709-d1ae] Synthetic failure dedupe-test-1783625211996

**Logged**: 2026-07-09T19:26:52.080Z
**Fingerprint**: `c3cfad1c0e006754`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: test
**Count**: 1

### Summary
Synthetic failure dedupe-test-1783625211996 — `node -e "process.exit(1)"`

### Error (snippet)
```text
unique-marker-dedupe-test-1783625211996 boom
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: .learnings/archive/ERR-20260709-d1ae-c3cfad1c0e006754.txt
- Healable: false


## [ERR-20260709-ac3c] [entire] fix(seo): resolve GSC redirect error, robots.txt syntax, and Lighthouse color contrast violations

**Logged**: 2026-07-09T19:44:11.530Z
**Fingerprint**: `f7a05ea562b04da4`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: entire
**Count**: 1

### Summary
[entire] fix(seo): resolve GSC redirect error, robots.txt syntax, and Lighthouse color contrast violations — `entire-to-agentos`

### Error (snippet)
```text
Commit 67ae9e0 (2026-07-08T11:15:57-07:00): fix(seo): resolve GSC redirect error, robots.txt syntax, and Lighthouse color contrast violations
SHA: 67ae9e084fa5556975fc3206ae5a5b0b9e7a4adc
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: .learnings/archive/ERR-20260709-ac3c-f7a05ea562b04da4.txt
- Healable: false


## [ERR-20260709-6a02] [entire] infra: fix CI/CD pipeline, HubSpot mock sync, and md-linter ignores

**Logged**: 2026-07-09T19:44:11.572Z
**Fingerprint**: `15b68b71113b80bd`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: entire
**Count**: 1

### Summary
[entire] infra: fix CI/CD pipeline, HubSpot mock sync, and md-linter ignores — `entire-to-agentos`

### Error (snippet)
```text
Commit d352247 (2026-07-07T20:51:37-07:00): infra: fix CI/CD pipeline, HubSpot mock sync, and md-linter ignores
SHA: d352247676c83d63bcae93f39fcfd4820a08b93d
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: .learnings/archive/ERR-20260709-6a02-15b68b71113b80bd.txt
- Healable: false


## [ERR-20260709-c410] [entire] infra: fix remaining node-version strings and husky deprecation warnings

**Logged**: 2026-07-09T19:44:11.620Z
**Fingerprint**: `303aac89388b21b6`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: entire
**Count**: 1

### Summary
[entire] infra: fix remaining node-version strings and husky deprecation warnings — `entire-to-agentos`

### Error (snippet)
```text
Commit b4c7d0f (2026-07-06T06:58:59-07:00): infra: fix remaining node-version strings and husky deprecation warnings
SHA: b4c7d0f9df9b79b29bdacc938444bf7e7cb08be9
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: .learnings/archive/ERR-20260709-c410-303aac89388b21b6.txt
- Healable: false


## [ERR-20260709-daf2] [entire] infra: complete end-to-end CI/CD and security scan fixes

**Logged**: 2026-07-09T19:44:11.662Z
**Fingerprint**: `9cdca29083618287`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: entire
**Count**: 1

### Summary
[entire] infra: complete end-to-end CI/CD and security scan fixes — `entire-to-agentos`

### Error (snippet)
```text
Commit 5e78170 (2026-07-06T06:56:42-07:00): infra: complete end-to-end CI/CD and security scan fixes
SHA: 5e781702b9e65e8ed9871ae1a6dd2d5b44837c0c
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: .learnings/archive/ERR-20260709-daf2-9cdca29083618287.txt
- Healable: false


## [ERR-20260710-28e9] WSL System32 bash wins over Git on Windows Machine PATH

**Logged**: 2026-07-10T08:37:58.194Z
**Fingerprint**: `72be20ed8866c7b5`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: general
**Count**: 1

### Summary
WSL System32 bash wins over Git on Windows Machine PATH — `bash --version`

### Error (snippet)
```text
The system cannot find the file specified when hooks call bash; where bash shows System32\bash.exe first
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: n/a
- Healable: false


## [ERR-20260710-87d7] Semgrep Guardian PreToolUse blocks all edits when not logged in

**Logged**: 2026-07-10T08:37:58.339Z
**Fingerprint**: `cae6658adb6d1801`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: general
**Count**: 1

### Summary
Semgrep Guardian PreToolUse blocks all edits when not logged in — `semgrep PreToolUse hook`

### Error (snippet)
```text
Not logged into Semgrep Guardian decision block on Write/Edit
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: n/a
- Healable: false


## [ERR-20260710-1770] Stale process PATH after Machine PATH fix

**Logged**: 2026-07-10T08:37:58.462Z
**Fingerprint**: `5cede907b3467539`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: general
**Count**: 1

### Summary
Stale process PATH after Machine PATH fix — `where bash`

### Error (snippet)
```text
Registry has Git first but long-lived IDE/agent still resolves System32 bash until full restart
```

### Prevention
Reproduce with the exact command, fix root cause, add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: n/a
- Healable: false


## [ERR-20260710-pwsh] PowerShell mangles JSON stdin for active-prevention check

**Logged**: 2026-07-10T08:55:00.000Z
**Category**: shell-powershell
**Severity**: low
**Status**: open
**Area**: tooling
**Count**: 1

### Summary
PowerShell command-line / echo piping corrupts JSON tool payloads so `active-prevention.mjs check` reports decision:null for known-deny patterns.

### Error (snippet)
```text
echo '{"tool_name":"Write",...ssr: false...}' | node scripts/active-prevention.mjs check
→ {"ok":true,"decision":null}
while self-test and node unit tests correctly deny
```

### Prevention
On Windows do not dry-run active-prevention with pwsh-escaped JSON on the CLI. Use `npm run learn:prevent:test`, `tsx --test tests/active-prevention.test.mjs`, or write a UTF-8 JSON file and `Get-Content -Raw file | node scripts/active-prevention.mjs check`. Prefer `node scripts/...` over nested powershell -Command.

### Metadata
- Related: ERR-20260709-070a
- Healable: false

## [ERR-20260710-ledger] ERRORS.md status lag vs ERRORS_INDEX after resolve

**Logged**: 2026-07-10T08:55:00.000Z
**Category**: general
**Severity**: low
**Status**: open
**Area**: agent-os
**Count**: 1

### Summary
After session-learn auto-resolve, ERRORS_INDEX shows resolved but full ERRORS.md body may still list Status: open (e.g. ERR-20260710-1770).

### Prevention
Treat `.learnings/index.json` + `ERRORS_INDEX.md` as SSOT. After resolve/close, run `node scripts/learning-loop.mjs compact` and verify ERRORS.md headers match, or fix rebuildMarkdownViews to rewrite status fields.

### Metadata
- Healable: true (compact/view rebuild)


## [ERR-20260710-4c3b] PowerShell mangles JSON stdin for active-prevention check

**Logged**: 2026-07-10T08:55:59.391Z
**Fingerprint**: `d7552e5d3eb7fc7a`
**Category**: shell-powershell
**Severity**: medium
**Status**: open
**Area**: general
**Count**: 1

### Summary
PowerShell mangles JSON stdin for active-prevention check — `powershell echo | node scripts/active-prevention.mjs check`

### Error (snippet)
```text
pwsh echo pipe returns decision:null for ssr:false deny payload; self-test correctly denies
```

### Prevention
Use npm run learn:prevent:test or JSON file + Get-Content -Raw; never rely on pwsh-escaped JSON pipes for prevention dry-runs

### Metadata
- Archive: n/a
- Healable: false


## [ERR-20260710-e4d2] Synthetic failure dedupe-test-1783674404787

**Logged**: 2026-07-10T09:06:44.885Z
**Fingerprint**: `183c2df9ba23e3cd`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: test
**Count**: 1

### Summary
Synthetic failure dedupe-test-1783674404787 — `node -e "process.exit(1)"`

### Error (snippet)
```text
unique-marker-dedupe-test-1783674404787 boom
```

### Prevention
Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: n/a
- Healable: false


## [ERR-20260710-834e] Synthetic failure dedupe-test-1783674420360

**Logged**: 2026-07-10T09:07:00.480Z
**Fingerprint**: `ee732fbaa3fc1826`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: test
**Count**: 1

### Summary
Synthetic failure dedupe-test-1783674420360 — `node -e "process.exit(1)"`

### Error (snippet)
```text
unique-marker-dedupe-test-1783674420360 boom
```

### Prevention
Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: n/a
- Healable: false


## [ERR-20260710-4bfd] Synthetic failure dedupe-test-1783674427016

**Logged**: 2026-07-10T09:07:07.128Z
**Fingerprint**: `a8f5dffeb954c32e`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: test
**Count**: 1

### Summary
Synthetic failure dedupe-test-1783674427016 — `node -e "process.exit(1)"`

### Error (snippet)
```text
unique-marker-dedupe-test-1783674427016 boom
```

### Prevention
Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: n/a
- Healable: false


## [ERR-20260710-9a60] Synthetic failure dedupe-test-1783674519332

**Logged**: 2026-07-10T09:08:39.583Z
**Fingerprint**: `a0aee5a62cf4eae6`
**Category**: general
**Severity**: medium
**Status**: open
**Area**: test
**Count**: 1

### Summary
Synthetic failure dedupe-test-1783674519332 — `node -e "process.exit(1)"`

### Error (snippet)
```text
unique-marker-dedupe-test-1783674519332 boom
```

### Prevention
Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.

### Metadata
- Archive: n/a
- Healable: false

