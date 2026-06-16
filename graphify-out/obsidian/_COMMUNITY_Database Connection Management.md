---
type: community
cohesion: 0.67
members: 4
---

# Database Connection Management

**Cohesion:** 0.67 - moderately connected
**Members:** 4 nodes

## Members
- [[Configure Idle Connection Timeouts]] - document - .agents/skills/supabase-postgres-best-practices/references/conn-idle-timeout.md
- [[Set Appropriate Connection Limits]] - document - .agents/skills/supabase-postgres-best-practices/references/conn-limits.md
- [[Use Connection Pooling for All Applications]] - document - .agents/skills/supabase-postgres-best-practices/references/conn-pooling.md
- [[Use Prepared Statements Correctly with Pooling]] - document - .agents/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Database_Connection_Management
SORT file.name ASC
```
