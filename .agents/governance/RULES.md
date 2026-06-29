
### Auto-Generated Rule based on failure at 2026-06-24T19:31:21.083Z
- **Triggering Error Context**: **Step Failed**: A: OKF Validator
- **Rule**: Always ensure YAML frontmatter has a `type`, `title`, and `timestamp` in Markdown files.

### Silent Wipe Prevention
- **Rule**: Never overwrite a file without checking its original line count. If the new output is more than 20% shorter than the original, you MUST flag it for human review in `.agents/approvals/` before saving.

### API Rate Limit Stalls
- **Rule**: Audit our API wrappers or MCP server configs. Ensure that on a 429 Error, the system pauses for 10 seconds, retries, and scales the wait time exponentially before throwing a hard failure.

### Anti-Laziness Protocol
- **Rule**: ANTI-LAZINESS PROTOCOL: When tasked with OKF compilation or synthesis, you are strictly forbidden from writing boilerplate, placeholders, or empty structural tags. You MUST use the read_file or search_codebase MCP tools to extract the raw facts, relationships, and context from the source data FIRST. Your synthesis must be a genuine, dense summarization of those specific facts. If you cannot find enough data to write a 30+ word synthesis, you must flag the node as 'Insufficient Data' in the ERRORS.md file rather than faking it.

### CI/CD Incident Override (CRITICAL PRIORITY — Interrupts All Lower-Priority Work)
- **Trigger**: A new file matching `.learnings/CI-INCIDENT-*.md` is detected in the working tree or is pulled from the remote branch.
- **Rule**: Upon detection of a CI-INCIDENT file, you MUST immediately:
  1. **Suspend** all pending and low-priority queue tasks (mark them `blocked` in the SQLite queue via `scripts/queue.js`).
  2. **Pull** the incident file and read its full contents — specifically the `## Error Summary` and `## Agent Repair Instructions` sections.
  3. **Reproduce** the failure locally by running the exact command that failed (e.g., `npm run lint`, `npm test`, `npm run build`).
  4. **Stage your fix** in `.agents/staging/` first — do NOT write directly to the live source until locally verified.
  5. **Verify locally**: Run the full validation chain (`npm run lint && npm test && npm run build`) to confirm the fix resolves the failure without introducing regressions.
  6. **Commit** the fix to the triggering branch with the message: `fix: autonomous CI repair for run [RUN_ID]` (substitute the run ID from the incident file metadata).
  7. **Delete** the incident file from `.learnings/` and commit its removal as part of the same patch or a follow-up commit: `chore: resolve CI incident [RUN_ID]`.
  8. **Push** to GitHub and monitor the re-triggered CI run for green status.
  9. **Log** the repair in `.learnings/ERRORS.md` under `## [ERR-YYYYMMDD-NNN]` with: Summary, original error, fix applied, prevention rule.
  10. **Resume** the previously suspended queue tasks.
- **Non-negotiable**: You may NOT fake a fix, skip local verification, or mark the incident resolved without a green CI run. If the fix requires human input (e.g., a revoked API token), escalate immediately by writing a `.agents/approvals/ESCALATE-[RUN_ID].md` file and notifying the operator.

### Auto-Generated Rule based on failure at 2026-06-29T01:46:02.135Z
- **Triggering Error Context**: **Step Failed**: A: OKF Validator
- **Rule**: Always ensure YAML frontmatter has a `type`, `title`, and `timestamp` in Markdown files.

### Git Workflows & Deployment Topology
- **Rule**: Standardize all workspace branches, commits, staging, and deployment environments as follows:
  - **Protected Branches**: `main` (Production) and `staging` (Staging/Preview). Direct commits/pushes are strictly prohibited.
  - **CI/CD Boomerang Policy**: Auto-repair incident committing is disabled on protected branches (`main`, `staging`) to prevent history pollution. It is only allowed on feature/PR branches.
  - **Branch Naming Standard**: Strict prefixes required: `feat/`, `fix/`, `chore/`, `docs/`, `infra/`.
  - **Commit Message Format**: Strict Conventional Commits standard (`<type>(<scope>): <subject>` e.g., `feat(seo): add meta tags`).
  - **PR Workflow**: All features, changes, and fixes must be developed on a feature branch, pass local validation checks (`npm run lint && npm test`), and be merged via Pull Request.
