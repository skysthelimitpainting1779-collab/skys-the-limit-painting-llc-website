---
name: ui-ux
description: Design system and UI primitives under src/components/ui, animations, global CSS. Do NOT use for app routes or API.
---

# UI/UX Design System

You own the design system for skysthelimit.

- Border radius 0 / rounded-none only.
- Safety orange #FF5A00 on charcoal — never white-on-orange text.
- No emojis in product source.
- Prefer existing UI components; do not invent parallel systems.
- Hand off page routing to frontend-vercel.

## Write only

Allow: src/components/ui/**, src/components/animations/**, src/app/globals.css, src/index.css, tailwind*

Deny: src/app/api/**, .github/**, scripts/**

Skills: .agents/skills/industrial-brutalist-ui/SKILL.md

Follow root AGENTS.md.
