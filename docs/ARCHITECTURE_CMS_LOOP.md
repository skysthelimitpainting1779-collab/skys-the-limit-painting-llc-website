---
type: architecture-loop-run
title: Payload CMS topology
slug: payload-cms
version: 1.1.0
date: 2026-07-09
status: approved-for-implement
---

# Architecture loop: Payload CMS topology

**Generic loop (improved):** [`.agents/workflows/architecture-loop.md`](../.agents/workflows/architecture-loop.md) · skill `architecture-loop` · `npm run arch:loop`  
**This file** is the first full instance of that loop (pre-scaffold path; future runs live under `docs/architecture/`).

## Loop spine used

```text
FRAME → RESEARCH → VALIDATE → DRAFT v1 → PRESSURE → LOCK → CODIFY → PROMPT → CLOSE
```

Improvements over naive “research then plan”:

- **Pressure** phase (cost, security, ops, Docker/Services drift)
- **Hard locks** with non-goals + re-open triggers
- **Implementer prompt** that forbids re-litigation
- **Close** → execute, do not re-research

---

## 0 FRAME

| Field | Value |
|-------|--------|
| Decision question | Where does marketing CMS live on Vercel Fluid 2026? |
| Constraints | One project; portal Supabase; Node 24; `vercel.ts` |
| Success metric | Admin + published `/projects` + no portal regression |
| Authority | Vercel plugin → STACK → plan → model |
| Domains | content-market, frontend-vercel, ci-devops |

## 1 RESEARCH (summary)

| ID | Source | Claim |
|----|--------|-------|
| E1 | knowledge-update | Fluid default, Node 24, no Vercel Postgres/KV, `vercel.ts` |
| E2 | vercel changelog/docs 2026-06/07 | Services, Dockerfile.vercel, VCR, Sandbox Docker, bindings — scale-to-zero Functions, not Compose VPS |
| E3 | Payload + Blob docs | Local API + Blob adapter fit Next on Fluid |
| E4 | STACK + repo | Directus not free always-on Fluid; `/admin` exists |

## 2 VALIDATE

| Claim | Fact | Verdict |
|-------|------|---------|
| One Next project | `vercel.ts`, STACK | keep |
| `/admin` free for CMS | `src/app/admin` + proxy `/admin` | kill → use `/cms` |
| Local disk media OK | Fluid ephemeral | kill → Blob |
| Directus container = easy CMS | scale-to-zero + state | kill as default |
| Convex as CMS | no admin UX | kill |

## 3–5 DRAFT → PRESSURE → LOCK

See plan v2 locks: Blob, pooler, `/cms`, cache tags, CSP, env matrix, Docker/Services non-goals.

## 6 CODIFY

| Artifact | Path |
|----------|------|
| Plan v2 | [`PAYLOAD_CMS_PLAN.md`](./PAYLOAD_CMS_PLAN.md) |
| Handoff v2 | [`HANDOFF_PAYLOAD_CMS.md`](./HANDOFF_PAYLOAD_CMS.md) |
| STACK v2 | [`.agents/STACK.md`](../.agents/STACK.md) |
| Legacy | [`DIRECTUS_AND_PORTAL.md`](./DIRECTUS_AND_PORTAL.md) |

## 7 PROMPT

Paste block in `HANDOFF_PAYLOAD_CMS.md` § System prompt.

## 8 CLOSE

- **Status:** approved-for-implement  
- **Next:** execution loop Phase 0–3 (implement Payload)  
- **Re-open only if:** `services` lands in `vercel.ts` policy change; Payload+cacheComponents breakage; container Functions needed for non-CMS workload  

Otherwise: **do not re-run architecture loop** for CMS.
