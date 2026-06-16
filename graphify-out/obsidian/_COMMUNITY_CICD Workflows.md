---
type: community
cohesion: 0.50
members: 4
---

# CI/CD Workflows

**Cohesion:** 0.50 - moderately connected
**Members:** 4 nodes

## Members
- [[CI Workflow]] - code - .github/workflows/ci.yml
- [[Quality Gate Workflow]] - code - .github/workflows/quality-gate.yml
- [[Release Workflow]] - code - .github/workflows/release.yml
- [[Security Scan Workflow]] - code - .github/workflows/security-scan.yml

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/CI/CD_Workflows
SORT file.name ASC
```
