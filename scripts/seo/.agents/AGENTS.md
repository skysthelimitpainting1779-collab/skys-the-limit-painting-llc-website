---
type: policy
title: SEO Agent Context
description: Local agent context for Search Engine Optimization engineering.
tags: [seo, metadata, schema]
---

# SEO Domain

This is the hyper-local context for the `scripts/seo/` directory and overall site metadata.

## Core Directives
1. **Metadata**: Ensure every page has a unique, optimized title and description.
2. **Schema**: Use JSON-LD (e.g., `LocalBusiness`, `BreadcrumbList`).
3. **Crawlability**: Ensure strict adherence to `robots.txt` and sitemap generation rules.
4. **AI Crawlers**: The site MUST be optimized for LLMs (`GPTBot`, `ClaudeBot`, etc.) with a `llms.txt` manifest.
5. **State**: Check `checkpoints/` for SEO baseline metrics before deploying broad changes.
