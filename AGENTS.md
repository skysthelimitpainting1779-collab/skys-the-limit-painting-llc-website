# AGENTS.md // Website Operating & Developer Manual

The website is an execution surface under the workspace brain. Do not treat this repository as a separate operating system.

## 🧠 Token-Saving & Graph-Querying Protocol
To maintain maximum efficiency and avoid context bloat:
1. **Central LLM Wiki** (Fastest - read pre-compiled summaries):
   - Path: `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki`
   - Start at: `C:\Users\Johnny Cage\DEV\obsidian-vault\wiki\INDEX.md`
   - Read the YAML `summary:` or top sections of wiki pages before reading full code files.
2. **Project Graph Report** (Structural map of THIS repo):
   - Path: `C:\Users\Johnny Cage\DEV\skysthelimit-collab\graphify-out\GRAPH_REPORT.md`
   - Use to locate functions, classes, components, and determine import dependency flows.
3. **Master DEV Graph** (Cross-project relationships):
   - Path: `C:\Users\Johnny Cage\DEV\graphify-out\GRAPH_REPORT.md`
   - Use to see relationships across projects (e.g. IronClad, MEMORY_GH).
4. **Targeted File Reads**: Only open specific files after narrowing down locations via the graph or wiki. Never scan entire directories recursively.

## 🔄 Keeping the Graph & LLM Wiki Fresh
After making codebase changes or wiki updates:
- Run from the DEV root to compile everything:
  ```powershell
  powershell -ExecutionPolicy Bypass -File "C:\Users\Johnny Cage\DEV\compile-all.ps1"
  ```
- Keep the wiki interlinked: Every entity gets a page, and every page must link back to INDEX.md and related pages.

## 🛠️ Code Verification Commands
Run these locally before submitting pull requests or deploying:
- **Type Compilation Check**: `npm run lint` (runs `tsc --noEmit` and ESLint checks)
- **Unit and Integration Tests**: `npm test` (runs standard test suite in `tests/`)
- **Production Build and Static Prerender**: `npm run build` (builds distribution, prerenders pages, generates dynamic sitemaps, and validates schemas)

## 🚀 Deployments & CI/CD Protocol
- **Verification Gate**: Never push code or deploy without first ensuring lint, test, and build commands pass.
- **Route Additions**: Any new route must be added to `scripts/generate-sitemap.js` (for Google indexing) and `scripts/prerender.mjs` (for static compiler caching).
- **Secrets Management**: Live API keys/secrets must be managed strictly inside Vercel's Environment Variables panel. Never commit `.env` files.

## 🔀 Pull Request (PR) & Branching Guidelines
- **Branch Naming**: Keep branches descriptive and prefixed:
  - `feat/...` for features and layouts.
  - `fix/...` for bugs, contrast issues, or type repairs.
  - `chore/...` or `docs/...` for maintenance or documentation updates.
- **Pull Requests**: Open a PR for all production modifications, stating the goal, validation results, and modified files.

## 📋 Issue & Task Management
- **Implementation Planning**: For complex changes, draft/update `implementation_plan.md` in the brain folder and obtain approval.
- **Task Tracking**: Track current items dynamically inside the `task.md` checklist using `[ ]`, `[/]` (in progress), and `[x]` (completed) states.
- **Design Safeguards**:
  - Keep colors tied to HSL palettes inside `index.css`. Avoid ad-hoc color classes.
  - **Contrast Safety Warning**: Safety Orange (`#FF5A00`) surfaces must use Dark Charcoal (`#050505`) text to satisfy WCAG AA contrast compliance. White text on safety orange is strictly banned.
  - **Emoji Ban**: Emojis in source code/components/markup are strictly BANNED (except the DNA emoji `🧬` in markdown documentation).
