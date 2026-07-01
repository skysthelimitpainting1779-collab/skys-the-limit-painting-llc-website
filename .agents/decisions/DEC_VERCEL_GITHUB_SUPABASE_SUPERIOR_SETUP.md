---
type: decision
title: "Superior Vercel + GitHub + Supabase Configuration"
description: "Full production-grade branch protection, env scoping, RLS policies, CI gates, and Git integration per agents.md policies."
tags: [vercel, github, supabase, ci-cd, security, compliance]
---

# Decision: Superior Vercel + GitHub + Supabase Setup (2026-06-29)

## Context
Project required complete configuration of Vercel (deploys, envs, branches), GitHub (protections, workflows, naming), Supabase (auth, RLS, migrations, connection) for the "most superior setup possible" using MCP, subagents, skills (vercel-*, supabase-*, deploy-to-vercel), CLI, and codebase-memory-mcp first.

## Decision
- GitHub: Branch protection **enabled** on `main` + `staging` (PR required + 1+ review + CODEOWNERS + strict up-to-date status checks from CI + new Git Standards guard, linear history, enforce admins).
- New dedicated `git-guard.yml` workflow + hardened `enforce-git.js` (exempts dependabot/devin per POL-007).
- Vercel: Confirmed linked project (prj_L3ZMoQ79YLx9G2o6Lg9OubqO9H8m / team_bse...), Node 24, GitHub integration + prebuilt CI deploys. Per-environment env vars + branch mappings (main=prod, staging/feat/fix=preview). Security headers in vercel.json already excellent.
- Supabase: Local config + 3 migrations with RLS enabled on leads/lead_events. Added dedicated policies migration for anon insert (public forms) + service full access. Use @supabase/ssr correctly. Follow supabase-postgres-best-practices (indexes, RLS perf, no service in client).
- CI: Already strong sequential gates; now enforced at repo level. No direct pushes to protected branches.
- All changes follow: PS shell, read before edit + verify after with read_file/list_dir, OKF frontmatter, MCP priority, subagents used.

## Rationale
Matches @agents.md (main/staging mappings, prefixes, no bot auto-repair on protected, verify loop), Vercel skills (preview default, link for git-push ideal), Supabase skill (RLS on every exposed table, explicit GRANTs + policies, advisors).

## Consequences / Verification
- PRs to main/staging now require all checks + review.
- Run locally: `powershell -ExecutionPolicy Bypass -Command "node scripts/enforce-git.js && npm run lint && npm test && npm run build"`
- Supabase: `npx supabase db push` (after link) then advisors.
- Vercel envs: `vercel env add KEY production|preview` (scoped).
- Re-index: codebase-memory or graphify.
- Documented in .agents/ + this file.

Next: User to run supabase link + vercel env adds in dashboard/CLI with real tokens. Test preview deploy from feat branch.
