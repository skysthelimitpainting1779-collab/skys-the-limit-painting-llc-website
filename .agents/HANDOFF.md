---
type: protocol
title: Universal Agent Handoff Protocol (UAHP)
description: The canonical baton-pass standard ensuring any agent runtime can resume exactly where the last agent left off.
tags: [handoff, protocol, resume, agent-agnostic, onboarding]
version: "2.0"
---

# Universal Agent Handoff Protocol (UAHP)

> **The Golden Rule**: Any agent that enters this repo must be able to reconstruct full working context in under 5 minutes of reading. Any agent that exits must leave the next agent able to do the same. If either side fails, the handoff fails.

This protocol applies to **all runtime types** equally:
- 🖥️ **IDE agents** — Antigravity, Cursor, Windsurf, GitHub Copilot, Codeium
- ☁️ **Cloud agents** — Devin, Claude.ai Projects, ChatGPT Projects, Gemini Advanced
- ⌨️ **CLI agents** — Claude Code, Codex CLI, Aider, Continue, Amp
- 🔧 **SDK agents** — Vercel AI SDK, LangChain, LangGraph, CrewAI, Google GenKit
- ⚙️ **Harness agents** — `scripts/agent-os.js`, `scripts/harness-custodian.js`, CI/CD bots

---

## 1. The Baton Files (Read These First, In Order)

When entering this repo, any agent reads **exactly these files in this order**. Nothing else until done.

| Order | File | Purpose | Max Read Time |
|-------|------|---------|--------------|
| 1 | `.agents/handoffs/CURRENT.md` | What was just being done. Where we are. What's next. | 2 min |
| 2 | `.agents/state.json` → `meta`, `goals`, `tasks[0..3]` | Machine-readable current goal + top tasks only | 1 min |
| 3 | `.agents/AGENTS.md` | Operating rules and compliance | 1 min |
| 4 | `.agents/rules.md` → lines 1–100 | Principal architect doctrine (first section only) | 30 sec |
| 5 | `.agents/adapters/<your-runtime-type>.md` | What YOUR runtime can actually do | 30 sec |

**Stop after step 5.** Open source files only as needed for the specific task. Do not read the entire codebase.

---

## 2. CURRENT.md — The Living Baton

`.agents/handoffs/CURRENT.md` is the **single file that changes on every session transition**. It is a symlink-equivalent — always points to the most recent handoff state.

### Rules for CURRENT.md

**Outgoing agent MUST update CURRENT.md before ending the session.** Failing to do this is a protocol violation. No exceptions.

**Format** (copy this exactly):

```markdown
---
type: handoff
title: "Session Handoff — {DATE}"
outgoing_agent: "{RUNTIME_TYPE}/{MODEL_NAME}"
outgoing_session: "{SESSION_ID_OR_CONVERSATION_ID}"
timestamp: "{ISO_8601_TIMESTAMP}"
status: "{COMPLETE | PARTIAL | BLOCKED}"
tags: [handoff, {runtime-type}]
---

# Baton Pass — {DATE}

## ⚡ What Was Being Done
<!-- ONE paragraph. The specific task in flight. Not a list of everything. -->

## ✅ What Was Completed This Session
<!-- Bulleted list. Include file paths. Keep it concrete. -->
- 

## 🎯 Next Action (Incoming Agent Should Do This First)
<!-- ONE specific action. Not a list. The single most important next step. -->

## 📋 Next 3–5 Tasks (In Priority Order)
<!-- From state.json tasks, translated to plain language. -->
1. 
2. 
3. 

## 🚧 Blocked / Waiting On
<!-- What is blocking progress. Be specific. null if none. -->

## ⚠️ Do Not Touch
<!-- Files or systems the incoming agent must not modify without reading the decision first. -->

## 🔑 Critical Context (Must Know Before Acting)
<!-- Facts that are not obvious from code. Gotchas. Decisions made. Links to ADRs if relevant. -->

## 📁 Files Modified This Session
<!-- Exact paths only. No explanations needed here. -->

## 🛠️ Commands to Resume
<!-- Exact commands the incoming agent should run to verify state before starting. -->
node scripts/agent-os.js status
npm run lint
```

