---
type: goal
slug: purge-theater-mocks-stale-anti-patterns
title: "purge theater mocks stale anti-patterns"
status: active
phase: implement
created: 2026-07-10T10:09:53.167Z
---

# GOAL: purge theater mocks stale anti-patterns

## Success criteria (verifiable)

- [x] Product theater removed: CustomCursor, HeatmapOverlay, SpecInspector, Layout.tsx, PageMeta, TrustAnchors, market view stubs
- [x] No `next/dynamic` + `ssr:false` in `src/app/layout.tsx`
- [x] Broken `/api/memory` + memory harness deleted
- [x] Vite prerender.mjs, ops/mock harnesses, domain-agent deleted
- [x] Dead deps removed (react-router-dom, express, workflow, unused design pkgs)
- [x] Tests rewired to App Router; `npm test` green
- [x] CI does not bootstrap agent-os theater dirs
- [x] `npm run goal:verify` green

## Loop

1. Research → `research.md`
2. Plan → `plan.md`
3. Implement → code + tests
4. Done → only after verify
