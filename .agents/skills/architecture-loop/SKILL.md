---
name: architecture-loop
description: >
  Run the improved architecture decision loop: frame → research → validate → draft →
  pressure-test → lock → codify → prompt → close. Use when choosing or hardening topology,
  platform stack, CMS host, Docker/Services vs native, auth split, DB/media strategy, or
  when the user says "architecture loop", "research validate plan", "harden the plan",
  "improve the plan", "lock the architecture", or "make a handoff prompt after research".
  Do not use for pure bugfixes or UI polish (use execution loop).
license: MIT
metadata:
  author: Sky's the Limit Painting LLC
  version: 1.0.0
  type: agent-skill
  tags: [architecture, research, plan, handoff, vercel, decision]
---

# Architecture loop skill

**Canonical workflow:** `.agents/workflows/architecture-loop.md`  
**Scaffold a run:** `npm run arch:loop -- init --slug <name> --title "..."`  
**Templates:** `templates/` in this skill folder  

## When to run

- New platform/topology decision (CMS, auth host, multi-service, container vs native)
- Existing plan is soft / “pick later” on load-bearing choices
- User wants research → validate → plan → improve → implementer prompt
- After major Vercel/changelog surface change that might reopen STACK

## When not to run

- Plan already `status: approved-for-implement` and no re-open trigger
- Bugfix, lint, tests, pure UI
- User asked to **implement** under locked plan → execution loop only

## Procedure (must complete all phases or document skip)

1. **FRAME** — decision question, constraints, budget, authority, domains  
2. **RESEARCH** — T0 repo → T1 plugin → T2 changelog/docs → T3 vendor; evidence IDs `E#`  
3. **VALIDATE** — claim matrix vs real files (`vercel.ts`, proxy, STACK, product paths)  
4. **DRAFT** — plan v1 soft locks  
5. **PRESSURE** — cost, security, ops, platform drift, reverse options, first failure  
6. **LOCK** — hard locks table + non-goals + re-open triggers + env matrix if needed  
7. **CODIFY** — plan vN, handoff, STACK if topology, legacy pointers, run record  
8. **PROMPT** — pasteable system prompt (do not re-litigate)  
9. **CLOSE** — `domain:success`, mark approved-for-implement  

Full phase gates: `.agents/workflows/architecture-loop.md`.

## Output contract

Minimum durable outputs:

| Output | Required |
|--------|----------|
| Plan doc with version bump + locks | yes |
| Handoff with system prompt block | yes |
| Loop run record (or section in plan “Improvement loop”) | yes |
| STACK update | if topology/platform rules changed |
| Domain success event | yes when closing |

## Quality bar (skill-evaluator style)

- Every hard lock cites evidence or repo fact  
- Pressure phase produced ≥1 plan change or explicit “no change”  
- Prompt forbids re-litigation  
- Re-open triggers listed  
- No dual `vercel.json` advice that fights STACK without ADR  

## Authority

1. Product code + tests  
2. Vercel plugin skills (platform)  
3. `.agents/STACK.md`  
4. This workflow  
5. Model prior  

## Example (done once)

Payload CMS 2026-07-09 → `docs/PAYLOAD_CMS_PLAN.md` v2, `docs/HANDOFF_PAYLOAD_CMS.md` v2, `.agents/STACK.md` v2, `docs/ARCHITECTURE_CMS_LOOP.md`.
