---
type: ops-control
title: "Lead Pipeline State"
tags: [pipeline, leads, crm, hubspot, operations, company-os]
last_sync: 2026-06-24
---

# Lead Pipeline

> **Managed by:** `scripts/harness-ops.js` (state machine) and `scripts/cron-ops.js` (stale detection)
> **Source of truth for active leads.** Do not edit the `status` or `updated_at` fields manually — these are written by the harness.

## Pipeline Stages

```
INTAKE → CRM_RECONCILIATION → ESTIMATE_DRAFTING → APPROVAL_WAITPOINT → CLOSED_WON / CLOSED_LOST
```

| Stage | Description | SLA |
|---|---|---|
| `intake` | Lead received from `/api/leads`. Saved to Supabase. | Immediate |
| `crm_reconciliation` | HubSpot contact upserted (create or patch). Webhook fired. | < 30s |
| `estimate_drafting` | Agent drafts estimate response in `.agents/approvals/`. | < 4h |
| `approval_waitpoint` | Human reviews and approves drafted estimate. | < 24h |
| `closed_won` | Estimate accepted. Job scheduled. | — |
| `closed_lost` | Lead did not convert. Reason logged. | — |

---

## Active Leads

<!-- AUTO-MANAGED: harness-ops.js writes/updates rows below. Do not edit manually. -->

| Lead ID | Name | Market | Stage | Submitted At | Updated At | HubSpot Synced | Notes |
|---|---|---|---|---|---|---|---|
| SKY-MOCK-1782332669088 | Jane Homeowner | Residential | `approval_waitpoint` | 2026-06-24T20:24:29.089Z | 2026-07-08T03:35:05.865Z | ✅ | Awaiting approval: ESTIMATE-SKY-MOCK-1782332669088.md |

| SKY-MOCK-1782916325471 | Jane Homeowner | Residential | `approval_waitpoint` | 2026-07-01T14:32:05.471Z | 2026-07-08T03:35:05.882Z | ✅ | Awaiting approval: ESTIMATE-SKY-MOCK-1782916325471.md |
---

## Stale Lead Alert Rules (read by cron-ops.js)

- **Rule 1:** If a lead has been in `estimate_drafting` for > 48 hours → enqueue `FOLLOW-UP: Stale Lead Review [LEAD_ID]` in SQLite queue.
- **Rule 2:** If a lead has been in `approval_waitpoint` for > 72 hours → enqueue `ESCALATE: Human Approval Overdue [LEAD_ID]`.
- **Rule 3:** If HubSpot sync status is `failed` for any lead → enqueue `REPAIR: HubSpot Sync Failure [LEAD_ID]`.

---

## Closed Pipeline (Last 30 Days)

| Lead ID | Name | Outcome | Job Value | Closed At |
|---|---|---|---|---|
| *(None yet)* | — | — | — | — |

*Last sync: 2026-06-24* 🧬
