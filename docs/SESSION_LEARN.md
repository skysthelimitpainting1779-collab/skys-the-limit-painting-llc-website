---
type: documentation
title: Session learn automation
description: How skysthelimit automatically evaluates and learns from agent sessions.
tags: [learning, agent-os, automation, hooks, turso]
date: 2026-07-10
---

# Session learn automation

## Honest goal

Every agent session must **record → resolve → sync → evaluate** so institutional memory is not “maybe later.”

Aligned with continual-learning practice (act → record → reflect → store → evaluate; avoid silent “soft success” without evidence).

## Commands

```bash
# Full close (local agent sessions)
npm run learn:session:close

# With manifest of successes / failures / resolve IDs
npm run learn:session:close -- --manifest .learnings/session-manifest-latest.json --title "my session"

# Resolve a fixed incident with real prevention text
npm run learn:resolve -- --id ERR-YYYYMMDD-xxxx --prevention "ROOT CAUSE: … FIX: … VERIFY: …"

# Status
npm run learn:status
npm run agentos:health
```

## What `--close` does

1. `agentos:health` snapshot  
2. Ingest optional **manifest** (successes → domain:success, failures → learning-loop record, resolve IDs)  
3. Auto-resolve **known-fixed** session themes (bash PATH, stale PATH, semgrep login) when IDs exist  
4. `domain:sync all` → **Turso**  
5. learning-loop compact + status  
6. learn-pipeline (session episode) + recommend  
7. skill evaluate dry-run (optional skip)  
8. Write `.learnings/SESSION_CLOSE.md` + timestamped JSON  

## Automation going forward

| Trigger | Behavior |
|---------|----------|
| **Claude Stop** | `node scripts/hooks/run.mjs session-learn` (debounced 5m) |
| **Claude SessionEnd** | `post-session` (Entire sync) + existing end hooks |
| **CI** | `.github/workflows/learn-pipeline.yml` after CI + domain sync + session-learn close |
| **Manual** | `npm run learn:session:close` (required after long sessions if hooks skipped) |

Disable auto: `SESSION_LEARN_AUTO=0` or `SESSION_LEARN_SKIP=1`.

## Manifest (agents should write before close)

`.learnings/session-manifest-latest.json`:

```json
{
  "title": "short session name",
  "successes": [{ "domain": "agent-os", "title": "...", "detail": "..." }],
  "failures": [{ "title": "...", "error": "...", "command": "...", "prevention": "..." }],
  "resolve": [{ "id": "ERR-...", "prevention": "ROOT CAUSE: … FIX: … VERIFY: …" }]
}
```

## Active prevention (not log-only)

Recording a failure is **not enough**. Agents must **not re-fail** the same class of error.

| Layer | What happens |
|-------|----------------|
| **Inject** | `SessionStart` + `UserPromptSubmit` push `.learnings/ACTIVE_CONTEXT.md` into model context via hooks |
| **Block** | `PreToolUse` returns `permissionDecision: deny` for known-bad patterns (see below) |
| **Rebuild** | `session-learn --close` and `session-start` refresh `ACTIVE_CONTEXT.md` from `.learnings/index.json` |
| **Extend** | Machine-detectable new failures → add a guard in `scripts/active-prevention.mjs` |

```bash
npm run learn:prevent           # print inject text
npm run learn:prevent:rebuild   # rewrite ACTIVE_CONTEXT.md
npm run learn:prevent:test      # hard-guard self-test
```

**Hard-blocked today:**

- `next/dynamic` + `{ ssr: false }` in TS/JS edits (ERR-20260709-2e26)
- Nested / broken `powershell -Command` (ERR-20260709-070a)
- System32-bash soft-skip “fixes” without PATH root cause (ERR-20260710-28e9 + ROOT_CAUSE)

Env: `ACTIVE_PREVENTION_SKIP=1` (off), `ACTIVE_PREVENTION_SOFT=1` (advise only, no deny).

## Policy

- **Root cause only** — `.agents/governance/ROOT_CAUSE.md` · iron law 12  
- **Active prevention** — iron law 14 · `scripts/active-prevention.mjs`  
- Do not mark done without `SESSION_CLOSE.md` evidence after multi-hour sessions  
- Convo-audit skill for human handoffs: `.agents/skills/convo-audit/`  

## Related

- `scripts/session-learn.mjs`  
- `scripts/active-prevention.mjs`  
- `scripts/learning-loop.mjs` (`record` / `resolve` / `status`)  
- `scripts/learn-pipeline.mjs` (CI + Turso)  
- `docs/AGENT_OS.md`  
