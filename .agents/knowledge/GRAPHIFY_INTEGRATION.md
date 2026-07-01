---
id: graphify_integration
name: "Reference Guide: Graphify CLI Integration"
type: concept
description: "How to run, query, and refresh the semantic knowledge graph of the project."
tags: [runbook, graphify, knowledge-graph]
references: [workspace_knowledge]
---

# Reference Guide: Graphify CLI Integration

**Status**: Active  
**Domain**: Project Semantics & Knowledge Engineering

## Core CLI Actions

Graphify parses AST, imports, definitions, and OKF markdown concepts inside this project to maintain a highly detailed semantic graph file under `graphify-out/`.

### 1. Common Graphify Commands

| Command | Action | Description |
|---|---|---|
| `graphify update .` | AST Local Update | Incremental fast scan of all modified code and documents. (AST-only, zero cost). |
| `graphify extract . --backend gemini` | Semantic Extraction | Fully re-extract semantic relations using Gemini model endpoints. |
| `graphify cluster-only .` | Community Clustering | Groups nodes into communities and regenerates `GRAPH_REPORT.md` and `graph.html`. |
| `graphify query "question"` | Semantic Query | Interrogate the active knowledge base for structured answers. |

### 2. Compilation Master Script

After completing code modifications or creating new OKF documents, compile the master project graph dev compiler:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Johnny Cage\DEV\compile-all.ps1"
```

This updates all local subprojects and merges files into the master global graph at `~/.graphify/global-graph.json` for persistent, multi-project context memory.
