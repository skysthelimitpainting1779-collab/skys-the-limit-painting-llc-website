# AGENTS.md // Website operating manual

This repository is the execution surface for the Sky's the Limit Painting LLC website. Use the workspace brain, graph reports, and wiki before opening source files.

## Operating order

Follow this order on every task:

1. Read the relevant wiki summary first
2. Read the project graph report next
3. Open only the source files needed for the change
4. Make the smallest coherent edit
5. Verify with the matching command set
6. Refresh the graph and wiki when code or knowledge changes

Use these sources before broad file searches:

- **Central LLM Wiki**: `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\INDEX.md`
- **Project graph report**: `C:\Users\Johnny Cage\DEV\skysthelimit-collab\graphify-out\GRAPH_REPORT.md`
- **Master DEV graph**: `C:\Users\Johnny Cage\DEV\graphify-out\GRAPH_REPORT.md`

Do not scan the whole repository recursively unless the graph and wiki cannot locate the target.

## Google Open Knowledge standard

Treat Google Open Knowledge work as structured entity work, not keyword stuffing. Every public page should help Google understand the business, service, place, proof, and canonical URL.

Use these rules for schema and search changes:

- Use JSON-LD with `https://schema.org` vocabulary
- Follow Google Search Central as the source of truth for Google behavior
- Keep structured data limited to facts visible to visitors on the same page
- Connect related entities with stable `@id` values
- Mark the business as a local service entity with `LocalBusiness` or a more specific eligible subtype when supported
- Include page-specific `BreadcrumbList` data on routed pages
- Keep `name`, `url`, `telephone`, `image`, `address`, `geo`, `areaServed`, `openingHoursSpecification`, and service relationships consistent across pages
- Do not add fake ratings, reviews, certifications, licenses, awards, or service areas
- Validate schema with Google Rich Results Test before release when structured data changes
- Add new routes to `scripts/generate-sitemap.js` and `scripts/prerender.mjs`
- Keep canonical URLs unique; avoid duplicate pages competing for the same intent

Reference docs:

- Google structured data introduction: `https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data`
- Google structured data guidelines: `https://developers.google.com/search/docs/appearance/structured-data/sd-policies`
- Google LocalBusiness structured data: `https://developers.google.com/search/docs/appearance/structured-data/local-business`
- Google SEO starter guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`

## Verification

Run the narrowest useful verification first, then broaden when the change touches shared behavior.

- **Type and lint check**: `npm run lint`
- **Unit and integration tests**: `npm test`
- **Production build and prerender**: `npm run build`

Run all three before pushing, opening a pull request, or deploying.

## Graph and wiki freshness

After codebase changes or wiki updates, run the DEV compiler:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Johnny Cage\DEV\compile-all.ps1"
```

To update or query the project graph directly using the official Graphify CLI:

- **AST-only local update (fast/free):** `graphify update .`
- **Full semantic extraction (LLM-based):** `graphify extract . --backend gemini`
- **Re-run clustering & report generation:** `graphify cluster-only .`
- **Query the graph structure:** `graphify query "question"`

Keep the wiki interlinked:

- Every entity gets a page
- Every page links back to `INDEX.md` within two hops
- Every factual code or architecture claim cites a path or evidence ID
- Every page ends with `*Last sync: YYYY-MM-DD*` plus the allowed DNA marker in markdown

## Deployment and infrastructure

Do not push or deploy until verification passes.

- Manage production secrets only in Vercel environment variables
- Never commit `.env` files or live credentials
- Use non-interactive CLI flags for setup and deployment commands
- Prefer Vercel CLI or the Vercel MCP server for Vercel work
- Prefer Supabase MCP tooling for Supabase work

## Branches and pull requests

Use descriptive branches:

- `feat/...` for features and layouts
- `fix/...` for bugs, contrast issues, or type repairs
- `chore/...` for maintenance
- `docs/...` for documentation and wiki work

Every production pull request must state:

- Goal
- Files changed
- Validation results
- Search or schema impact, when relevant

## Task management

For complex changes, update `implementation_plan.md` before editing and keep `task.md` current with:

- `[ ]` not started
- `[/]` in progress
- `[x]` complete

## Design and content safeguards

Use the existing design system and claim guardrails.

- Keep colors tied to HSL palettes in `index.css`
- Use Dark Charcoal `#050505` text on Safety Orange `#FF5A00`
- Never use white text on Safety Orange
- Do not add emoji to source code, components, or markup
- The DNA emoji is allowed only in markdown documentation
- Do not claim licensed, bonded, certified, fully insured, government-approved, or award-winning status unless source evidence exists
- Do not publish fake reviews, fake ratings, fake project counts, or inflated service coverage

## External research

Search the web or use the correct domain skill when information can change or comes from external docs. Do not guess API parameters, dependency behavior, Google requirements, Vercel settings, Supabase settings, or current platform rules.
