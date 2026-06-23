# AGENTS.md // Website operating manual

This repository is the execution surface for the Sky's the Limit Painting LLC website. Use the workspace brain, graph reports, and wiki before opening source files.

## MANDATORY: Read full rules before any task

**This file is auto-loaded. Before doing any work, you MUST also read:**

- **Full project rules**: `.agents/rules.md` — shell protocols, error learning mandate, design tokens, legal constraints, Agent OS doctrine
- **Central LLM Wiki**: `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\INDEX.md`
- **Project graph report**: `C:\Users\Johnny Cage\DEV\skysthelimit-collab\graphify-out\GRAPH_REPORT.md`

Do not scan the whole repository recursively unless the graph and wiki cannot locate the target.

---

## Operating order

Follow this order on every task:

1. Read `.agents/rules.md` for full operating rules
2. Read the relevant wiki summary
3. Read the project graph report
4. Open only the source files needed for the change
5. Make the smallest coherent edit
6. Verify with the matching command set
7. Refresh the graph and wiki when code or knowledge changes

---

## Shell execution

All npm and Node tasks on this Windows machine require the PowerShell execution-policy bypass:

- **Lint**: `powershell -ExecutionPolicy Bypass -Command "npm run lint"`
- **Tests**: `powershell -ExecutionPolicy Bypass -Command "npm test"`
- **Build**: `powershell -ExecutionPolicy Bypass -Command "npm run build"`

For pipelines with variables or complex quoting, write a `scratch/*.ps1` file and run it with `powershell -ExecutionPolicy Bypass -File scratch/myscript.ps1`. Never pass values to PowerShell switch parameters.

---

## Mandatory error learning

When any command fails or returns a non-zero exit code, **stop and log it** before continuing:

1. Identify the exact root cause
2. Append an `## [ERR-YYYYMMDD-NNN]` entry to `.learnings/ERRORS.md` with Summary, Error, Fix/Learning, and Metadata subsections
3. Include a `# CORRECT` and `# WRONG` code example
4. State a concrete prevention rule
5. Then resume the task

Do not move on from a failure without a logged entry. See `.agents/rules.md` Section 4 for the full protocol and format template.

---

## Verification

Run the narrowest useful verification first, then broaden when the change touches shared behavior.

- **Type and lint check**: `npm run lint`
- **Unit and integration tests**: `npm test`
- **Production build and prerender**: `npm run build`

Run all three before pushing, opening a pull request, or deploying.

---

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

---

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

---

## Design and content safeguards

Use the existing design system and claim guardrails.

- Keep colors tied to HSL palettes in `index.css`
- Use Dark Charcoal `#050505` text on Safety Orange `#FF5A00`
- Never use white text on Safety Orange
- Do not add emoji to source code, components, or markup
- The DNA emoji is allowed only in markdown documentation
- Do not claim licensed, bonded, certified, fully insured, government-approved, or award-winning status unless source evidence exists
- Do not publish fake reviews, fake ratings, fake project counts, or inflated service coverage

Contractor registration ID `IR816596` must appear near all contractor references. Under Minnesota Statute 176.041, owner-operator has zero payroll and is exempt from Workers' Compensation.

---

## Deployment and infrastructure

Do not push or deploy until verification passes.

- Manage production secrets only in Vercel environment variables
- Never commit `.env` files or live credentials
- Use non-interactive CLI flags for setup and deployment commands
- Prefer Vercel CLI or the Vercel MCP server for Vercel work
- Prefer Supabase MCP tooling for Supabase work

---

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

---

## Task management

For complex changes, update `implementation_plan.md` before editing and keep `task.md` current with:

- `[ ]` not started
- `[/]` in progress
- `[x]` complete

---

## External research

Search the web or use the correct domain skill when information can change or comes from external docs. Do not guess API parameters, dependency behavior, Google requirements, Vercel settings, Supabase settings, or current platform rules.

---

## AI Agent Crawlability and LLM Optimization Standard

Always optimize the website's architecture to support direct, lightweight, and high-density indexing by both traditional search engines (Google, Bing) and AI crawlers (Gemini, Claude, GPTBot).

### 1. Mandatory Server-Side Rendering (Server Components)
- All routed pages, dynamic routes, and SEO-critical layout components MUST remain strictly Next.js Server Components.
- Do NOT use the `"use client"` directive on pages. If interactive features (e.g., forms, sliders, custom cursors) are needed, encapsulate them inside dedicated leaf components and import them, keeping the main page shell completely server-side rendered.
- All HTML markup, metadata, and JSON-LD schemas MUST be fully baked and delivered in the initial server response.

### 2. Absolute Canonicalization
- Every route (static or dynamic) MUST declare a unique, absolute canonical alternate in its metadata.
- For dynamic routes (`/service-areas/[slug]` and `/painting-services/[slug]`), dynamically export the canonical URL inside `generateMetadata` using:
  ```typescript
  alternates: {
    canonical: `https://www.skysthelimitpaintingllc.com/service-areas/${slug}`,
  }
  ```

### 3. Server-Side Injected JSON-LD
- Do NOT rely on client-side JS to render structured data schemas; simple AI bots and search spiders skip execution.
- Inject schema.org JSON-LD scripts server-side directly inside Next.js Server Component pages.
- Standard schemas to export:
  - **Service Area Pages**: `localBusinessSchema` and `breadcrumbSchema` (Home -> Service Area -> Specific Area).
  - **Painting Service Pages**: `serviceSchema` and `breadcrumbSchema` (Home -> Capabilities -> Specific Service).
- Render script tags cleanly within a React fragment:
  ```typescript
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <LandingPageRoute ... />
    </>
  );
  ```

### 4. AI Crawler robots.txt Welcoming
- Maintain an advanced, welcoming `robots.txt` that explicitly welcomes AI crawlers and lists them with clear permissions.
- Explicitly welcome: `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-Web`, `Google-Extended`, `Gemini-Bot`, `Applebot-Extended`, `cohere-ai`, `PerplexityBot`, and `YouBot`.
- Include an explicit reference to the high-density `/llms.txt` manifest:
  ```text
  Link: https://www.skysthelimitpaintingllc.com/llms.txt
  ```

### 5. High-Density llms.txt Manifest
- Maintain a structured `public/llms.txt` file at the root.
- The manifest must contain absolute, qualified links to all active static and dynamic pages.
- Critical legal and licensing compliance (such as Contractor ID `IR816596` and MN Statute 176.041 owner-operator workers' compensation exemption) MUST be explicitly listed in the key metadata of `llms.txt`.

