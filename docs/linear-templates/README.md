---
type: documentation
title: Linear team templates (install guide)
description: Paste-ready issue, project, and document templates for team Skysthelimit. MCP cannot create Linear templates — install via UI.
tags: [linear, templates, skysthelimit]
date: 2026-07-10
---

# Linear team templates — install guide

Linear **team templates** (Settings → Team → Templates) are **not creatable via the Linear MCP API**.  
This folder is the **SSOT** for template bodies. Paste each into Linear UI once.

## Where to create them

1. Open [Linear](https://linear.app/skysthelimit)  
2. **Settings → Teams → Skysthelimit → Templates**  
3. For each type: **+ New template**  
4. Copy title + body from the files below  
5. Set default labels / project / priority when the UI allows  

Docs: [Linear teams / templates](https://linear.app/docs/teams)

## Issue templates

| Template name (in Linear) | File | Default project (set in UI) | Suggested labels |
|---------------------------|------|----------------------------|------------------|
| Feature | [issue-feature.md](./issue-feature.md) | skysthelimit · Platform | Feature, !implement, area:…, agent-ready |
| Bug | [issue-bug.md](./issue-bug.md) | skysthelimit · Reliability | Bug, p0-critical or p1-high, area:… |
| Epic | [issue-epic.md](./issue-epic.md) | Platform or Reliability | Epic, !plan |
| Chore / infra | [issue-chore.md](./issue-chore.md) | Reliability | Chore, area:infra |
| Agent OS task | [issue-agent-os.md](./issue-agent-os.md) | Platform | Chore or Improvement, !implement |

Keyboard: **Alt/Option + C** → pick template.

## Project templates

| Template name | File |
|---------------|------|
| Platform project | [project-platform.md](./project-platform.md) |
| Reliability project | [project-reliability.md](./project-reliability.md) |

## Document templates

| Template name | File |
|---------------|------|
| Spec / design note | [doc-spec.md](./doc-spec.md) |
| Project status update | [doc-status.md](./doc-status.md) |
| Agent OS / process note | [doc-agent-os.md](./doc-agent-os.md) |

## Related

- Naming: `docs/NAMING.md`  
- Linear OS: `docs/LINEAR_OS.md`  
- Agent OS: `docs/AGENT_OS.md`  
- Repo issue bodies (agents): `docs/templates/`  

## Turso (Agent OS memory)

Turso is **for Agent OS only** (learnings, domain state, CI lessons) — **not** product leads/CMS.

| Env | Purpose |
|-----|---------|
| `TURSO_DATABASE_URL` | Remote `libsql://…` or `file:./.agents/agent-os.db` |
| `TURSO_AUTH_TOKEN` | Required for remote |

Product data stays **Supabase** + **Payload Postgres**. See `docs/AGENT_OS.md` § Memory.
