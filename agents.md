---
type: policy
title: Agents entrypoint (repo root)
description: Root pointer so all IDEs/CLIs that look for AGENTS.md load the ontology kernel.
tags: [agents, ontology, entrypoint]
---

# Agents

**Product slug:** `skysthelimit` · **Task hub:** [Linear](https://linear.app/skysthelimit)  
**Agent OS overview:** [`docs/AGENT_OS.md`](docs/AGENT_OS.md)  
**Canonical kernel:** [`.agents/AGENTS.md`](.agents/AGENTS.md)  
**Full ontology:** [`.agents/ONTOLOGY.md`](.agents/ONTOLOGY.md)  
**Stack:** [`.agents/STACK.md`](.agents/STACK.md) · **Naming:** [`docs/NAMING.md`](docs/NAMING.md)  
**Health:** `npm run agentos:health`

All coding agents (Cursor, Claude Code, Gemini, Grok, Codex, CI) **must** follow the ontology:

1. Load kernel only — not dumps  
2. Route work to **domain agents** (`npm run domain:route` / `domain:prompt`)  
3. `npm run graph:query -- "<task>"` before bulk explore  
4. Learn on failure **in that domain's** `learnings/`; never invent git→skills  
5. Never recreate archives or edit outside jurisdiction  
6. Prefer Linear issues (`SKY-XX`) for product work — not GitHub Issues  
7. **Root cause only** — never treat symptoms (`.agents/governance/ROOT_CAUSE.md`, iron law 12)  

**Layers:** Linear manages tasks · Agent OS runs agents · Git/Vercel ship product.

See `.agents/AGENTS.md` + `.agents/domains/README.md` + `docs/AGENT_OS.md`.

**CMS (next):** Payload 3 — [`docs/PAYLOAD_CMS_PLAN.md`](docs/PAYLOAD_CMS_PLAN.md) · handoff [`docs/HANDOFF_PAYLOAD_CMS.md`](docs/HANDOFF_PAYLOAD_CMS.md).  
**Portal:** Supabase OAuth `/portal` (unchanged by Payload).
