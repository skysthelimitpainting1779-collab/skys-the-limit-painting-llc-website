---
type: community
cohesion: 0.33
members: 6
---

# Framework Deployment Script

**Cohesion:** 0.33 - loosely connected
**Members:** 6 nodes

## Members
- [[cleanup()_1]] - code - .agents/skills/deploy-to-vercel/resources/deploy.sh
- [[deploy.sh]] - code - .agents/skills/deploy-to-vercel/resources/deploy.sh
- [[deploy.sh script]] - code - .agents/skills/deploy-to-vercel/resources/deploy.sh
- [[detect_framework()_1]] - code - .agents/skills/deploy-to-vercel/resources/deploy.sh
- [[has_dep_exact()_1]] - code - .agents/skills/deploy-to-vercel/resources/deploy.sh
- [[has_dep_prefix()_1]] - code - .agents/skills/deploy-to-vercel/resources/deploy.sh

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Framework_Deployment_Script
SORT file.name ASC
```
