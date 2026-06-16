---
type: community
cohesion: 0.60
members: 5
---

# Cache Hit Analysis

**Cohesion:** 0.60 - moderately connected
**Members:** 5 nodes

## Members
- [[extractCacheHitRates()]] - code - .agents/skills/vercel-optimize/lib/gates/uncached-route.mjs
- [[extractMethodShares()]] - code - .agents/skills/vercel-optimize/lib/gates/uncached-route.mjs
- [[gate()_13]] - code - .agents/skills/vercel-optimize/lib/gates/uncached-route.mjs
- [[metadata_13]] - code - .agents/skills/vercel-optimize/lib/gates/uncached-route.mjs
- [[uncached-route.mjs]] - code - .agents/skills/vercel-optimize/lib/gates/uncached-route.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Cache_Hit_Analysis
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Cold Start Analysis]]
- 1 edge to [[_COMMUNITY_Route Normalization]]
- 1 edge to [[_COMMUNITY_CWV Performance Analysis]]

## Top bridge nodes
- [[uncached-route.mjs]] - degree 7, connects to 3 communities