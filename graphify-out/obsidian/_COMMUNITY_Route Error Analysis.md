---
type: community
cohesion: 0.60
members: 5
---

# Route Error Analysis

**Cohesion:** 0.60 - moderately connected
**Members:** 5 nodes

## Members
- [[extractErrors()]] - code - .agents/skills/vercel-optimize/lib/gates/route-errors.mjs
- [[extractFromStatusRows()]] - code - .agents/skills/vercel-optimize/lib/gates/route-errors.mjs
- [[gate()_10]] - code - .agents/skills/vercel-optimize/lib/gates/route-errors.mjs
- [[metadata_10]] - code - .agents/skills/vercel-optimize/lib/gates/route-errors.mjs
- [[route-errors.mjs]] - code - .agents/skills/vercel-optimize/lib/gates/route-errors.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Route_Error_Analysis
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Cold Start Analysis]]
- 1 edge to [[_COMMUNITY_Route Normalization]]
- 1 edge to [[_COMMUNITY_CWV Performance Analysis]]

## Top bridge nodes
- [[route-errors.mjs]] - degree 7, connects to 3 communities