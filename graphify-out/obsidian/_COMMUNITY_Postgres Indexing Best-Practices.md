---
type: community
cohesion: 0.20
members: 10
---

# Postgres Indexing Best-Practices

**Cohesion:** 0.20 - loosely connected
**Members:** 10 nodes

## Members
- [[B-tree Index]] - document - .agents/skills/supabase-postgres-best-practices/references/query-missing-indexes.md
- [[Composite Index]] - document - .agents/skills/supabase-postgres-best-practices/references/query-composite-indexes.md
- [[Covering Index]] - document - .agents/skills/supabase-postgres-best-practices/references/query-covering-indexes.md
- [[Foreign Key Index]] - document - .agents/skills/supabase-postgres-best-practices/references/schema-foreign-key-indexes.md
- [[Partial Index]] - document - .agents/skills/supabase-postgres-best-practices/references/query-partial-indexes.md
- [[RLS Policy]] - document - .agents/skills/supabase-postgres-best-practices/references/security-rls-performance.md
- [[Row Level Security]] - document - .agents/skills/supabase-postgres-best-practices/references/security-rls-basics.md
- [[app_user role]] - document - .agents/skills/supabase-postgres-best-practices/references/security-privileges.md
- [[partition by range]] - document - .agents/skills/supabase-postgres-best-practices/references/schema-partitioning.md
- [[pg_constraint]] - document - .agents/skills/supabase-postgres-best-practices/references/schema-constraints.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Postgres_Indexing_Best-Practices
SORT file.name ASC
```
