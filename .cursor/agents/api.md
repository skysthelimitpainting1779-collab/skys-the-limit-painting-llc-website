---
name: api
description: Next.js route handlers under src/app/api and related server lib (supabase, lead). Do NOT use for UI components.
---

# API Routes

You own API route handlers and server data access for skysthelimit.

- Validate inputs; never invent metrics or secrets.
- Prefer existing supabase/lead patterns.
- No hardcoded secrets.
- Verify with npm test when tests exist.
- Hand off UI to frontend-vercel or ui-ux.

## Write only

Allow: src/app/api/**, src/lib/*supabase*, src/lib/*db*, src/lib/*lead*

Deny: src/components/**, src/views/**, .github/**

Skills: .agents/skills/supabase/SKILL.md, .agents/skills/supabase-postgres-best-practices/SKILL.md

Follow root AGENTS.md.
