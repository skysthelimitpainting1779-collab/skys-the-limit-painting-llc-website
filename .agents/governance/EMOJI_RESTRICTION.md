---
id: emoji_restriction
name: 'Governance Policy: Zero Emojis in Source Code'
type: policy
description: 'Restricts all graphic emojis from compiled source code and frontend components to ensure a premium visual design.'
tags: [governance, design-system, visual]
references: [architectural_decisions]
---

# Governance Policy: Zero Emojis in Source Code

**Status**: Active  
**Domain**: Quality Assurance & Brand Integrity

## Policy Rule

Emojis are strictly banned from all compiled source code, TypeScript/JavaScript strings, HTML markup, styled variables, and React components. The only permitted exception is Markdown-based documentation files, where the DNA marker (`🧬`) is used during graph/wiki sync.

## Rationale

Emojis in public-facing interfaces project a casual, low-budget visual identity. To preserve a high-end, premium industrial brand aesthetic, communication must rely on curated typography, crisp SVG micro-vectors, and balanced grid alignments rather than generic graphical smileys or badges.

## Verification Checklist

- **Pre-commit Scan**: Check for emoji presence in any React or TS component.
- **Visual Audit**: Verify no emojis are rendered on public routes.
- **Failures Handling**: Any emoji found in source will fail compiler verification rules.
