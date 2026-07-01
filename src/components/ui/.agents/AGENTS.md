---
type: policy
title: UI UX Agent Context
description: Local agent context for UI engineering and brutalist design.
tags: [ui, ux, brutalism, design]
---

# UI UX Domain

This is the hyper-local context for the `src/components/ui/` directory.

## Core Directives
1. **Aesthetic**: Brutalism. `#FF5A00` (Safety Orange) on `#050505` (Dark Charcoal). No white on orange.
2. **Shapes**: Absolute strict enforcement of `rounded-none`. No border radius.
3. **Shadows**: No drop shadows.
4. **Components**: Use strict Shadcn UI primitives.
5. **State**: Review `decisions/` before modifying base primitives. Look at `dead-letter/` for known UI anti-patterns to avoid.
