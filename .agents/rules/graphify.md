---
trigger: always_on
description: Graphify-first exploration with token budget; Karpathy-style wiki navigation only.
---

## graphify + wiki (token discipline)

This repo has a **built graph** at `graphify-out/graph.json` (~13k nodes). Using it correctly is how you save tokens (often ~10–75× vs dumping reports/wiki/grep).

### MUST (codebase / architecture / “where is X”)

1. Run **budgeted query first** (do not open `GRAPH_REPORT.md` or bulk wiki):
   ```bash
   npm run graph:query -- "<your question>"
   # same as: node scripts/graph-context.mjs query "..." --budget 1500
   ```
2. Relationships:
   ```bash
   npm run graph:path -- "SymbolA" "SymbolB"
   ```
3. One concept:
   ```bash
   npm run graph:explain -- "concept"
   ```
4. Then open **only** the 1–3 source files cited by the graph (`source_location`).

### MUST NOT

- Paste or bulk-read `graphify-out/GRAPH_REPORT.md` into the session
- Read many pages under `.agents/wiki/` “just in case”
- Use raw grep/glob as the **first** orientation step when the graph exists
- Treat auto-compiled wiki stubs as durable memory

### Karpathy wiki (only if needed)

Wiki helps only when **navigated and maintained**:

1. Prefer `graphify-out/wiki/index.md` if present
2. Else `.agents/wiki/index.md` → **one** community page
3. Drill to god nodes / sources — stop
4. Durable new knowledge → `.learnings` / Turso / curated `.agents/knowledge/*`, not more stubs

See `.agents/wiki/README.md`.

### Keep graph fresh (cheap)

After code edits: `npm run graph:update` (AST-only) or hooks `post-edit`.

### Subagents

Every explore/subagent prompt that searches the codebase must include:  
**“Run `npm run graph:query -- \"...\"` before Read/Grep.”**
