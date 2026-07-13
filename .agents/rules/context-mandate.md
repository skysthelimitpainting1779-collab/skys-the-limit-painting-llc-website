---
trigger: always_on
description: Mandates Context7 and Web Search for architectural planning.
---

# Universal Context Mandate

To prevent architectural regressions, hallucinated API usage, and outdated library patterns, all agents MUST obey the following constraint:

## The Mandate
Whenever you are drafting an `implementation_plan.md`, making an architectural decision, choosing a dependency, or attempting to write a complex implementation from scratch, you **MUST NOT** rely solely on your pre-trained weights.

Before you write any code or finalize the plan, you **MUST**:
1.  Execute a `query-docs` tool call via the Context 7 MCP server (or use `npx ctx7 docs`).
2.  OR execute a `search_web` tool call to find the latest library documentation, GitHub issues, or StackOverflow patterns.

## Enforcement
If you present an implementation plan involving a modern framework (e.g., React, Next.js, Vercel, Supabase) without having explicitly searched for its latest syntax, you have violated the Universal Context Mandate. Always fetch fresh context before acting.
