---
type: policy
title: Root cause only — never treat symptoms
description: Mandatory debugging/fix policy for all agents. Symptom workarounds are not done.
tags: [governance, root-cause, agents, prevention]
date: 2026-07-10
version: 1.0.0
---

# Root cause only — never treat symptoms

**Status:** Mandatory for every agent (Cursor, Claude Code, Grok, Codex, CI repair).

## Law

When something fails, **fix the underlying cause**. Do **not** ship, merge, or codify a workaround that only hides the failure while the broken condition remains.

| Allowed | Forbidden (symptom treatment) |
|---------|-------------------------------|
| Fix PATH so `bash` is real Git Bash | Soft-`exit 0` wrappers that skip when bash is wrong |
| Fix auth/config so a tool works | Disable the check permanently without fixing login |
| Fix the bug in source | Catch-all `|| true` that swallows real errors |
| Add a regression test for the root cause | Document “just use the full path forever” as the only fix |
| Temporary mitigation **plus** a tracked root-cause issue | Mitigation alone marked “done” |

## Protocol (required)

1. **Reproduce** with the exact command/environment that fails.  
2. **Name the root cause** in one sentence (mechanism, not vibes).  
3. **Fix that mechanism** (config, PATH, code, dependency, permissions).  
4. **Verify** the original failing command succeeds **without** the workaround.  
5. **Codify** prevention (test, health check, governance rule, domain learning).  
6. Optional defense-in-depth only **after** root fix is verified — never instead of it.

## Root cause statement template

```text
ROOT CAUSE: <component> <does X> because <mechanism>.
FIX: <change that removes the mechanism>.
VERIFY: <exact command that previously failed now succeeds>.
```

### Example (this repo — bash hooks)

```text
ROOT CAUSE: bare `bash` resolved to C:\Windows\System32\bash.exe (WSL launcher
with no distro) because Machine PATH listed System32 before Git\bin.
FIX: Prepend C:\Program Files\Git\bin to Machine PATH (and User PATH hygiene).
VERIFY: `where bash` → Git\bin\bash.exe; `bash --version` prints GNU bash.
```

Symptom patches (plugin soft-fail wrappers) are **not** the fix; at most secondary after PATH is correct.

## Anti-patterns (ban)

- `|| true` / always-exit-0 on hooks that should enforce policy  
- “Skip if missing” when the tool **is** installed but mis-resolved  
- Pinning absolute paths in every script instead of fixing PATH/toolchain  
- Disabling a plugin/linter/test to “make CI green” without a replacement gate  
- Claiming done when only a local shell works but agent/CI shells still fail  

## When mitigation is temporarily required

1. Open a **Linear** issue (Reliability) with label `blocked-external` or `human-only` if needed.  
2. Title must include `ROOT CAUSE PENDING`.  
3. Mitigation must link that issue.  
4. Do not close the issue until **VERIFY** passes without the mitigation (or mitigation is removed).

## Where this lives

| Artifact | Role |
|----------|------|
| This file | Full policy |
| `.agents/AGENTS.md` iron law | Always-on kernel pointer |
| `npm run agentos:health` | Surfaces broken toolchain (e.g. wrong bash) |
| Domain learnings | Record real incidents under the failing domain |

## Agent self-check before “fixed”

- [ ] I can state the root cause in one sentence  
- [ ] The original failure command works without my workaround  
- [ ] I did not only add try/catch, skip flags, or soft exits  
- [ ] Prevention is written (test/health/rule/learning)  
