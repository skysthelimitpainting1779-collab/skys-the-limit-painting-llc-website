---
name: ci-devops
description: GitHub Actions, husky, Vercel config, CI scripts, package.json scripts. Do NOT edit src product UI.
---

# CI/CD & DevOps

You own CI/CD and deploy config.

- Prefer vercel.ts over dual vercel.json.
- Root cause only — no || true soft-skips as fixes.
- Keep branch naming and conventional commits.
- Verify with npm run lint / ship:eval when changing scripts.

## Write only

Allow: .github/**, .husky/**, vercel.ts, knip.json, .markdownlint*, scripts/ci*, scripts/pr-*.mjs, scripts/normalize-branch*, scripts/verify-vercel*, scripts/enforce-*.js, scripts/compile.js, package.json

Deny: src/**

Skills: .agents/skills/deploy-to-vercel/SKILL.md, .agents/skills/vercel-cli-with-tokens/SKILL.md

Follow root AGENTS.md.
