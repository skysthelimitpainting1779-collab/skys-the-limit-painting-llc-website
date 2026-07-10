---
id: graphify_integration
name: "Graphify + Karpathy wiki (token-saving memory)"
type: concept
description: "Use budgeted graphify query first; wiki only as index→page→sources navigation."
tags: [runbook, graphify, knowledge-graph, tokens, karpathy]
references: [workspace_knowledge]
---

# Graphify + Karpathy wiki

## Point

- **Graphify** is not a report to paste. It is a **query interface** over `graphify-out/graph.json` that returns a **budgeted subgraph** (default 1500 tokens) — often **~10–75×** cheaper than reading the corpus, `GRAPH_REPORT.md`, or the whole wiki.
- **Wiki** is only good if used like Karpathy’s LLM wiki: **navigate and maintain**, not bulk-load auto stubs.
- **Package:** `graphifyy` ≥ **0.9.11** (`uv tool upgrade graphifyy`). Noise controlled by **`.graphifyignore`**.

## Noise policy (after 2026-07-09 purge)

| Before | After |
|-------:|------:|
| ~13 048 nodes | ~1 129 nodes |
| ~half from `repomix-output.md` | **0** dump nodes |
| vendor skill packs dominant | **src + scripts** dominant |
| report ~273 KB | report ~14 KB |

Excluded via `.graphifyignore`: repomix dumps, vendor skills under `.agents/skills/*`, handoffs, multi-agent residue, media, husky internals, archives.

## Commands (preferred)

```bash
npm run graph:status
npm run graph:query -- "how does learn-pipeline write to Turso"
npm run graph:query -- "lead form validation" --budget 1200
npm run graph:path -- "learn-pipeline" "Turso"
npm run graph:explain -- "entire-to-agentos"
npm run graph:update          # AST-only after code changes
```

Wrapper: `scripts/graph-context.mjs` → last result in `.learnings/GRAPH_CONTEXT_LAST.md`.

## Anti-patterns

| Bad | Why |
|-----|-----|
| Open `GRAPH_REPORT.md` in the agent | ~280k; kills context |
| Read all of `.agents/wiki/` | Auto-stubs; no selection |
| Grep first for architecture | Misses graph edges; more tokens |
| Wiki that nobody updates | Pure bloat |

## Karpathy flow

1. Budgeted **query**
2. Optional **one** wiki community page (index → page)
3. Open **few** source files
4. Write durable lessons to Turso / `.learnings` / curated knowledge — not more stubs

## Policy sources

- `.agents/rules/graphify.md`
- `.agents/wiki/README.md`
- `.cursor/rules/graphify.mdc`
- `.agents/AGENTS.md` § Graphify + Karpathy wiki
