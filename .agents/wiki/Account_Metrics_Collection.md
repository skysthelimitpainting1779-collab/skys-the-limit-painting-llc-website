---
title: Account_Metrics_Collection
type: concept
tags: [graphify, auto-compiled]
last_sync: 2026-06-24T19:49:37.705Z
---

# Account Metrics Collection

> 18 nodes · cohesion 0.22

## Key Concepts

- **collect-signals.mjs** (32 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **main()** (24 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **getAccountPlan()** (5 connections) — `.agents/skills/vercel-optimize/lib/vercel.mjs`
- **getMetricsSchema()** (5 connections) — `.agents/skills/vercel-optimize/lib/vercel.mjs`
- **checkAuth()** (4 connections) — `.agents/skills/vercel-optimize/lib/vercel.mjs`
- **checkCliVersion()** (4 connections) — `.agents/skills/vercel-optimize/lib/vercel.mjs`
- **exec** (4 connections) — `.agents/skills/vercel-optimize/lib/vercel.mjs`
- **getProjectConfig()** (4 connections) — `.agents/skills/vercel-optimize/lib/vercel.mjs`
- **inferPlan()** (4 connections) — `.agents/skills/vercel-optimize/lib/vercel.mjs`
- **collectMetrics()** (4 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **enrichEntry()** (3 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **log()** (3 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **validateProjectScope()** (3 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **writeOutput()** (3 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **diagnoseObservabilityPlus()** (2 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **firstString()** (2 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **parseArgs()** (2 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`
- **sumUsageCosts()** (2 connections) — `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`

## Relationships

- [[Vercel Service Integration]] (30 shared connections)
- [[OData Query Utilities]] (5 shared connections)
- [[Metric Query Normalization]] (4 shared connections)
- [[Framework Support Classification]] (3 shared connections)

## Source Files

- `.agents/skills/vercel-optimize/lib/vercel.mjs`
- `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`

## Audit Trail

- EXTRACTED: 110 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*

## Synthesis
The `Account Metrics Collection` node centers on the `collect-signals.mjs` script, a diagnostic probe that queries Vercel APIs to extract telemetry, usage data, and metrics. It verifies the Vercel CLI version, resolves the linked project and team scope, and determines whether the account has access to Observability Plus features. By analyzing queried metrics, framework support, and usage costs, it empowers the system to intelligently degrade or prompt the user if specific tracking features are blocked by subscriptions or quotas.

## Source References
- `.agents/skills/vercel-optimize/scripts/collect-signals.mjs`

## Open Questions
- What contradictions exist in this node?
