---
type: community
cohesion: 0.18
members: 15
---

# Rate Limiting Logic

**Cohesion:** 0.18 - loosely connected
**Members:** 15 nodes

## Members
- [[.constructor()_1]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[SemaphoreAbortError]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[_resetMetricSemaphoreForTests()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[dailyQuotaResult()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[defaultSleep()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[getDailyQuotaBlock()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[getMetricThrottle()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[isRateLimited()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[parsePositiveIntEnv()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[resolveConcurrency()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[resolveRateLimit()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[retryOnRateLimit()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[setDailyQuotaBlocked()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[throttle.mjs]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs
- [[utcMidnightAfter()]] - code - .agents/skills/vercel-optimize/lib/throttle.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Rate_Limiting_Logic
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Vercel Service Integration]]
- 2 edges to [[_COMMUNITY_Vercel Hard Gates]]
- 1 edge to [[_COMMUNITY_OData Query Utilities]]

## Top bridge nodes
- [[throttle.mjs]] - degree 17, connects to 2 communities
- [[getMetricThrottle()]] - degree 5, connects to 2 communities
- [[retryOnRateLimit()]] - degree 3, connects to 1 community