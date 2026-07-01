---
type: knowledge
title: Target Tech Stack Codification (2026)
description: The master map of the project's technology stack, UI frameworks, and agentic infrastructure.
tags: [stack, architecture, shadcn, vercel, agents]
---

# Target Tech Stack & Architecture (2026)

This document codifies the exact technology stack, UI layer, and Agentic Infrastructure used in the repository.

## 1. Core Framework & Infrastructure
- **Framework**: Next.js 16 (App Router, Server Components).
- **Compute**: Vercel Fluid Compute (Optimized for edge and serverless cost-efficiency).
- **Agent Memory/Storage**: Vercel Blob (Private Blob for secure, persistent agent state).
- **Feature Management**: Vercel Flags (A/B testing, rollout routing for AI features).
- **Realtime**: Vercel Functions with WebSocket Beta (for streaming LLM generation and bidirectional agent sync).

## 2. Design System & UI (Strict Guardrails)
- **UI Primitives**: Shadcn UI.
  - **Constraint**: All standard UI components (Buttons, Cards, Modals) must originate from Shadcn. Do not build custom primitive components unless Shadcn lacks the specific requirement.
- **Styling**: Tailwind CSS v4.
  - **Constraint**: The global `--radius` is strictly mapped to `0px` (`0rem`). **DO NOT** use rounded corners. This enforces the industrial, raw, mechanical aesthetic.
  - **Color Palette**: Safety Orange (`#FF5A00`) and Pitch Black/Charcoal (`#050505`). Never overlay white text on Safety Orange (fails accessibility/aesthetic contrast).
- **Motion & Interaction**: Framer Motion (v12+).
  - **Physics**: All animations must use spring physics (`type: 'spring', damping: 20, stiffness: 100`). Linear or basic ease-in animations are banned for primary interactive elements.
  - **Interaction**: Heavy use of `layoutId` for shared element transitions across the DOM.

## 3. Agentic Layer (ADLC)
- **Framework**: Vercel AI SDK 7.
- **Schemas**: `zod`. All AI generated output mapped to the UI must be strictly typed and validated using `generateObject` and Zod schemas. Avoid raw text streaming when structured data is needed.
- **Filesystem as Context**: Governance instructions are placed explicitly in directories (e.g. `.agents/AGENTS.md`) rather than relying on a single monolithic system prompt.

## 4. Repo Layout Enforcements
To prevent cross-contamination between static UI and dynamic Agent logic, the following structure is enforced:
- `/src/app/`: Next.js Routing and Server Components.
- `/src/components/ui/`: Strict Shadcn primitives.
- `/src/agents/`: Autonomous agent logic, tools, orchestration, and Zod schemas.
- `/.agents/`: System-level guardrails, operating manuals (SSOT), and learning loops.
