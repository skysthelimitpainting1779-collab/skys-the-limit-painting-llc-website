---
type: ops-control
title: "Recurring Operations Schedule"
tags: [recurring, cron, operations, automation, company-os]
last_sync: 2026-06-24
---

# Recurring Operations

> These are the standing recurring tasks executed by `scripts/cron-ops.js` on each cycle (default: every 30 minutes).
> Tasks with `auto: true` are executed autonomously. Tasks with `auto: false` enqueue an approval item.

## Daily Automated Tasks

| Task                | Schedule        | Auto   | Owner       | Description                                            |
| ------------------- | --------------- | ------ | ----------- | ------------------------------------------------------ |
| Stale lead scan     | Every 30 min    | ✅ Yes | harness-ops | Check pipeline.md for leads >48h without status change |
| HubSpot sync audit  | Every 6h        | ✅ Yes | harness-ops | Verify all active leads have a HubSpot contact ID      |
| KPI snapshot        | Daily 08:00 CST | ✅ Yes | cron-ops    | Pull Supabase lead counts and update KPIs.md actuals   |
| Approval queue scan | Every 30 min    | ✅ Yes | cron-ops    | Flag items in .agents/approvals/ older than 24h        |

## Weekly Manual Tasks (Enqueued for Human)

| Task                   | Day    | Auto  | Owner   | Description                                             |
| ---------------------- | ------ | ----- | ------- | ------------------------------------------------------- |
| KPI review             | Monday | ❌ No | Anthony | Review KPIs.md targets vs actuals; update decisions log |
| Pipeline scrub         | Monday | ❌ No | Anthony | Close-out stale leads; update closed pipeline table     |
| Meta ad spend review   | Friday | ❌ No | Anthony | Pull Meta Ads Manager report; compare to KPI targets    |
| Invoice reconciliation | Friday | ❌ No | Anthony | Match closed jobs to outstanding invoices               |

## Monthly Tasks

| Task                    | When                | Auto   | Description                                                    |
| ----------------------- | ------------------- | ------ | -------------------------------------------------------------- |
| Google review push      | Last Friday         | ❌ No  | Send review request emails to closed_won leads                 |
| Seasonal pricing review | 1st of month        | ❌ No  | Review job pricing vs market comparables                       |
| llms.txt refresh        | 1st of month        | ✅ Yes | Update /public/llms.txt with new service pages and legal facts |
| Sitemap regeneration    | After any new route | ✅ Yes | Run scripts/generate-sitemap.js after page additions           |

---

## Cron Loop Behavior

The `scripts/cron-ops.js` process runs as a background Node.js process. It:

1. Reads `pipeline.md` every 30 minutes
2. Computes hours since `updated_at` for each active lead
3. Enqueues SQLite tasks for stale leads or failed syncs
4. Reads `KPIs.md` to compare actuals against targets and flags divergence
5. Writes a `CRON_RUN_[timestamp].log` to `.agents/traces/` on each cycle

_Last sync: 2026-06-24_ 🧬
