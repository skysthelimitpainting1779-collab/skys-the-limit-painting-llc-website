---
type: policy
title: agent-os prevention rules
domain: agent-os
---

# Prevention (agent-os)

## ROOT CAUSE only (2026-07-10)

- **Never treat symptoms.** Soft-exit hooks, `|| true`, or hardcoding absolute paths while `bash` still resolves to WSL System32 is **not** a fix.
- **Policy:** `.agents/governance/ROOT_CAUSE.md` · kernel iron law **12**.
- **Bash hooks (semgrep/remember):**
  - **Root cause:** Machine PATH listed `C:\Windows\System32` before `C:\Program Files\Git\bin`, so bare `bash` was the WSL launcher (no distro).
  - **Fix:** `scripts/fix-windows-bash-path.ps1` (Admin) prepends Git\bin to Machine PATH.
  - **Verify:** `where bash` first line is `...\Git\bin\bash.exe` and `bash --version` shows GNU bash.
  - **Health:** `npm run agentos:health` → `bash.ok`.

## Session 2026-07-10 — additional codified lessons

### Stale IDE/agent PATH after Machine PATH fix
- **When**: Registry has Git\bin first but long-lived process still has System32 bash first.
- **Rule**: After any Machine PATH change, **fully quit and relaunch** Claude/Grok/terminals. Verify with a **new** process loading registry PATH, not only the agent shell that applied the fix. `agentos:health` uses registry PATH for `bash.ok`.

### Semgrep Guardian not logged in
- **When**: PreToolUse returns decision block "Not logged into Semgrep Guardian".
- **Rule**: Root options: (1) log into guardian MCP for real scans, or (2) accept soft-allow only as temporary with a tracked issue if blocking is undesired. Do not leave unexplained permanent disable of SAST without product decision.

### Project hooks on Windows must not use bare `sh` / `python3`
- **When**: `.claude/settings.json` uses `sh -c` or `python3 -c` one-liners.
- **Rule**: Use `node scripts/hooks/*.mjs` only (e.g. `entire-if-present.mjs`, `graphify-pre-bash.mjs`). Bare `sh` fails when PATH is Windows-native.

## General

Updated when domain learnings are recorded.
