---
type: policy
title: Agents Operating Manual
description: Canonical operating manual for AI agents with strict compliance rules, workflows, and project guidelines
tags: [agents, compliance, workflow]
---

# Agents Operating Manual

This is the canonical agents operating manual for Sky's the Limit Painting LLC. All agent-related guidelines, standards, and requirements are documented here.

> [!IMPORTANT]
> **STRICT COMPLIANCE RULES:**
> 1. **SSOT**: The `.agents/` directory is the single source of truth for all context. Never create split context.
> 2. **MCP Priority**: Always use `codebase-memory-mcp` tools for structural discovery before `grep`.
> 3. **Shell**: All shell execution MUST use `powershell -ExecutionPolicy Bypass -Command "..."`.
> 4. **Trust, but Verify**: After executing a file creation or edit command, you must independently use the read_file or list_dir MCP tool to verify the file actually exists on the disk with the correct content before reporting success to the user.
> 5. **OKF Compliance**: All `.agents/` markdown files MUST include YAML frontmatter with at least `type`, `title`, `description`, and `tags` fields per Google Open Knowledge Format v0.1.

## 1. Operating Order & Workflow

**Before task execution, read in order:**
1. `.agents/AGENTS.md` (Canonical operating manual - this file)
2. `.agents/rules.md` (Principal architect doctrine and guardrails)
3. `.agents/knowledge.md` (Workspace knowledge and runbook)
4. `.agents/decisions.md` (Architectural decisions and policies)
5. `.agents/effects.md` (Effect ledger for side effects)
6. `.agents/evals.md` (Evaluation harness and test results)
7. `.learnings/ERRORS.md` (Error learning protocol)

**Execution Loop**:
1. Read context -> 2. Open minimal required source files -> 3. Edit -> 4. Verify (Lint, Test, Build) -> 5. Refresh Graph.

## 2. Local Development Requirements

### MCP Servers

The following MCP (Model Context Protocol) servers are required for local development with agents:

#### devin/context7
- **Purpose**: Retrieve up-to-date documentation and code examples for any library
- **Tools**: Library documentation retrieval

#### devin/github-mcp-server
- **Purpose**: GitHub integration for repository management, PR operations, and code search
- **Tools**: 44 tools for GitHub operations (issues, PRs, commits, branches, etc.)

#### devin/linear-mcp-server
- **Purpose**: Linear project management integration
- **Tools**: 38 tools for Linear operations (issues, projects, teams, comments, etc.)

#### devin/mcp-playwright
- **Purpose**: Browser automation and testing
- **Tools**: 23 tools for web browser interaction, testing, and automation

#### devin/supabase-mcp-server
- **Purpose**: Supabase database and backend services integration
- **Tools**: 29 tools for Supabase operations (database, auth, storage, edge functions, etc.)

#### devin/vercel
- **Purpose**: Vercel deployment and project management
- **Tools**: 20 tools for Vercel operations (deployments, projects, runtime logs, etc.)

### Setup

Ensure all MCP servers are properly configured in your MCP client configuration before starting local development with agents. Each server provides specialized tools that agents may invoke during development tasks.

## 3. Codebase Memory MCP

**Always use these tools first for structural discovery:**

### Quick Decision Matrix

| Question | Tool call |
|----------|----------|
| Who calls X? | `trace_path(direction="inbound")` |
| What does X call? | `trace_path(direction="outbound")` |
| Full call context | `trace_path(direction="both")` |
| Find by name pattern | `search_graph(name_pattern="...")` |
| Dead code | `search_graph(max_degree=0, exclude_entry_points=true)` |
| Cross-service edges | `query_graph` with Cypher |
| Impact of local changes | `detect_changes()` |
| Risk-classified trace | `trace_path(risk_labels=true)` |
| Text search | `search_code` or Grep |

### Exploration Workflow
1. `list_projects` — check if project is indexed
2. `get_graph_schema` — understand node/edge types
3. `search_graph(label="Function", name_pattern=".*Pattern.*")` — find code
4. `get_code_snippet(qualified_name="project.path.FuncName")` — read source

