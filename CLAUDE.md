# CLAUDE.md // skysthelimit-collab — Project Operating Manual

## 🧠 Token-Saving Protocol (Read This First)
This project is part of the Johnny Cage DEV workspace with a **compounding knowledge base**.
Follow this order — stop as soon as your question is answered:

1. **Central Wiki** (fastest — pre-compiled summaries)
   Path: `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki`
   Start at: `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\INDEX.md`
   Read the YAML `summary:` field of pages before opening full files.

2. **Project Graph Report** (structural map of THIS repo)
   Path: `C:\Users\Johnny Cage\DEV\skysthelimit-collab\graphify-out\GRAPH_REPORT.md`
   Use for: function/class locations, community clusters, god nodes.

3. **Master DEV Graph** (cross-project relationships)
   Path: `C:\Users\Johnny Cage\DEV\graphify-out\GRAPH_REPORT.md`
   Use for: how this project connects to IronClad, MEMORY_GH, etc.

4. **Targeted File Read** (last resort)
   Only open specific files after narrowing down via steps 1–3.
   Never scan entire directories recursively.

## 🔄 Keeping the Graph Fresh
After code changes, run from the DEV root:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\Johnny Cage\DEV\compile-all.ps1"
```

## 📖 Central Wiki Index
All entities (projects, systems, tools, people) have a dedicated wiki page.
- IronClad → `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\IronClad.md`
- Landing Page → `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\Johnny Cage Landing Page.md`
- Architecture → `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\Landing Page Architecture.md`
- Territory Lock → `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\Territory Lock.md`
- Simulation Daemons → `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\Simulation Daemons.md`
- Revenue Leak → `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\Revenue Leak.md`

## 🛠️ Code Verification Commands
Always verify code quality locally before opening PRs or merging changes:
- **Type Compilation Check**: `npm run lint` (compiles TypeScript via `tsc --noEmit`)
- **Unit and Integration Tests**: `npm test` (runs standard Node test suite in `tests/`)
- **Production Build and Static Prerender**: `npm run build` (builds distribution, prerenders routes, generates dynamic sitemaps, and validates JSON-LD schemas)

## 🚀 Deployments & CI/CD Protocol
- **Verification Gate**: Never push code or deploy to Vercel without first ensuring `npm run lint`, `npm test`, and `npm run build` pass with zero failures.
- **Route Additions**: Any new static or dynamic route must be added to `scripts/generate-sitemap.js` (for Google indexation) and `scripts/prerender.mjs` (for static compiler caching) before deploying.
- **Secrets Management**: Live API keys and webhook secrets must be managed strictly inside Vercel's Environment Variables panel. Never commit `.env` or plain configurations to git.

## 🔀 Pull Request (PR) & Branching Guidelines
- **Branch Naming**: Keep branches descriptive and prefix them based on the task:
  - `feat/...` for user features and new layouts.
  - `fix/...` for bugs, contrast issues, or type repairs.
  - `chore/...` or `docs/...` for maintenance, documentation, or script updates.
- **Pull Requests**:
  - Open a pull request for all production modifications.
  - PR descriptions must state the exact goal of the change, validation results (list passing test suites), and a checklist of files modified.
  - No pull request should be merged without successful CI/CD checks (linting, tests, build).

## 📋 Issue & Task Management
- **Implementation Planning**: For complex changes, draft or update the `implementation_plan.md` artifact in the brain folder and wait for approval before beginning execution.
- **Task Tracking**: Track current items dynamically inside the `task.md` checklist using `[ ]`, `[/]` (in progress), and `[x]` (completed) states.
- **Design Safeguards**:
  - Keep colors tied to HSL palettes inside `index.css`. Avoid adding ad-hoc color classes.
  - Confirm WCAG AA contrast compliance: safety orange (`#FF5A00`) surfaces must use dark charcoal text (`#050505`), never white text.
  - Emojis in source code/markup are strictly BANNED (except the DNA emoji `🧬` in markdown docs).
