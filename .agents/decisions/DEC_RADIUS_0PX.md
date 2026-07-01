---
id: dec_radius_0px
name: "Architectural Decision: Strict 0px Border Radius"
type: policy
description: "Establishes a strict mechanical aesthetic across all UI elements by forbidding rounded corners."
tags: [design-system, css, brutalism]
references: [architectural_decisions]
---

# Architectural Decision: Strict 0px Border Radius

**Status**: Active  
**Domain**: Frontend Layout Styling

## Policy Rule

All CSS, Tailwind classes, and styled-component border-radius properties must be set to `0px` or `rounded-none` globally. No rounded corners are permitted on buttons, cards, containers, input elements, modals, or badges.

## Rationale

This project embraces a high-end Swiss typographic print and brutalist military terminal aesthetic. Rounded corners (e.g., standard Tailwind `rounded-md` or `rounded-lg`) inject a generic modern consumer SaaS aesthetic, whereas a strict `0px` border-radius reinforces structural mechanics and alignment boundaries.

## Enforcement Code Example

```html
<!-- CORRECT -->
<button class="bg-[#FF5A00] text-[#050505] font-mono px-4 py-2 font-bold uppercase tracking-wider" style="border-radius: 0px;">
  EXECUTE STATE
</button>

<!-- WRONG -->
<button class="bg-[#FF5A00] text-white rounded-md font-mono px-4 py-2 font-bold uppercase">
  EXECUTE STATE
</button>
```
