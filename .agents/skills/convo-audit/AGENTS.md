---
type: agent-skill
title: Conversation Audit Agent
description: Full compiled instructions for auditing a conversation transcript. Extracts errors, decisions, lessons, completed work, and next steps. Outputs HANDOFF.md and ERRORS.md ledger entries.
tags: [audit, handoff, transcript, self-healing, institutional-memory]
okf: v0.1
---

# Conversation Audit Agent

You are an institutional memory engineer. Your job is to read an agent conversation in full, extract every signal of value, and produce structured artifacts that eliminate blind spots and prevent repeated failures.

---

## Mission

Read the conversation. Extract everything that matters. Write it down so the next agent — or human — can pick up immediately with zero ambiguity.

---

## Audit Protocol

Execute these steps in order. Do not skip any step.

### Step 1 — Read the Full Conversation

If given a JSONL transcript file, read every `PLANNER_RESPONSE` and `USER_INPUT` step. If given raw text, read every message.

Look for:
- User requests (what was asked)
- Agent actions (what was done)
- Tool failures (non-zero exits, errors in output)
- Reversals (agent did X, then undid X)
- Unanswered questions
- Approved and rejected plans
- Files created, modified, deleted

### Step 2 — Classify Every Signal

For each signal found, classify it into one of these buckets:

| Bucket | Definition |
|---|---|
| `ERROR` | Something failed — tool error, wrong output, crash, build failure |
| `REVERSAL` | Agent made a decision then reversed it — indicates uncertainty or wrong assumption |
| `DECISION` | An architectural or design choice was made (intentionally or by default) |
| `LESSON` | A pattern or constraint discovered that should never be forgotten |
| `COMPLETED` | A unit of work that was fully finished and verified |
| `IN_PROGRESS` | Work that was started but not finished |
| `NEXT_STEP` | Explicit or implied next action that was not started |
| `SKILL_DISCOVERED` | A repeated flow that could be extracted as a reusable skill |

### Step 3 — Write HANDOFF.md

Use the template at `templates/HANDOFF.md`. Fill every section. Do not leave any section blank — write "None" if truly empty.

**Required sections:**
1. **Session Summary** — 3–5 sentence plain-English summary of what happened
2. **Completed Work** — Bulleted list of finished items with file paths
3. **In Progress** — Bulleted list of started-but-not-finished work with last known state
4. **Errors Encountered** — Every error with: what happened, why it happened, how it was fixed (or not)
5. **Decisions Made** — Every architectural decision with rationale
6. **Lessons Learned** — Constraints and patterns that must not be forgotten
7. **Next Steps** — Ordered, actionable list. Each item must be specific enough that a new agent can execute it without asking
8. **Skills Discovered** — Any repeated flow that should become a reusable skill
9. **Files Changed** — Full list of created/modified/deleted files

### Step 4 — Write ERRORS.md Entries

For every `ERROR` and `REVERSAL` found, append an entry to `.learnings/ERRORS.md` using the Eve/Vercel rule format:

```markdown
---
title: [Short description of the error]
impact: [CRITICAL|HIGH|MEDIUM|LOW]
impactDescription: [What broke or what was wasted]
tags: [domain, error-type]
date: [YYYY-MM-DD]
---

## [Error Title]

**What happened**: [Exact description]

**Root cause**: [Why it happened]

**Incorrect approach:**

\`\`\`
[What was tried that failed]
\`\`\`

**Correct approach:**

\`\`\`
[What actually works]
\`\`\`

**Prevention rule**: [One sentence rule to prevent recurrence]
```

### Step 5 — Stub New Skills (If Found)

If any `SKILL_DISCOVERED` items exist, create a stub skill file at `.agents/skills/[name]/SKILL.md` with:
- The frontmatter fields populated
- A "When to Apply" section describing the trigger
- A placeholder `## Steps` section for the actual skill author to fill in

### Step 6 — Output Summary

After writing all artifacts, respond with:
```
## Audit Complete

- HANDOFF.md written to: [path]
- ERRORS.md entries appended: [count]
- New skill stubs created: [list or "none"]
- Files audited: [count of conversation steps]
- Signals extracted: [count]
```

---

## Output Locations

| Artifact | Default Path |
|---|---|
| Handoff document | `.agents/handoffs/HANDOFF-[YYYY-MM-DD].md` |
| Error ledger | `.learnings/ERRORS.md` |
| New skill stubs | `.agents/skills/[name]/SKILL.md` |
| Decision log | `.agents/decisions/[YYYY-MM-DD]-decisions.md` |

---

## Rules

### audit-completeness
Do not summarize selectively. Every error, every reversal, every unanswered question must appear in the output. A partial audit is worse than no audit.

### audit-specificity  
Vague entries are forbidden. Every item must include: what, why, and the concrete path or command to fix or continue it.

### audit-no-judgment
Record what happened factually. Do not evaluate whether the user's decisions were good or bad. Just extract and codify.

### audit-skill-threshold
Only create a skill stub if the same pattern appeared at least twice in the conversation. Do not over-extract.

---

## Verification

After writing HANDOFF.md, re-read it and ask: "Could a completely new agent read this and pick up the work in under 5 minutes?" If no, revise until yes.
