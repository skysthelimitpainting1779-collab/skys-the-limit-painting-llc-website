---
trigger: always_on
description: Graphify query first; never dump wiki or GRAPH_REPORT.
---

# Graphify (token discipline)

1. Run budgeted query first:
   ```bash
   npm run graph:query -- "<question>"
   ```
2. Open only the **1–3** source files cited.
3. Optional: `npm run graph:path -- A B` · `npm run graph:explain -- "concept"`

## Never

- Paste `graphify-out/GRAPH_REPORT.md` into context
- Bulk-read `graphify-out/wiki/**`
- Bulk-read `.agents/wiki/` (policy only)

Wiki pages under `graphify-out/wiki` are **query/navigate only**, not always-on memory.
