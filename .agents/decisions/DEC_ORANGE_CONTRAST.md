---
id: dec_orange_contrast
name: "Architectural Decision: Safety Orange Contrast Rule"
type: policy
description: "Mandates strict dark charcoal typography on safety orange backgrounds to preserve premium contrast and legibility."
tags: [design-system, css, accessibility]
references: [architectural_decisions]
---

# Architectural Decision: Safety Orange Contrast Rule

**Status**: Active  
**Domain**: Frontend Accessibility & Contrast

## Policy Rule

Background elements utilizing Safety Orange (`#FF5A00` or Tailwind `bg-orange-safety`) must strictly use Dark Charcoal (`#050505` or Tailwind `text-black-primary`) for all overlaid text and icons. Under no circumstances is white text (`#FFFFFF` or `text-white`) permitted on a safety orange background.

## Rationale

White text on safety orange fails standard WCAG 2.1 AA/AAA contrast guidelines, leading to poor legibility and a cheap visual presentation. Using Dark Charcoal `#050505` on Safety Orange `#FF5A00` creates a striking industrial contrast, improving legibility and reinforcing the premium, high-contrast visual hierarchy.

## Visual Tokens

| Token | Color Value | Usage |
|---|---|---|
| Background | `#FF5A00` (Safety Orange) | Core visual highlight backgrounds |
| Typography | `#050505` (Dark Charcoal) | Strict overlying text/icons |

## Code Standards

```html
<!-- CORRECT -->
<div class="bg-[#FF5A00] p-4 text-[#050505] font-bold uppercase">
  Contrast compliant alert text
</div>

<!-- WRONG -->
<div class="bg-[#FF5A00] p-4 text-white font-bold uppercase">
  Non-compliant contrast alert
</div>
```
