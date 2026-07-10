---
type: workflow
title: Architecture loop (RVPLP+)
description: Research → validate → plan → pressure-test → lock → codify → prompt → close. Hardens platform/product decisions before code.
tags: [workflow, architecture, research, plan, handoff]
version: 1.0.0
---

# Architecture loop (improved)

**Skill:** `.agents/skills/architecture-loop/SKILL.md`  
**Scaffold:** `npm run arch:loop -- init --slug <name> --title "..."`  
**Instance example:** `docs/ARCHITECTURE_CMS_LOOP.md` (Payload v2)

Use for **topology / platform / stack** decisions (CMS host, auth split, Docker vs native, multi-service, DB choice).  
Do **not** use for pure bugfixes or UI polish — use the **execution loop** instead.

## Improved spine (vs ad-hoc research→plan)

```text
0 FRAME
1 RESEARCH     (tiered sources + dated evidence IDs)
2 VALIDATE     (claim → repo/platform fact matrix)
3 DRAFT        (plan v1, soft locks only)
4 PRESSURE     (adversarial pass — NEW)
5 LOCK         (hard locks + non-goals + re-open triggers)
6 CODIFY       (plan vN, STACK/SSOT, legacy pointers)
7 PROMPT       (implementer system prompt + exit criteria)
8 CLOSE        (domain success, stop re-researching)
        │
        └─ re-enter only if a RE-OPEN trigger fires
```

**Hard rule:** At most **one** full loop per decision before implement, unless a documented re-open trigger fires. No research theater.

---

## Phase 0 — FRAME

| Capture | Example |
|---------|---------|
| Decision question | “Where does marketing CMS live on Vercel 2026?” |
| Goal kind | code-change / infrastructure / policy |
| Constraints | one project, Fluid, portal stays Supabase |
| Non-goals (seed) | multi-tenant, Convex full move |
| Success metric | shippable admin + public read + no portal regression |
| Budget | time / token / max sources |
| Authority | Vercel plugin > STACK > plan > model prior |
| Domain owners | content-market, ci-devops, frontend-vercel |

**Exit:** one-sentence decision question + authority order written.

---

## Phase 1 — RESEARCH

**Tiered sources (stop early when tiers agree):**

| Tier | What | Tools |
|------|------|--------|
| T0 | Repo SSOT | `STACK.md`, plan, `vercel.ts`, proxy, graph query |
| T1 | Platform plugin | `knowledge-update`, env-vars, deployments-cicd, next-cache |
| T2 | Live platform | vercel.com/changelog, docs (date-stamp) |
| T3 | Vendor product | Payload/Supabase/etc. deploy docs |
| T4 | Community | only if T0–T3 conflict |

**Evidence ledger** (keep short):

```text
E1 [date] source — claim
E2 ...
```

**Exit:** ≥3 evidence IDs relevant to the decision; no bulk wiki dump.

---

## Phase 2 — VALIDATE

Build a **claim matrix**:

| Claim from research/plan | Repo / platform fact | Verdict |
|--------------------------|----------------------|---------|
| … | file:line or changelog URL | keep / fix / kill |

Must open real files for routing, config, auth, existing fallbacks.  
Must note **collisions** (e.g. `/admin` vs CMS path).

**Exit:** every soft assumption either validated or marked `OPEN-RISK`.

---

## Phase 3 — DRAFT

Write or update plan **v1**:

- Options considered + why rejected
- Soft locks (prefer X)
- Topology sketch
- Phases + acceptance criteria
- Risks (unranked OK)

**Exit:** plan exists; implementer could start but should not yet.

---

## Phase 4 — PRESSURE (required improvement)

Adversarial pass — answer in writing:

1. **Cost** — Active CPU, DB connections, media egress  
2. **Security** — secrets, CSP, proxy matchers, preview vs prod  
3. **Ops** — cold start, scale-to-zero vs stateful, migrations  
4. **Platform drift** — what changelog items change the answer?  
5. **Reverse options** — what would make the loser win?  
6. **Failure mode** — first production break and mitigation  

**Exit:** pressure notes captured; at least one plan change from pressure (or explicit “no change, because…”).

---

## Phase 5 — LOCK

Promote soft → hard only with evidence:

| Lock | Value | Evidence |
|------|-------|----------|
| … | … | E# |

Also write:

- **Non-goals** (v1)
- **Re-open triggers** (platform/product events that justify a new loop)
- **Env matrix** if secrets involved

**Exit:** locks table complete; no “pick later” on load-bearing choices.

---

## Phase 6 — CODIFY

Update durable artifacts (only what changed):

| Artifact | When |
|----------|------|
| `docs/*_PLAN.md` | always (bump version) |
| handoff `docs/HANDOFF_*.md` | always |
| `.agents/STACK.md` | topology / platform rules |
| legacy docs pointers | deprecations |
| loop run record | `docs/architecture/` or `docs/ARCHITECTURE_*_LOOP.md` |

**Exit:** SSOT agrees with locks; no contradictory diagrams.

---

## Phase 7 — PROMPT

Write implementer **system prompt** block:

- Locked decisions (numbered)
- Minimum shippable
- Do / don’t
- Verify commands
- Explicit: **do not re-litigate locks**

**Exit:** pasteable prompt ≤ ~40 lines + pointer to full plan.

---

## Phase 8 — CLOSE

```bash
npm run domain:success -- <domain> --title "arch-loop: <slug>" --detail "locks: …"
# optional if surprises:
# node scripts/learning-loop.mjs record ...
```

Mark status: **approved-for-implement**.  
Next agent runs **execution loop**, not architecture loop.

---

## Anti-patterns

| Bad | Good |
|-----|------|
| Endless option shopping | One loop → lock → implement |
| Changelog tourism without repo check | Validate against `vercel.ts` / proxy / STACK |
| Soft “pick later” on media/DB/path | Phase 5 hard locks |
| Plan without handoff prompt | Phase 7 required |
| Re-research on implement day | Only re-open triggers |
| Bulk wiki / GRAPH_REPORT | Graph query budgeted |

---

## When to skip

- Single-file bugfix with known root cause  
- Copy/CSS only  
- Follow-through on already **approved-for-implement** plan  

---

## Relation to other loops

| Loop | Role |
|------|------|
| **Architecture** (this) | Decide *what* topology / locks |
| **Execution** | Build under locks |
| **Learning** | Failures → lessons |
| **Proactive** | Health / improve queue |
