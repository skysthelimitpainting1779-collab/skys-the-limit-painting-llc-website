---
trigger: always_on
description: Enforce Agent OS ontology v2 for every host agent (Claude, Cursor, Gemini, Grok, CLI).
---

# Ontology enforcement

**SSOT map:** `.agents/ONTOLOGY.md`  
**Kernel:** `.agents/AGENTS.md`  
**Manifest:** `.agents/ontology.manifest.json`

## Required cold start

```text
AGENTS.md → ERRORS_INDEX → graph:query → minimal files
```

## Forbidden

- Creating `.agents/_archive` or any archive dump tree (purge = **hard delete**)  
- Re-adding session residue (`*m1_m5*`, orchestrator dumps, dashboard.html)  
- Bulk wiki / GRAPH_REPORT / vendor skill packs as default context  
- Git commit subjects as skills (`no-git-skills-v3`)

## Commands

```bash
npm run agentos:health
npm run agentos:validate
npm run agentos:improve
npm run graph:query -- "…"
```
