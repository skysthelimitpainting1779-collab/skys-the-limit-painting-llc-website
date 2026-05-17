# Self-Healing Automation

## What Exists

The repository now includes automation for:

- CI validation on pushes and pull requests.
- Pull request quality gates.
- Weekly dependency update proposals through Dependabot.
- Weekly stale issue and pull request cleanup.
- Weekly and event-driven security scanning.
- Tag-based release creation.

## What "Self-Healing" Means Here

The repository should surface problems early and make routine maintenance easier. The automation is intentionally reviewable: it opens checks, warnings, and pull requests instead of silently rewriting production code.

## Guardrails

- Dependency updates go through pull requests.
- Security scans run without automatically applying risky fixes.
- Stale cleanup avoids pinned and security-labeled items.
- CI uses the real project scripts: `npm run lint`, architecture tests, and `npm run build`.

## Human Review Still Matters

Automation cannot decide business priorities, approve design quality, or verify that painting service content is accurate. Use the checks as safety rails, then review the actual user experience.
