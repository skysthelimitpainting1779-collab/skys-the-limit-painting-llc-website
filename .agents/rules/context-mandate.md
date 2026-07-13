---
trigger: always_on
description: Mandates Context7 for every Vercel/Next.js/Supabase interaction, not just planning.
---

# Universal Context Mandate

To prevent architectural regressions, hallucinated API usage, and outdated library patterns, all agents MUST obey the following constraint.

## The Mandate

**For any interaction involving Vercel, Next.js, Supabase, or any external platform:**
query Context7 BEFORE writing config, CLI commands, or API calls — not just during planning.

**Mandatory trigger list — Context7 required before acting:**
- Any edit to `vercel.ts`, `vercel.json`, `next.config.ts`
- Any `vercel` CLI command or flag lookup
- Any `routes.header()`, `routes.cacheControl()`, or `ignoreCommand` usage
- Any Supabase Auth flow (OAuth, PKCE, callback, session cookies)
- Any `@vercel/analytics`, `@vercel/speed-insights`, `@vercel/edge-config` API usage
- Any implementation plan involving React, Next.js, Vercel, or Supabase

**Preferred library IDs:**
- Vercel deep search: `/llmstxt/vercel_llms_txt` (52K snippets)
- Vercel quicklook: `/websites/vercel` (20K snippets)
- Supabase: resolve via `resolve-library-id` with "supabase" + specific topic

## Steps
1. `resolve-library-id` with library name + specific question
2. `query-docs` with the best matching ID and the full question
3. Apply what the docs say — do not override with pre-trained weights

## Enforcement
Editing `vercel.ts` or any Vercel config without a prior Context7 call violates this mandate. The `[0ms]` build error and `routes.header should be array` failure in production are examples of what training-data drift causes.
