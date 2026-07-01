---
name: backend-express
description: Express 5 + Node.js 24 backend engineering rules for the Sky's the Limit Painting LLC API layer. Use when writing, reviewing, or refactoring code in the `backend/` directory. Triggers on tasks involving API routes, middleware, webhooks, server config, or Supabase integration.
license: MIT
metadata:
  author: Sky's the Limit Painting LLC
  version: 1.0.0
  okf: v0.1
  type: agent-skill
  tags: [backend, express, nodejs, supabase, vercel-fluid]
---

# Backend Express Agent Skill

Engineering rules for the Express 5 backend layer. Contains rules across 4 categories, prioritized by severity to prevent regressions, security issues, and deprecated API usage.

## When to Apply

Reference these rules when:

- Writing new Express routes or middleware in `backend/`
- Reviewing backend code for correctness or security
- Refactoring Node.js server logic
- Integrating Supabase auth or database calls
- Debugging Vercel Fluid timeout or deployment issues

## Jurisdiction

**Allowed**: `backend/` and all subdirectories only.
**Forbidden**: Do not touch `src/`, `scripts/`, or any file outside `backend/`.

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|---|---|---|---|
| 1 | Deprecated API Blocks | CRITICAL | `deprecated-` |
| 2 | Security Guardrails | CRITICAL | `security-` |
| 3 | Architecture Patterns | HIGH | `arch-` |
| 4 | Code Style Enforcement | MEDIUM | `style-` |

## Quick Reference

### 1. Deprecated API Blocks (CRITICAL)
- `deprecated-commonjs` — No `require()` — project is ESM
- `deprecated-var` — No `var` declarations
- `deprecated-promise-chain` — No `.then()/.catch()` chaining
- `deprecated-body-parser` — No `bodyParser()` — built into Express 5
- `deprecated-express4-error-middleware` — No 4-arg error wrapper needed in Express 5
- `deprecated-process-exit` — No `process.exit()` in handlers

### 2. Security Guardrails (CRITICAL)
- `security-no-hardcoded-secrets` — Zero secrets in source
- `security-env-vars-only` — All config via `process.env.*`

### 3. Architecture Patterns (HIGH)
- `arch-single-responsibility` — One concern per route file, max 150 lines
- `arch-shared-utilities` — All shared logic in `backend/lib/`
- `arch-no-timeout-hacks` — No `setTimeout` to bypass Vercel's 10s limit
- `arch-error-forwarding` — Always `next(err)`, never swallow

### 4. Code Style Enforcement (MEDIUM)
- `style-async-await` — Use `async/await`, not `.then()`
- `style-explicit-types` — Type all params and return values in TypeScript
- `style-esm-imports` — Use `import`/`export` exclusively

## Full Compiled Document

For the complete system prompt with all rules expanded: `AGENTS.md`
