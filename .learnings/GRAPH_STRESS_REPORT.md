---
type: report
title: Graphify stress test + wiki decision
tags: [graphify, stress-test, wiki, tokens]
at: 2026-07-09
---

# Graphify stress test + wiki decision

## Stress results (budgeted query)

| Test | Budget | Tokens | Nodes | Edges | ms | Truncated | Budget OK |
|------|-------:|-------:|------:|------:|---:|:---------:|:---------:|
| leads-api | 1500 | 556 | 16 | 13 | 2886 | no | yes |
| learn-pipeline | 1500 | 1179 | 38 | 18 | 2635 | yes | yes |
| entire-anti-fake | 1200 | 724 | 19 | 16 | 2804 | no | yes |
| ci-hooks | 1500 | 565 | 16 | 13 | 2632 | no | yes |
| seo-robots | 1000 | 810 | 30 | 13 | 2573 | yes | yes |
| next-dynamic | 1200 | 957 | 45 | 14 | 2561 | yes | yes |
| tiny-budget | 400 | 312 | 6 | 3 | 2855 | no | yes |
| wide-budget | 3000 | 2220 | 68 | 65 | 2602 | no | yes |

**vs dumps**

| Artifact | Size | ~Tokens if pasted |
|----------|-----:|------------------:|
| GRAPH_REPORT.md | 273 KB | ~68k |
| old .agents/wiki (108 files) | 231 KB | ~58k |
| single budgeted query | ~0.5–4 KB result | **312–2220** |

**Savings:** ~30–200× vs report/wiki dump for orientation queries. Budget caps work.

## Failures / quality gaps

| Issue | Detail |
|-------|--------|
| `path learn-pipeline → Turso` | No node match — graph **stale** (built 2026-07-08 before Turso/learn scripts) |
| `explain learn-pipeline` | No node match — same |
| Relevance noise | Hits often include `repomix-output.md` + vendor skills before `src/` |
| Labels | Many communities still named `Community N` |

**Fix path:** `npm run graph:update` regularly; exclude repomix from future full rebuilds; re-run `npm run graph:wiki`.

## Wiki decision

### Wipe old `.agents/wiki`? **YES**

- Auto-compiled **2026-06-24**, ~1.6k-node graph (stale).
- Agents never navigated it → pure bloat + OKF spam.
- **Done:** stubs moved to `.agents/wiki/_archive_auto_compiled_2026-07-09/`; only `README.md` policy remains.

### Regenerate with graphify? **YES — into `graphify-out/wiki`**

- Regenerated from live `graph.json` (**13 048 nodes · 390 communities · 401 pages**).
- Canonical index: `graphify-out/wiki/index.md`
- **Do not** re-copy into `.agents/wiki` (re-blooms custodian).

### Use model

```text
query (budget) → optional index.md → one community page → 1–3 sources
```

```bash
npm run graph:query -- "…"
npm run graph:wiki      # re-export community wiki after graph update
```
