# Current Architecture Decisions

This file is authoritative for the migration target. It overrides stale target-state guidance in `README.md`, generated specialist instructions, and legacy CMS or portal plans.

## Operational architecture

- Convex is the operational backend and business-state system of record.
- Supabase, Payload, and Directus are migration sources and rollback dependencies only.
- Clerk proves identity; Convex owns authorization through durable provider IDs and explicit resource grants.
- Staff access is invitation-only, privileged staff require MFA, and email strings are never durable ownership grants.

## Vercel topology and effects

- The currently production-linked Vercel `website` project remains one native Next.js service through G70. Its proven build path is `npm run build:vercel`, which validates environment separation, deploys Convex functions to the selected deployment, and builds Next.js.
- The target topology adds an internal TypeScript `integrations` service for verified provider webhooks, adapters, and Vercel Workflow entrypoints.
- That target topology must first run in a dedicated non-production Services project. It is not activated by the production-linked `website` project before G70 approval and a successful preview packaging contract.
- When activated, internal service calls use Vercel service bindings; only explicit webhook routes receive public rewrites.
- Convex scheduling handles deterministic internal jobs. Vercel Workflow handles durable multi-step external effects.
- Webhooks verify raw-body signatures and event IDs are idempotent.
- Production framework conversion, promotion, domains, and resource changes require the G70 approval gate.

## Revenue, files, and content

- Stripe-hosted Checkout Sessions are the payment boundary; amounts and terms come from approved canonical business data.
- Customer, lead, proposal, agreement, and project files are private by default.
- Servers validate file type, size, ownership, privacy class, and retrieval authorization; public media is an explicit publication class.
- Convex becomes the sole content-publication authority after verified migration and reconciliation.
- Legacy services are removed only after rollback, restore, retention, and decommission gates pass.

## Product and privacy

- Use source-owned shadcn/ui components and the Measured Craft design system.
- Preserve the orange/charcoal brand with semantic geometry tokens rather than a global radius-zero rule.
- Meet WCAG 2.2 AA, keyboard, focus, reduced-motion, and responsive requirements.
- No raw PII is stored in browser persistence, referral URLs, analytics, logs, or public file URLs.
- Offline drafts and referrals use opaque server-issued identifiers.

## Execution contract

- The compiled `.graph` artifacts own dependencies, gates, risk, and evidence contracts.
- Graphify owns scoped live code discovery; use query-first discovery and do not bulk-load graph reports or generated wikis.
- Every node loads its primary domain skill from the task-skill matrix and current documentation before implementation.
- Local, fixture, test-mode, and preview-safe work may proceed through B60.
- Production mutation, communications, payments, GBP edits, cutover, and decommissioning require their named gates.
