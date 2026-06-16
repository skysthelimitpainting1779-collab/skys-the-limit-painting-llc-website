---
type: community
cohesion: 0.50
members: 4
---

# SQL Query Optimization

**Cohesion:** 0.50 - moderately connected
**Members:** 4 nodes

## Members
- [[Batch INSERT Statements for Bulk Data]] - document - .agents/skills/supabase-postgres-best-practices/references/data-batch-inserts.md
- [[Eliminate N+1 Queries with Batch Loading]] - document - .agents/skills/supabase-postgres-best-practices/references/data-n-plus-one.md
- [[Use Cursor-Based Pagination Instead of OFFSET]] - document - .agents/skills/supabase-postgres-best-practices/references/data-pagination.md
- [[Use UPSERT for Insert-or-Update Operations]] - document - .agents/skills/supabase-postgres-best-practices/references/data-upsert.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/SQL_Query_Optimization
SORT file.name ASC
```
