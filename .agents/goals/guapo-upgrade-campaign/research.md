# Research — Guapo Upgrade Campaign

## Graph query

```bash
npm run graph:query -- "Guapo Upgrade Campaign"
```

## Files / flows

- `src/app/HomeClient.tsx` is the primary homepage conversion experience. It owns the hero, first-scroll narrative, market routing, FAQ schema, and lead form.
- `src/data/markets.ts` supplies residential, commercial, and public-sector copy to their dedicated pages through `MarketPage`.
- `src/components/MarketPage.tsx` publishes `Service` and breadcrumb structured data for each market page.

## Risks

- Preserve the existing dark industrial visual language, radius-zero rule, and pre-existing worktree changes.
- Keep residential as the homepage default without removing commercial and public-sector credibility paths.
- Do not make unverified insurance, bonding, or performance claims.
