---
name: convo-audit
description: Audits an entire agent conversation transcript to extract every error, decision, lesson learned, and unfinished work. Produces a structured handoff document and an ERRORS.md ledger entry. Use when a long session ends, a task is handed off to another agent, or you want to codify what happened into institutional memory. Triggers on phrases like "audit this convo", "what did we learn", "handoff doc", "summarize this session", or "what went wrong".
license: MIT
metadata:
  author: Sky's the Limit Painting LLC
  version: 1.0.0
  okf: v0.1
  type: agent-skill
  tags: [audit, learning, handoff, transcript, self-healing, institutional-memory]
---

# Conversation Audit Skill

Reads a conversation transcript (JSONL or raw text) and produces two artifacts:

1. **`HANDOFF.md`** — a structured document the next agent can read cold and immediately understand what happened, what was built, what is broken, and what is next.
2. **`ERRORS.md` entry** — codified error ledger entries in the domain's dead-letter format to prevent repeating failures.

## When to Apply

Use this skill when:

- A long conversation session is ending
- Work is being handed off to a different agent or a human
- You want to extract lessons from a messy or failed session
- You need to audit what decisions were made and why
- You want to populate `dead-letter/ERRORS.md` from real conversation history

## Audit Categories

| Priority | Category | Output Location |
|---|---|---|
| 1 | Errors & Failures | `dead-letter/ERRORS.md` |
| 2 | Decisions Made | `decisions/[date]-decisions.md` |
| 3 | Lessons Learned | `.learnings/ERRORS.md` |
| 4 | Work Completed | `HANDOFF.md` §Completed |
| 5 | Work In Progress | `HANDOFF.md` §In Progress |
| 6 | Next Steps | `HANDOFF.md` §Next Steps |
| 7 | Skills Discovered | `skills/[name].md` stub |

## How to Run

**Manual (any agent):**
> "Read this conversation and run the convo-audit skill. Output a HANDOFF.md and append errors to `.learnings/ERRORS.md`."

**CLI (Node.js script):**
```bash
node .agents/skills/convo-audit/scripts/audit.js --transcript <path-to-transcript.jsonl> --out .agents/handoffs/
```

## Output Format

Full compiled instructions and output templates: `AGENTS.md`  
Output templates: `templates/HANDOFF.md`, `templates/ERROR_ENTRY.md`  
CLI script: `scripts/audit.js`
