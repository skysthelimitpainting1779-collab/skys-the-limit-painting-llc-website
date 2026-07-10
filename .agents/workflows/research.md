# Research Workflow

Status: **active** (thin entry — prefer Architecture loop for decisions).

## When to use which

| Need | Workflow |
|------|----------|
| Topology / platform / stack **decision** + plan + handoff | **Architecture loop** — `.agents/workflows/architecture-loop.md` · skill `architecture-loop` · `npm run arch:loop` |
| Quick fact lookup (no lock/plan) | Graph query + 1–3 sources; no durable plan required |
| After failure | Learning loop (`learn` / domain:error) |

## Research inside Architecture loop (Phase 1)

1. **T0** repo SSOT (`STACK.md`, existing plan, config files)  
2. **T1** Vercel plugin skills (`knowledge-update` first for platform)  
3. **T2** live changelog/docs (date-stamp)  
4. **T3** vendor product docs  
5. Capture **evidence IDs** `E1…` — no bulk wiki/GRAPH_REPORT  

Full phases (validate → pressure → lock → prompt): see **architecture-loop**.