### Tracing Workflow
1. `search_graph(name_pattern=".*FuncName.*")` — discover exact name
2. `trace_path(function_name="FuncName", direction="both", depth=3)` — trace
3. `detect_changes()` — map git diff to affected symbols

### Quality Analysis
- Dead code: `search_graph(max_degree=0, exclude_entry_points=true)`
- High fan-out: `search_graph(min_degree=10, relationship="CALLS", direction="outbound")`
- High fan-in: `search_graph(min_degree=10, relationship="CALLS", direction="inbound")`

### 14 MCP Tools
`index_repository`, `index_status`, `list_projects`, `delete_project`,
`search_graph`, `search_code`, `trace_path`, `detect_changes`,
`query_graph`, `get_graph_schema`, `get_code_snippet`, `get_architecture`,
`manage_adr`, `ingest_traces`

### Edge Types
CALLS, HTTP_CALLS, ASYNC_CALLS, IMPORTS, DEFINES, DEFINES_METHOD,
HANDLES, IMPLEMENTS, OVERRIDE, USAGE, FILE_CHANGES_WITH,
CONTAINS_FILE, CONTAINS_FOLDER, CONTAINS_PACKAGE

### Cypher Examples (for query_graph)
```
MATCH (a)-[r:HTTP_CALLS]->(b) RETURN a.name, b.name, r.url_path, r.confidence LIMIT 20
MATCH (f:Function) WHERE f.name =~ '.*Handler.*' RETURN f.name, f.file_path
MATCH (a)-[r:CALLS]->(b) WHERE a.name = 'main' RETURN b.name
```

### Gotchas
1. `search_graph(relationship="HTTP_CALLS")` filters nodes by degree — use `query_graph` with Cypher to see actual edges.
2. `query_graph` has a 200-row cap — use `search_graph` with degree filters for counting.
3. `trace_path` needs exact names — use `search_graph(name_pattern=...)` first.
4. `direction="outbound"` misses cross-service callers — use `direction="both"`.
5. Results default to 10 per page — check `has_more` and use `offset`.

*Fallback to `grep` ONLY for string literals, config values, or non-code files.*

## 4. Living Memory Stack

This project uses **Graphify** (Relational) and **Codebase Memory MCP** (Structural) for codebase understanding.

**The Compilation Loop**:
1. **Scan**: Use MCP tools to find new sources.
2. **Map**: Read `graphify-out/GRAPH_REPORT.md` to prevent orphan nodes and augment edges.
3. **Sync**: Run `graphify update .` to re-index.

## 5. Project Guidelines

### Domain Taxonomy
All components, concepts, and files MUST be semantically linked to one of the following root nodes in the graph:
- **Market**: (e.g., SEO, AI Crawlability, Target Audience)
- **Service**: (e.g., Commercial Painting, Residential, Specialized Coatings)
- **Business-Objective**: (e.g., Lead Capture, Revenue Generation, Conversion Optimization)

Isolated technical nodes must be bridged to the nearest relevant business domain.

### Commands

- **Build project**: `npm run build`
- **Lint check**: `npm run lint`
- **Run tests**: `npm test`
- **Master compile**: `powershell -ExecutionPolicy Bypass -File "..\compile-all.ps1"`
- **Project graph update**: `graphify update .`
- **Graphify CLI Tools**:
  - `graphify update .` (Fast AST sync)
  - `graphify extract . --backend gemini` (LLM semantic extraction)
  - `graphify cluster-only .` (Regenerate report)
  - `graphify query "..."`

## 6. Engineering & Deployment

- **Verification**: Narrow to broad. `npm run lint` -> `npm test` -> `npm run build`. Never deploy broken code.
- **Error Learning Protocol**: On non-zero exit, STOP. Append to `.learnings/ERRORS.md`: `## [ERR-YYYYMMDD-NNN]` containing Summary, Error, Fix, Metadata, `# CORRECT` / `# WRONG` code, and a prevention rule.
- **Deployment & Environments**:
  - **Production**: Map `main` branch to Vercel Production environment.
  - **Staging / Preview**: Map `staging` branch to Vercel Preview (Staging) environment.
  - **Previews**: Map feature branches (`feat/`, `fix/`, etc.) to Vercel Preview environments created dynamically on Pull Requests.
  - Secrets and environment variables must be managed in the Vercel dashboard, not committed.
