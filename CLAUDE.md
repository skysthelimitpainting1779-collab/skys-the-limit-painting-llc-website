# CLAUDE.md // Developer & agent reference guide

Follow the operating manual in [AGENTS.md](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/AGENTS.md) exactly.

## Commands

- **Build project**: `npm run build`
- **Lint check**: `npm run lint`
- **Run tests**: `npm test`
- **Master compile**: `powershell -File "C:\Users\Johnny Cage\DEV\compile-all.ps1"`
- **Project graph update**: `graphify update .`

## Guidelines

1. **Operating Order**: Read the Central LLM Wiki summary first, then the Project Graph report (`graphify-out/GRAPH_REPORT.md`), then modify only identified files.
2. **Google Open Knowledge Standard**: Use schema JSON-LD, ensure stable `@id` mappings, and keep sitemap/prerender coverage current. Never publish fake review or license claims.
3. **Design Safeguards**: Use HSL colors from `index.css`. Use Dark Charcoal `#050505` text on Safety Orange `#FF5A00`. Never use white text on Safety Orange. No emoji in source code.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
