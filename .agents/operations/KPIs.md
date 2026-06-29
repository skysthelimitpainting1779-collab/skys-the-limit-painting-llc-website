---
type: ops-control
title: "Sky's the Limit Painting — Business KPIs"
tags: [kpis, operations, business, lead-pipeline, company-os]
last_sync: 2026-06-24
---

# KPI Control Panel

> This file is the single source of truth for business performance metrics.
> The `scripts/cron-ops.js` monitor reads this file on every cycle.
> Update actual values after each weekly review. The agent will flag divergence from targets.

## Lead Pipeline KPIs

| KPI                                  | Target | Actual | Status     | Last Updated |
| ------------------------------------ | ------ | ------ | ---------- | ------------ |
| New leads / week                     | 5      | —      | ⚪ Pending | —            |
| Lead → Estimate conversion           | ≥ 60%  | —      | ⚪ Pending | —            |
| Estimate → Close conversion          | ≥ 40%  | —      | ⚪ Pending | —            |
| Average response time (hours)        | ≤ 4h   | —      | ⚪ Pending | —            |
| Stale leads (>48h, no status change) | 0      | —      | ⚪ Pending | —            |

## Revenue KPIs

| KPI                      | Target  | Actual | Status     | Last Updated |
| ------------------------ | ------- | ------ | ---------- | ------------ |
| Monthly revenue          | $12,000 | —      | ⚪ Pending | —            |
| Average job value        | $2,400  | —      | ⚪ Pending | —            |
| Active jobs              | ≥ 3     | —      | ⚪ Pending | —            |
| Outstanding invoices ($) | $0      | —      | ⚪ Pending | —            |

## Marketing KPIs (Meta / Organic)

| KPI                                       | Target | Actual | Status     | Last Updated |
| ----------------------------------------- | ------ | ------ | ---------- | ------------ |
| Meta ad spend / month                     | ≤ $500 | —      | ⚪ Pending | —            |
| Cost per lead (Meta)                      | ≤ $25  | —      | ⚪ Pending | —            |
| Organic form submissions / month          | ≥ 8    | —      | ⚪ Pending | —            |
| Google ranking for "house painter [city]" | Top 5  | —      | ⚪ Pending | —            |

## Operational KPIs

| KPI                                    | Target | Actual | Status     | Last Updated |
| -------------------------------------- | ------ | ------ | ---------- | ------------ |
| Estimate turnaround time               | ≤ 24h  | —      | ⚪ Pending | —            |
| On-time job completion rate            | ≥ 95%  | —      | ⚪ Pending | —            |
| Customer satisfaction (5-star reviews) | 100%   | —      | ⚪ Pending | —            |
| Crew utilization rate                  | ≥ 80%  | —      | ⚪ Pending | —            |

## Status Key

- ⚪ **Pending** — Not yet measured
- ✅ **On Track** — At or above target
- ⚠️ **At Risk** — Within 20% below target
- 🔴 **Off Track** — More than 20% below target

---

## Agent Instructions

When the cron monitor updates this file, it will modify the **Actual** and **Status** columns only.
Never modify **Target** values without explicit human approval recorded in `.agents/decisions/`.

_Last sync: 2026-06-24_ 🧬
