---
type: ops-control
title: "Decisions Queue"
tags: [decisions, approvals, human-in-the-loop, company-os]
last_sync: 2026-06-24
---

# Decisions Queue

> Items here require a human decision before the agent can proceed.
> The agent will NOT execute any action marked `status: pending` without human sign-off.
> To approve: change `status` to `approved` and add your initials to `decided_by`.
> To reject: change `status` to `rejected` and add a reason.

## Open Decisions

| ID | Priority | Description | Raised By | Raised At | Status | Decided By |
|---|---|---|---|---|---|---|
| *(Queue is empty)* | — | — | — | — | — | — |

---

## Decision Log (Closed)

| ID | Description | Decision | Decided By | Decided At |
|---|---|---|---|---|
| *(None yet)* | — | — | — | — |

---

## Auto-Enqueue Rules

The following events cause the harness to automatically add items here:

| Trigger | Priority | Description |
|---|---|---|
| Lead enters `approval_waitpoint` | HIGH | Human review of drafted estimate before sending |
| HubSpot sync fails 3x | HIGH | Manual HubSpot credential check required |
| Meta ad spend > 120% of monthly target | MEDIUM | Spend review and pause decision |
| Lead response time > 8h | MEDIUM | Acknowledge and flag for manual outreach |
| New route added without JSON-LD schema | LOW | Schema markup task enqueue |

---

## Template: Estimate Approval Item

When a new estimate draft is ready, the harness writes a file to `.agents/approvals/ESTIMATE-[LEAD_ID].md` with this structure:

```markdown
## Estimate Draft — [LEAD_ID]

**Lead:** [Name] | [Email] | [Phone]
**Market:** [market]
**Project Type:** [projectType]
**Timeline:** [timeline]
**Budget Range:** [budget]

### Drafted Response

[Agent-composed estimate draft goes here]

### Agent Confidence
- HubSpot synced: ✅ / ❌
- Supabase record: ✅ / ❌
- Auto-reply sent: ✅ / ❌

### Human Action Required
- [ ] Review draft estimate
- [ ] Approve to send via email OR edit and send manually
- [ ] Update pipeline.md status to `closed_won` or `closed_lost`
```

*Last sync: 2026-06-24* 🧬