- **Git Workflows & Standards**:
  - **Naming Conventions**: Strict branch prefixes required: `feat/<desc>`, `fix/<desc>`, `chore/<desc>`, `docs/<desc>`, `infra/<desc>`. Direct pushes/commits to `main` and `staging` are prohibited.
  - **Commit Format**: Conventional Commits standard (`<type>(<scope>): <subject>` e.g. `feat(seo): add meta tags`). Vague messages are banned.
  - **PR Workflow**: All development must occur on feature branches and be merged via PRs. PRs require Goal, Files changed, Validation results, and Search impact.
  - **CI/CD Boomerang Policy**: Auto-repair commits are disabled on protected branches (`main`, `staging`) to prevent Git history pollution. Auto-repairs are allowed on feature/PR branches only.
  - **Compliance Check**: Validations run automatically during `npm run lint` to enforce branch names and commit formats.

## 7. UI, Design, & Legal Guardrails

- **Palette**: Dark Charcoal `#050505` text on Safety Orange `#FF5A00`. Never white on orange.
- **Emoji**: DNA 🧬 allowed in markdown ONLY. No emoji in code/UI.
- **Legal Compliance**:
  - **Contractor ID**: `IR816596` must appear near contractor references.
  - **Workers' Comp**: Under MN Statute 176.041, owner-operator has zero payroll and is exempt.
  - **Claims**: Do not claim licensed, bonded, or award-winning without strict evidence. Do not fake reviews/ratings.

## 8. Open Knowledge & LLM Crawlability

- **Server-Side Rendering**: Routable pages MUST be Server Components. Use `"use client"` only on leaf components.
- **Canonical URLs**: Every route needs absolute canonical via `alternates: { canonical: '...' }`.
- **JSON-LD Schema**:
  - Inject server-side in Next.js Server Components (`<script type="application/ld+json">`).
  - Required: `LocalBusiness` (or specific), `BreadcrumbList`. Connect entities via `@id`.
  - Validate with Google Rich Results Test.
  - Update `scripts/generate-sitemap.js` and `scripts/prerender.mjs` for new routes.
- **AI Crawlers**:
  - `robots.txt` MUST explicitly welcome `GPTBot`, `ClaudeBot`, `Gemini-Bot`, `PerplexityBot`, etc.
  - Provide `Link: https://www.skysthelimitpaintingllc.com/llms.txt`.
- **llms.txt**: High-density `/public/llms.txt` manifest containing absolute links to pages and the mandatory Legal/Contractor ID compliance facts.

## 9. File Structure

- `agents.md` (this file) - Canonical operating manual
- `CLAUDE.md` - Developer and agent reference guide, references this file via @agents.md
- `.agents/` - Single source of truth for all agent context
- `.learnings/` - Error logs and learning artifacts
- `graphify-out/` - Generated graph outputs (auto-generated, do not edit manually)
- `.github/` - CI/CD workflows and templates

## 10. Reference Convention

Use the `@` syntax to reference this file from other documentation:
- `@agents.md` - Points to this canonical operating manual
  - `robots.txt` MUST explicitly welcome `GPTBot`, `ClaudeBot`, `Gemini-Bot`, `PerplexityBot`, etc.
  - Provide `Link: https://www.skysthelimitpaintingllc.com/llms.txt`.
- **llms.txt**: High-density `/public/llms.txt` manifest containing absolute links to pages and the mandatory Legal/Contractor ID compliance facts.

## 9. File Structure

- `agents.md` (this file) - Canonical operating manual
- `CLAUDE.md` - Developer and agent reference guide, references this file via @agents.md
- `.agents/` - Single source of truth for all agent context
- `graphify-out/` - Generated graph outputs (auto-generated, do not edit manually)

## 10. Reference Convention

Use the `@` syntax to reference this file from other documentation:
- `@agents.md` - Points to this canonical operating manual
