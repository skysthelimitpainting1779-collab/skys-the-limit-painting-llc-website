---
type: community
cohesion: 0.39
members: 9
---

# Candidate Contract Validation

**Cohesion:** 0.39 - loosely connected
**Members:** 9 nodes

## Members
- [[VERCEL_FLAGS_PACKAGES]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[WORKFLOW_ENDPOINT_PREFIXES]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[applyHardGates()]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[flagsEndpointReason()]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[hard-gates.mjs]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[isFlagsEndpointCandidate()]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[isWorkflowRuntimeEndpointCandidate()]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[normalizeRoute()]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs
- [[workflowEndpointReason()]] - code - .agents/skills/vercel-optimize/lib/gates/hard-gates.mjs

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Candidate_Contract_Validation
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Route Normalization]]
- 3 edges to [[_COMMUNITY_Candidate Selection Logic]]

## Top bridge nodes
- [[hard-gates.mjs]] - degree 11, connects to 2 communities
- [[applyHardGates()]] - degree 7, connects to 1 community
- [[normalizeRoute()]] - degree 4, connects to 1 community