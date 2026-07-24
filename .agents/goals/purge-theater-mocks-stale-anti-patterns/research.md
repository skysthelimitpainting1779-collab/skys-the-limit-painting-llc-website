# Research — purge theater / mocks / stale / anti-patterns

## Primary kill targets (executed)

| Class | Paths |
|-------|--------|
| Product theater | HeatmapOverlay, SpecInspector, CustomCursor, Layout.tsx (react-router SPA), PageMeta, TrustAnchors, market view stubs |
| Hard anti-pattern | `next/dynamic` + `ssr:false` in `src/app/layout.tsx` |
| Broken API | `/api/memory` + `memory-harness.js` (no memory graph) |
| Dead SPA pipeline | `scripts/prerender.mjs`, ops/memory/cron harnesses, domain-agent |
| Dead deps | react-router-dom, express, workflow, design packages knip was ignoring |
| Stale docs | context.md maps, docs/AGENT_OS.md domain novels |

## Keep (real)

- App Router `src/app/**`, MarketPage, leads/portal/admin, convert chrome
- goal / ship-eval / zero-theater / host:compile / active-prevention
- skills keep-list + specialists.json

## Risk deferred

- Full gut of `agent-os.js` (3k LOC still references queues in source) — CI no longer bootstraps it; on-disk theater banned by tests
