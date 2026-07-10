---
type: report
title: Session learn close (latest)
description: Auto-written by scripts/session-learn.mjs at 2026-07-10T09:01:21.422Z
tags: [learning, session, agent-os]
---

# Session learn close

**Title:** session-learn close
**Started:** 2026-07-10T09:00:49.122Z
**Ended:** 2026-07-10T09:01:21.422Z
**OK:** true

## Learning status

```json
{
  "updated_at": "2026-07-10T09:00:50.759Z",
  "stats": {
    "total_records": 17,
    "unique_fingerprints": 6,
    "auto_heals": 1,
    "duplicates_suppressed": 3
  },
  "open": 1,
  "auto_healed": 0,
  "resolved": 5,
  "top": [
    {
      "id": "ERR-20260709-070a",
      "fingerprint": "947919b9a1cff393",
      "title": "PowerShell switch/quoting misuse",
      "category": "shell-powershell",
      "severity": "medium",
      "healable": false,
      "prevention": "On Windows, prefer `node scripts/...` over nested powershell -Command. Never assign values to switch parameters. Use .ps1 files for multi-statement scripts; escape $ as `$ inside double-quoted -Command strings.",
      "area": "tooling",
      "command": "powershell -Command",
      "snippet": "SwitchParameter CaseSensitive Unexpected token",
      "count": 1,
      "status": "resolved",
      "first_seen": "2026-07-09T19:17:05.966Z",
      "last_seen": "2026-07-09T19:17:05.966Z",
      "heal_attempts": 0,
      "healed_at": null,
      "seeded_from_legacy": true
    },
    {
      "id": "ERR-20260709-2e26",
      "fingerprint": "7eded1228610753c",
      "title": "next/dynamic ssr:false in Server Component",
      "category": "nextjs-render",
      "severity": "high",
      "healable": false,
      "prevention": "Never use next/dynamic with { ssr: false } inside Server Components. Import client leaves statically when browser work is already behind useEffect.",
      "area": "frontend",
      "command": "npm run build",
      "snippet": "ssr: false is not allowed with next/dynamic in Server Components",
      "count": 1,
      "status": "resolved",
      "first_seen": "2026-07-09T19:17:05.971Z",
      "last_seen": "2026-07-09T19:17:05.971Z",
      "heal_attempts": 0,
      "healed_at": null,
      "seeded_from_legacy": true
    },
    {
      "id": "ERR-20260710-28e9",
      "fingerprint": "72be20ed8866c7b5",
      "title": "WSL System32 bash wins over Git on Windows Machine PATH",
      "category": "general",
      "severity": "medium",
      "healable": false,
      "prevention": "ROOT CAUSE: bare bash was WSL System32 before Git. Fix: Admin scripts/fix-windows-bash-path.ps1 prepends Git\\bin to Machine PATH. Verify where bash + agentos:health bash.ok. Policy ROOT_CAUSE.md.",
      "area": "general",
      "command": "bash --version",
      "snippet": "The system cannot find the file specified when hooks call bash; where bash shows System32\\bash.exe first",
      "count": 1,
      "status": "resolved",
      "first_seen": "2026-07-10T08:37:58.194Z",
      "last_seen": "2026-07-10T09:00:50.693Z",
      "heal_attempts": 0,
      "healed_at": null,
      "archive": null,
      "resolved_at": "2026-07-10T09:00:50.693Z",
      "resolve_note": "session-learn known-fixed auto-resolve"
    },
    {
      "id": "ERR-20260710-87d7",
      "fingerprint": "cae6658adb6d1801",
      "title": "Semgrep Guardian PreToolUse blocks all edits when not logged in",
      "category": "general",
      "severity": "medium",
      "healable": false,
      "prevention": "Semgrep Guardian blocks Write/Edit when not logged in. Log into guardian MCP for real scans, or accept non-blocking policy with explicit product decision — do not leave unexplained permanent disable.",
      "area": "general",
      "command": "semgrep PreToolUse hook",
      "snippet": "Not logged into Semgrep Guardian decision block on Write/Edit",
      "count": 1,
      "status": "resolved",
      "first_seen": "2026-07-10T08:37:58.339Z",
      "last_seen": "2026-07-10T09:00:50.757Z",
      "heal_attempts": 0,
      "healed_at": null,
      "archive": null,
      "resolved_at": "2026-07-10T09:00:50.757Z",
      "resolve_note": "session-learn known-fixed auto-resolve"
    },
    {
      "id": "ERR-20260710-1770",
      "fingerprint": "5cede907b3467539",
      "title": "Stale process PATH after Machine PATH fix",
      "category": "general",
      "severity": "medium",
      "healable": false,
      "prevention": "After Machine PATH fix, fully restart IDE/agent shells. agentos:health uses registry PATH for bash.ok. Stale process PATH is expected until restart.",
      "area": "general",
      "command": "where bash",
      "snippet": "Registry has Git first but long-lived IDE/agent still resolves System32 bash until full restart",
      "count": 1,
      "status": "resolved",
      "first_seen": "2026-07-10T08:37:58.462Z",
      "last_seen": "2026-07-10T09:00:50.726Z",
      "heal_attempts": 0,
      "healed_at": null,
      "archive": null,
      "resolved_at": "2026-07-10T09:00:50.726Z",
      "resolve_note": "session-learn known-fixed auto-resolve"
    }
  ]
}
```

## Steps

- **agentos:health**: ok
- **manifest.failures**: ok
- **manifest.successes**: ok
- **manifest.resolve**: ok
- **resolve.known_fixed**: ok
- **domain:sync all**: ok
- **learning-loop compact**: ok
- **active-prevention rebuild**: ok
- **learning-loop status**: ok
- **learn-pipeline**: ok
- **learn:recommend**: ok
- **learn:evaluate:dry**: ok

## Automation

- `npm run learn:session:close` — full close
- Hooks: post-session when `SESSION_LEARN_AUTO=1`
- Policy: `.agents/governance/ROOT_CAUSE.md` · iron law 12

Full JSON: `.learnings/SESSION_CLOSE_2026-07-10T09-01-21-422Z.json`
