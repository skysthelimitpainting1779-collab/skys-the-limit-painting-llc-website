---
type: playbook
title: 'Error Codification & Exit Code Hygiene'
description: 'Protocol for capturing every non-zero exit, tool failure, inefficiency and turning them into permanent, code-level prevention. Mandatory for all agents.'
tags: [error-handling, ci-cd, reliability, agents, prevention]
---

# Error Codification Playbook

## Core Rule (non-negotiable)

On **any** non-zero exit, tool failure, unexpected behavior, or inefficiency:

1. **STOP**
2. **Log** a full entry in `.learnings/ERRORS.md` using the exact template:
   - `## [ERR-YYYYMMDD-NNN] Short title`
   - Summary, Error (raw), Fix/Learning (with # CORRECT and # WRONG code blocks)
   - Prevention Rule (actionable and generalizable)
   - Metadata

3. **Codify** the prevention into **code**, not just docs:
   - Add guards, version pins, exit code checks, bootstrap steps, lint hooks.
   - Update CI, scripts, package.json.
   - Add to `.agents/` playbooks or decisions when systemic.

## Common Errors & Their Codifications (from Gemini brains + project history)

- GitHub Actions PR branch refs (`github.ref_name` vs `head_ref`) → ERR-20260629-001. Always use `github.head_ref || github.ref_name`.
- Artifacts missing `.next` (hidden files) → ERR-20260629-002. Always `include-hidden-files: true`.
- Missing generated artifacts before tests → ERR-20260629-003. Always run `node scripts/agent-os.js bootstrap` first.
- React / react-dom skew → ERR-20260629-004. Pin + `scripts/verify-react-versions.mjs` in lint.
- Browser automation (CDP, context, file://, timeouts) → ERR-20260629-005. Add fallbacks + never treat as 100% reliable.

## Implementation Guidelines for Efficiency

- Every `powershell -ExecutionPolicy Bypass -Command` **must** check `$LASTEXITCODE`.
- Every `execSync` / child_process in Node **must** check `status` or throw + log.
- Add `pretest`, `prelint`, or `verify:*` scripts that run guards.
- On failure in CI: the job should surface the exact ERR ID.
- After any codification, re-run `npm run lint && npm test && npm run build`.

## Adding a New Codified Error

1. Create the entry in `.learnings/ERRORS.md`.
2. Implement at least one code-level prevention.
3. Reference the ERR ID in comments / commit messages.
4. Update this playbook if the pattern is recurring.
5. Verify with `read_file` on the changed files.

This turns one-off pain into permanent system improvement.
