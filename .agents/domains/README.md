---
type: documentation
title: Domain agents
description: One folder = one specialist agent with rules, MCPs, skills, system prompt, and isolated learnings.
tags: [domains, multi-agent, ontology]
---

# Domain agents

## Model

```text
Orchestrator (AGENTS.md kernel)
    │
    ├─ domain:route(paths)
    │
    ├─► frontend-vercel   ──► own learnings/
    ├─► ui-ux
    ├─► api
    ├─► seo
    ├─► content-market
    ├─► ci-devops
    ├─► agent-os
    └─► backend-express   (if backend/ exists)
```

## Package layout (every domain)

```text
.agents/domains/<id>/
  AGENT.md
  SYSTEM_PROMPT.md
  metadata.json
  state.json                 # live status + counters
  rules/
  skills/
  learnings/
    errors.json              # machine errors
    successes.json           # machine successes
    ERRORS.md / ERRORS_INDEX.md
    SUCCESSES.md
    PREVENTION.md
```

## Turso

| Local | Turso table |
|-------|-------------|
| `state.json` | `domain_agent_state` |
| `errors.json` / `successes.json` | `domain_events` (kind=error\|success) |
| errors also mirrored | `learn_lessons` category `domain:<id>` |

```bash
npm run domain:sync -- api     # push one
npm run domain:sync -- all     # push all
npm run domain:pull -- all     # pull Turso → local
```

`learn-pipeline` runs **domain:sync all** after skill evolve/evaluate.

## Commands

```bash
npm run domain:list
npm run domain:status -- api
npm run domain:error -- api --title "…" --error "…"
npm run domain:success -- api --title "…" --detail "…"
npm run domain:state -- api --set status=working --set last_task="leads"
npm run domain:sync -- all
npm run domain:route -- src/app/api/leads/route.ts
npm run domain:enforce -- api --files …
npm run domain:compile -- all
```

## Adding a domain

1. Add entry to `REGISTRY.json` with `allow_globs` / `deny_globs` / `mcps` / `skills`.
2. `npm run domain:scaffold`
3. Add rules under `rules/`
4. `npm run domain:compile -- <id>`