---

## 3. Handoff Archive Convention

Every CURRENT.md before it is overwritten is archived:

```
.agents/handoffs/
  CURRENT.md                    ← Always the latest baton (overwrite on each session end)
  HANDOFF-YYYY-MM-DD-HH.md     ← Archived copy (agent copies CURRENT → archive before overwriting)
```

The archive format: `HANDOFF-{YYYY}-{MM}-{DD}-{HH}.md` where HH is the UTC hour.

Agents should create the archive copy themselves before overwriting CURRENT.md.

---

## 4. State.json — The Machine Brain

`state.json` is the authoritative machine-readable state. Never edit manually.

**Key fields incoming agents care about:**
- `meta.last_updated` — When state was last written
- `goals[]` — Current active goals (check `status: "in_progress"`)
- `tasks[]` — Task queue (check `status: "pending"` sorted by priority)
- `checkpoints[]` — Where the last harness run stopped
- `waits[]` — Active wait conditions blocking progress
- `evals[]` — Last eval results and pass/fail status

**Relevant CLI to read state:**
```bash
node scripts/agent-os.js status   # Human-readable state summary
node scripts/agent-os.js list     # Show pending tasks
node scripts/agent-os.js eval     # Run harness self-check
```

---

## 5. Runtime Adapter Protocol

Each runtime type has a dedicated adapter file that describes its capabilities and constraints. **The incoming agent reads its own adapter FIRST before touching any code.**

Adapter files live at: `.agents/adapters/{type}.md`

| Runtime Type | Adapter File |
|-------------|-------------|
| IDE agents | `.agents/adapters/ide.md` |
| Cloud agents | `.agents/adapters/cloud.md` |
| CLI agents | `.agents/adapters/cli.md` |
| SDK agents | `.agents/adapters/sdk.md` |
| Harness agents | `.agents/adapters/harness.md` |
| Browser automation | `.agents/adapters/browser.md` |
| Database | `.agents/adapters/database.md` |

---

## 6. Handoff Health Rules

### Outgoing Agent Checklist
Before ending any session, verify:
- [ ] CURRENT.md is updated with this session's work
- [ ] `state.json` reflects current task statuses (via `node scripts/agent-os.js status`)
- [ ] Any modified files are linted (`npm run lint`)
- [ ] Any new `.agents/` files have OKF frontmatter
- [ ] Any errors were logged to `.learnings/ERRORS.md`
- [ ] Archive copy of old CURRENT.md was made

### Incoming Agent Checklist
Before touching any code:
- [ ] Read CURRENT.md fully
- [ ] Run `node scripts/agent-os.js status` to verify actual state
- [ ] Run `npm run lint` to confirm baseline is clean
- [ ] Read own adapter file (`.agents/adapters/{type}.md`)
- [ ] Identify the ONE next task from state.json

---

## 7. Conflict Prevention

If two agents are potentially active simultaneously:

1. Check `.agents/waits/` for any active session locks
2. Check `state.json` → `sessions[]` for active sessions
3. If conflict detected: READ ONLY, do not write, surface the conflict to the user

**Session lock file convention:**
```
.agents/waits/LOCK-{AGENT_TYPE}-{SESSION_ID}.md
```
Lock files are auto-removed when the agent session ends cleanly.

---

## 8. Dead Letter Protocol

If an agent gets stuck and cannot make progress:

1. Write a dead letter to `.agents/dead-letter/DEAD-{TASK_ID}-{DATE}.md`
2. Update task status to `blocked` in state.json
3. Update CURRENT.md with `status: BLOCKED`
4. Do NOT make speculative code changes to get unstuck
5. Surface the block clearly in CURRENT.md → "Blocked / Waiting On" section

Dead letter format: Use the OKF template in `.agents/dead-letter/AGENTS.md`

---

*This protocol is version 2.0. Supersedes any previous handoff conventions.*  
*Last revised: 2026-07-01 | Canonical source: `.agents/HANDOFF.md`*
