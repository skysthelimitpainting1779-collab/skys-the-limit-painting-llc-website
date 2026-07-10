---
type: documentation
title: CLAUDE.md Developer & Agent Reference Guide
description: Quick reference linking to the canonical agents operating manual, domain taxonomy, commands, and project guidelines.
tags: [documentation, agent, reference, guidelines]
---

# CLAUDE.md // Developer & agent reference guide

## Operating manual

- **Kernel:** `.agents/AGENTS.md` (always-on rules, cold start)
- **Ontology:** `.agents/ONTOLOGY.md` (layers, entities, loops) — **mandatory for all agents**
- **Root pointer:** `AGENTS.md` → kernel
- **Health:** `npm run agentos:health` · **Improve:** `npm run agentos:improve` · **Purge:** hard-delete bloat
- **Vercel plugin:** mandatory for deploy/Fluid/env/OAuth-host/CMS-host decisions (`knowledge-update`, `deployments-cicd`, `env-vars`, …)
- Do **not** bulk-load wiki dumps or recreate archives.
- **Portal:** `docs/DIRECTUS_AND_PORTAL.md` · `/portal` OAuth (Supabase) — stays
- **CMS:** **Payload 3** next — `docs/PAYLOAD_CMS_PLAN.md` + `docs/HANDOFF_PAYLOAD_CMS.md` (Directus legacy)

## Domain Taxonomy

All components, concepts, and files MUST be semantically linked to one of the following root nodes in the graph:

- **Market**: (e.g., SEO, AI Crawlability, Target Audience)
- **Service**: (e.g., Commercial Painting, Residential, Specialized Coatings)
- **Business-Objective**: (e.g., Lead Capture, Revenue Generation, Conversion Optimization)
  Isolated technical nodes must be bridged to the nearest relevant business domain.

## Commands

- **Build project**: `npm run build`
- **Lint check**: `npm run lint`
- **Run tests**: `npm test`
- **Master compile**: `powershell -ExecutionPolicy Bypass -File "..\compile-all.ps1"`
- **Project graph query (first)**: `npm run graph:query -- "<question>"` — budgeted subgraph; do not dump wiki/GRAPH_REPORT
- **Project graph update**: `npm run graph:update` (or `graphify update .`)
