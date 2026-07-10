---
id: mandatory_error_learning
name: "Governance Policy: Mandatory Error Learning Protocol"
type: policy
description: "Self-healing learning loop — detect, classify, dedupe, prevent, heal, verify."
tags: [governance, debugging, self-healing, learning-loop]
references: [architectural_decisions]
---

# Governance Policy: Mandatory Error Learning Protocol

**Status**: Active  
**Domain**: Operational Control & System Integrity

## Closed loop

```text
DETECT → CLASSIFY → DEDUPE → STORE → PREVENT → HEAL → VERIFY → IMPROVE
```

Implemented by `scripts/learning-loop.mjs` and wired into:

- `scripts/compile.js`
- `scripts/agent-os.js` (task failure path)
- `scripts/auto-learn.js` / `scripts/codify-failure.mjs`

## Protocol Rule

When any terminal command, compilation runner, test, or filesystem tool fails (non-zero exit or exception):

1. **Stop** product work for that step.
2. **Record** via the learning loop (never hand-append megabyte dumps to `ERRORS.md`):
   ```bash
   node scripts/learning-loop.mjs record --title "Short title" --error "stderr snippet" --command "exact command"
   ```
3. **Heal** if the category is healable (`okf-wiki`, `harness-checkpoint`):
   ```bash
   node scripts/learning-loop.mjs heal
   ```
4. **Retry once**. If still failing, escalate (dead-letter / human) — do not infinite-loop.
5. **Read** only `.learnings/ERRORS_INDEX.md` at session start (not full history).

## What changed vs the old protocol

| Old (broken) | New |
|--------------|-----|
| Append full stderr every time | Fingerprint + dedupe; count++ only |
| Agents re-read 1MB+ ERRORS.md | Agents read ERRORS_INDEX.md (~few KB) |
| OKF wiki stubs re-logged forever | Auto-heal tags + validator exemption |
| Stub auto-learn rules | Category prevention rules in PREVENTION_RULES.md |
| knowledge.md pasted entire ERRORS | knowledge.md holds snapshot stats only |

## Rationale

Without dedupe, "self-healing" becomes self-poisoning: the same OKF/wiki failure filled megabytes of logs and burned context windows. Deterministic memory only works when each **root cause** is stored once and prevention is retrieved cheaply.

## Files

| Path | Role |
|------|------|
| `.learnings/index.json` | Machine state (fingerprints, counts, status) |
| `.learnings/ERRORS_INDEX.md` | Agent cold-start |
| `.learnings/ERRORS.md` | Slim active ledger (capped) |
| `.learnings/archive/` | Bounded full dumps + legacy compact |
| `.agents/governance/PREVENTION_RULES.md` | Deduped prevention rules |

## Severity / healability

- **Healable auto**: `okf-wiki`, `harness-checkpoint`
- **Human / code fix**: `typescript`, `nextjs-render`, `syntax`, `shell-powershell`, `general`
