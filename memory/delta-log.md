# Memory Delta Log

> Append-only. Every write to `shared-graph.json` must produce an entry here.
> Format: `[ISO_TS] | [AGENT_ID] | [OPERATION] | [NODE_ID] | [SUMMARY]`

---

## Schema

```
[timestamp] | [agent_id] | CREATE|UPDATE|DELETE|LINK | [node_id] | [summary]
```

---

## Log

```
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.business | Initialized entity: Sky's the Limit Painting LLC (MN ID: IR816596)
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.service.residential | Initialized residential service node with route /residential
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.service.commercial | Initialized commercial service node with route /commercial
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.service.public_sector | Initialized public sector service node with route /public-sector
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.lead_pipeline | Initialized lead pipeline state machine (stages: intake→crm_reconciliation→estimate_drafting→approval_waitpoint)
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.hubspot_crm | Initialized HubSpot CRM integration (portal: 246259637)
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.supabase_db | Initialized Supabase DB integration (tables: leads, lead_events)
2026-06-24T20:29:00Z | memory-harness/init | CREATE | sky.resend_email | Initialized Resend email integration (notify + auto-reply)
2026-06-24T20:29:00Z | memory-harness/init | LINK | sky.business→sky.lead_pipeline | Relation: operates
2026-06-24T20:29:00Z | memory-harness/init | LINK | sky.lead_pipeline→sky.hubspot_crm | Relation: syncs_to
2026-06-24T20:29:00Z | memory-harness/init | LINK | sky.lead_pipeline→sky.supabase_db | Relation: persists_to
2026-06-24T20:29:00Z | memory-harness/init | LINK | sky.lead_pipeline→sky.resend_email | Relation: notifies_via
```
