---
type: documentation
title: CLAUDE.md Developer & Agent Reference Guide
description: Quick reference linking to the canonical agents operating manual, domain taxonomy, commands, and project guidelines.
tags: [documentation, agent, reference, guidelines]
---

# CLAUDE.md // Developer & agent reference guide

## Operating manual

Refer to the master @agents.md operating manual for guidelines, commands, and design standards.

## Domain Taxonomy
All components, concepts, and files MUST be semantically linked to one of the following root nodes in the graph:
- **Market**: (e.g., SEO, AI Crawlability, Target Audience)
- **Service**: (e.g., Commercial Painting, Residential, Specialized Coatings)
- **Business-Objective**: (e.g., Lead Capture, Revenue Generation, Conversion Optimization)
Isolated technical nodes must be bridged to the nearest relevant business domain.

## Commands

- **Build project**: `npm run build`
- **Lint check**: `npm run lint`
- **Run tests**: `npm test`
- **Master compile**: `powershell -ExecutionPolicy Bypass -File "..\compile-all.ps1"`
- **Project graph update**: `graphify update .`
