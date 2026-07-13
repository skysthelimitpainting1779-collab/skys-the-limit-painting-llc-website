---
type: report
title: Session learn close (latest)
description: Auto-written by scripts/session-learn.mjs at 2026-07-10T09:10:57.449Z
tags: [learning, session, agent-os]
---

# Session learn close

**Title:** session-learn close
**Started:** 2026-07-10T09:10:23.476Z
**Ended:** 2026-07-10T09:10:57.449Z
**OK:** true

## Learning status

```json
{
  "updated_at": "2026-07-10T09:10:25.217Z",
  "stats": {
    "total_records": 25,
    "unique_fingerprints": 10,
    "auto_heals": 1,
    "duplicates_suppressed": 7
  },
  "open": 5,
  "auto_healed": 0,
  "resolved": 5,
  "top": [
    {
      "id": "ERR-20260710-e4d2",
      "fingerprint": "183c2df9ba23e3cd",
      "title": "Synthetic failure dedupe-test-1783674404787",
      "category": "general",
      "severity": "medium",
      "healable": false,
      "prevention": "Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.",
      "area": "test",
      "command": "node -e \"process.exit(1)\"",
      "snippet": "unique-marker-dedupe-test-1783674404787 boom",
      "count": 2,
      "status": "open",
      "first_seen": "2026-07-10T09:06:44.885Z",
      "last_seen": "2026-07-10T09:06:45.036Z",
      "heal_attempts": 0,
      "healed_at": null,
      "archive": null,
      "last_title": "Synthetic failure dedupe-test-1783674404787"
    },
    {
      "id": "ERR-20260710-834e",
      "fingerprint": "ee732fbaa3fc1826",
      "title": "Synthetic failure dedupe-test-1783674420360",
      "category": "general",
      "severity": "medium",
      "healable": false,
      "prevention": "Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.",
      "area": "test",
      "command": "node -e \"process.exit(1)\"",
      "snippet": "unique-marker-dedupe-test-1783674420360 boom",
      "count": 2,
      "status": "open",
      "first_seen": "2026-07-10T09:07:00.480Z",
      "last_seen": "2026-07-10T09:07:00.592Z",
      "heal_attempts": 0,
      "healed_at": null,
      "archive": null,
      "last_title": "Synthetic failure dedupe-test-1783674420360"
    },
    {
      "id": "ERR-20260710-4bfd",
      "fingerprint": "a8f5dffeb954c32e",
      "title": "Synthetic failure dedupe-test-1783674427016",
      "category": "general",
      "severity": "medium",
      "healable": false,
      "prevention": "Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.",
      "area": "test",
      "command": "node -e \"process.exit(1)\"",
      "snippet": "unique-marker-dedupe-test-1783674427016 boom",
      "count": 2,
      "status": "open",
      "first_seen": "2026-07-10T09:07:07.128Z",
      "last_seen": "2026-07-10T09:07:07.298Z",
      "heal_attempts": 0,
      "healed_at": null,
      "archive": null,
      "last_title": "Synthetic failure dedupe-test-1783674427016"
    },
    {
      "id": "ERR-20260710-9a60",
      "fingerprint": "a0aee5a62cf4eae6",
      "title": "Synthetic failure dedupe-test-1783674519332",
      "category": "general",
      "severity": "medium",
      "healable": false,
      "prevention": "Reproduce with the exact command, fix root cause (see .agents/governance/ROOT_CAUSE.md), add a regression test when durable, then re-run verify chain.",
      "area": "test",
      "command": "node -e \"process.exit(1)\"",
      "snippet": "unique-marker-dedupe-test-1783674519332 boom",
      "count": 2,
      "status": "open",
      "first_seen": "2026-07-10T09:08:39.583Z",
      "last_seen": "2026-07-10T09:08:40.015Z",
      "heal_attempts": 0,
      "healed_at": null,
      "archive": null,
      "last_title": "Synthetic failure dedupe-test-1783674519332"
    },
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

## Automation

- `npm run learn:session:close` — full close
- Hooks: post-session when `SESSION_LEARN_AUTO=1`
- Policy: `.agents/governance/ROOT_CAUSE.md` · iron law 12

Full JSON: `.learnings/SESSION_CLOSE_2026-07-10T09-10-57-449Z.json`
