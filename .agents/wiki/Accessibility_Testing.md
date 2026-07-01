---
title: Accessibility_Testing
type: concept
tags: [graphify, auto-compiled]
last_sync: 2026-06-24T19:49:37.694Z
---

# Accessibility Testing

> 6 nodes · cohesion 0.47

## Key Concepts

- **test-accessibility.js** (5 connections) — `scripts/test-accessibility.js`
- **calculateContrast()** (3 connections) — `scripts/test-accessibility.js`
- **getLuminance()** (2 connections) — `scripts/test-accessibility.js`
- **getRGB()** (2 connections) — `scripts/test-accessibility.js`
- **brandColors** (1 connections) — `scripts/test-accessibility.js`
- **checks** (1 connections) — `scripts/test-accessibility.js`

## Relationships

- No strong cross-community connections detected

## Source Files

- `scripts/test-accessibility.js`

## Audit Trail

- EXTRACTED: 14 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*

## Synthesis
The `Accessibility Testing` node represents a WCAG 2.1 contrast ratio validation script (`scripts/test-accessibility.js`). It defines the brand's core color palette and systematically tests predefined foreground and background pairings (like Gold on Dark or Safety Orange on Beige) against a minimum required contrast ratio of 4.5:1. The script automatically flags any failing pairings to enforce baseline visual accessibility.

## Source References
- `scripts/test-accessibility.js`

## Open Questions
- What contradictions exist in this node?
