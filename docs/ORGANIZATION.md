> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[INDEX.md]]
> *   **Relative Path:** [INDEX.md](../../obsidian-vault/wiki/INDEX.md)
> *   **Absolute Path:** [INDEX.md](file:///C:/Users/Johnny%20Cage/DEV/obsidian-vault/wiki/INDEX.md)

# Repository Organization

> Brain routing note: repository organization should route through `../AGENTS.md`, `../../AGENTS.md`, `../../context.md`, and `../../business_vault/vault_index.md` before broad filesystem search.

## 🔀 Branching Guidelines

All work must be executed in isolated branches. Commit directly to `main` is strictly prohibited unless specifically instructed by the repository owner. Use the following branch prefixes:

- `feat/`: For implementing user-facing features, page templates, and calculator logic.
- `fix/`: For styling repairs, type corrections, sitemap errors, or performance optimizations.
- `docs/`: For editing operating manuals, context maps, and wiki integrations.
- `chore/`: For updating package locks, config tweaks, script changes, and testing structures.
- `ci/`: For edits to GitHub Actions workflow scripts.

## 📋 Pull Request Submission & Template

All pull requests targeting `main` or `develop` must use this strict description template. Do not submit bare PRs.

```markdown
# Goal Description
[Describe what problem this PR solves and the engineering changes introduced.]

# Associated Issues / Tasks
- Closes #[Issue Number]

# Verification Checklist
- [ ] TypeScript compilation check passes (`npm run lint`)
- [ ] Unit and architecture tests pass (`npm test`)
- [ ] Static build and prerendering build compile successfully (`npm run build`)

# Modified Files
- `src/...`
- `docs/...`

# Visual Screenshots / Screen Recording
[Provide before/after images or absolute path to browser subagent mp4/webm/webp records for any UX or layout modifications.]
```

## 🚥 PR Quality & Merging Gates

A pull request can only be merged if it meets the following strict criteria:
1. **CI Pipeline Pass**: The continuous integration suite runs on all open PRs and must return a clean, green checkmark.
2. **Zero Schema/Type Warnings**: Build logs must not show compiler warnings, unresolved imports, or typescript exceptions.
3. **Owner Approval**: Direct sign-off from Johnny Cage is required for merges to `main`.

