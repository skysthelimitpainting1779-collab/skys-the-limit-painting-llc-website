## [ERR-20260629-005] Next.js Dynamic Server Error during build (`cookies` usage in SSG)

**Logged**: 2026-06-29T13:00:00-07:00
**Priority**: high
**Status**: resolved
**Area**: frontend / nextjs

### Summary [ERR-20260629-005]

During `npm run build`, Next.js failed to statically render a page (e.g., `/projects`) and threw a `Dynamic server usage` error. This happened because the server-side code invoked `cookies()` (typically inside the Supabase `@supabase/ssr` `createServerClient` helper) to authenticate the request. Using cookies automatically opts the route into dynamic rendering, which breaks static generation.

### Error [ERR-20260629-005]

```text
Dynamic server usage: Route /projects couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
```

### Fix / Learning [ERR-20260629-005]

If a page needs to be statically generated at build time (SSG), it cannot access user-specific data like cookies. Use a dedicated, anonymous Supabase client (`@supabase/supabase-js` without cookie management) for fetching public database content during `generateStaticParams` and SSG rendering.

### Prevention Rule

**NO COOKIES IN SSG.** Never use `createServerClient` from `@supabase/ssr` or call `cookies()` inside pages or components that are intended to be fully statically generated. Create a secondary helper function `getPublicSupabase()` using raw `@supabase/supabase-js` for build-time public data fetches.

---

## [ERR-20260629-006] Supabase CLI Migration History Divergence

**Logged**: 2026-06-29T13:00:00-07:00
**Priority**: medium
**Status**: resolved
**Area**: backend / db

### Summary [ERR-20260629-006]

Running database migrations or `supabase db push` failed due to an error stating the local migration history table is out of sync or corrupted.

### Error [ERR-20260629-006]

```text
Make sure your local git repo is up-to-date. If the error persists, try repairing the migration history table
```

### Fix / Learning [ERR-20260629-006]

This happens when a migration is manually applied outside the CLI or if a `git rebase` alters migration files. The CLI's internal tracking table (`supabase_migrations.schema_migrations`) drifts from the local `/supabase/migrations` folder.

### Prevention Rule

**REPAIR DB HISTORY.** If the Supabase CLI throws a migration history error, run `supabase migration list` to identify the missing/drifted versions, and use `supabase db repair <version> --status applied` (or `reverted`) to explicitly synchronize the CLI's internal tracking table without applying destructive DDL changes.
