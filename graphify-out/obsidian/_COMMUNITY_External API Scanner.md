---
type: community
cohesion: 0.60
members: 5
---

# External API Scanner

**Cohesion:** 0.60 - moderately connected
**Members:** 5 nodes

## Members
- [[external-api-slow.mjs]] - code - .agents/skills/vercel-optimize/lib/gates/external-api-slow.mjs
- [[extractCallCounts()]] - code - .agents/skills/vercel-optimize/lib/gates/external-api-slow.mjs
- [[extractExternalApis()]] - code - .agents/skills/vercel-optimize/lib/gates/external-api-slow.mjs
- [[gate()_3]] - code - .agents/skills/vercel-optimize/lib/gates/external-api-slow.mjs
- [[metadata_3]] - code - .agents/skills/vercel-optimize/lib/gates/external-api-slow.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/External_API_Scanner
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Cold Start Analysis]]

## Top bridge nodes
- [[external-api-slow.mjs]] - degree 5, connects to 1 community