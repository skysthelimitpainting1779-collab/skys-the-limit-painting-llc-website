---
type: community
cohesion: 0.13
members: 28
---

# Vercel Service Integration

**Cohesion:** 0.13 - loosely connected
**Members:** 28 nodes

## Members
- [[MIN_CLI_VERSION]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[aggregateServicesByName()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[baselineStack()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[categorizeError()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[checkObservabilityPlusConfiguration()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[classifyObservabilityPlusConfiguration()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[detectNextCacheComponents()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[detectStack()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[extractBillingPlan()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[extractPlanOption()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[filterUsageByProject()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[getBillingPlanFromPath()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[getCliIdentity()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[getContract()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[getCurrentTeamId()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[getTeamInfo()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[getUsage()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[hasObservabilityPlus()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[isDailyQuotaExceeded()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[normalizeBillingPlan()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[pathExists()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[projectMatches()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[readLinkedOwnerForProjectId()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[redactSensitiveText()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[resolveProjectId()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[runVercelJson()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[scopedArgs()]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs
- [[vercel.mjs]] - code - .agents/skills/vercel-optimize/lib/vercel.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Vercel_Service_Integration
SORT file.name ASC
```

## Connections to other communities
- 30 edges to [[_COMMUNITY_Account Metrics Collection]]
- 7 edges to [[_COMMUNITY_OData Query Utilities]]
- 4 edges to [[_COMMUNITY_Rate Limiting Logic]]
- 3 edges to [[_COMMUNITY_Workspace Resolver]]
- 2 edges to [[_COMMUNITY_Metric Query Normalization]]

## Top bridge nodes
- [[vercel.mjs]] - degree 45, connects to 5 communities
- [[detectStack()]] - degree 8, connects to 2 communities
- [[resolveProjectId()]] - degree 5, connects to 2 communities
- [[runVercelJson()]] - degree 14, connects to 1 community
- [[checkObservabilityPlusConfiguration()]] - degree 5, connects to 1 community