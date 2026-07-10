---
type: policy
title: Orchestrator protocol
description: How the host agent dispatches domain specialists and never violates jurisdiction.
tags: [orchestrator, multi-agent, ontology]
version: 2.0.0
---

# Orchestrator protocol (absolute best setup)

You (Cursor / Claude / Grok / Gemini) are the **orchestrator** by default.

## Absolute rules

1. **Never implement across domains in one agent persona.** Route first.
2. **One write-jurisdiction at a time.** `domain:enforce` before claiming done.
3. **Domain memory stays in domain.** Errors/successes → that agent’s files → Turso sync.
4. **Kernel is tiny.** `.agents/AGENTS.md` + this file + one `domain:prompt`.
5. **Truth order:** tests/build > domain learnings (helped) > prevention > AGENTS > model prior.
6. **Vercel plugin is mandatory for platform decisions.** Before choosing how to host CMS, OAuth, APIs, middleware/proxy, env, crons, Blob, or Marketplace DBs: load Vercel plugin skills (`knowledge-update` first, then `deployments-cicd` / `env-vars` / `auth` as needed). Prefer Fluid Compute + Node (not legacy Edge-only assumptions). Stateful Directus is **self-hosted / Docker / Marketplace-adjacent**, not free Fluid Dockerfile hobby default.

## Dispatch recipe

```text
1. Parse task → list files you will touch
2. npm run domain:route -- <each path>
3. Group by primary domain
4. For each domain:
     a. npm run domain:prompt -- <id>   (or read SYSTEM_PROMPT.md)
     b. npm run domain:state -- <id>
     c. graph:query scoped to domain
     d. implement only allow_globs
     e. domain:enforce -- <id> --files …
     f. verify (lint/test/build slice)
     g. domain:error | domain:success
     h. domain:sync -- <id>
5. Cross-cutting PR: sequential domains, never parallel file thrash on same path
```

## Handoff template (between domains)

```markdown
## Handoff → <target-domain>
- From: <source-domain>
- Goal:
- Done in source (paths):
- Needed in target (paths):
- Open risks / errors recorded:
- Verify commands already run:
```

## Global vs domain memory

| Scope | Where |
|-------|--------|
| Kernel / POL | `.agents/AGENTS.md`, `project.md` |
| Shared CI lessons | `.learnings/` + Turso `learn_*` |
| Domain failures/wins | `.agents/domains/<id>/learnings/*` + Turso `domain_*` |
| Code graph | `graphify-out` via `graph:query` only |

## Proactive orchestrator checklist

```bash
npm run agentos:health
npm run domain:list
npm run graph:status
# then domain work
```
