# Rate Limiting Logic

> 15 nodes · cohesion 0.18

## Key Concepts

- **throttle.mjs** (17 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **getMetricThrottle()** (5 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **resolveConcurrency()** (3 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **retryOnRateLimit()** (3 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **isRateLimited()** (2 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **parsePositiveIntEnv()** (2 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **resolveRateLimit()** (2 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **SemaphoreAbortError** (2 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **setDailyQuotaBlocked()** (2 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **utcMidnightAfter()** (2 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **dailyQuotaResult()** (1 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **defaultSleep()** (1 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **getDailyQuotaBlock()** (1 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **_resetMetricSemaphoreForTests()** (1 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`
- **.constructor()** (1 connections) — `.agents/skills/vercel-optimize/lib/throttle.mjs`

## Relationships

- [[Vercel Service Integration]] (4 shared connections)
- [[Vercel Hard Gates]] (2 shared connections)
- [[OData Query Utilities]] (1 shared connections)

## Source Files

- `.agents/skills/vercel-optimize/lib/throttle.mjs`

## Audit Trail

- EXTRACTED: 45 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*