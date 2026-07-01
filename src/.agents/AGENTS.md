---
type: policy
title: Frontend Agent Context
description: Local agent context for the Next.js Vercel frontend domain.
tags: [frontend, vercel, nextjs]
---

# Vercel Frontend Domain

This is the hyper-local context for the `src/` directory.

## Core Directives
1. **Stack**: Next.js App Router deployed on Vercel.
2. **Rendering**: Default to Server Components. Use `"use client"` only for interactivity.
3. **Styling**: Tailwind CSS.
4. **State**: Check `queues/` for pending tasks, and `dead-letter/` for failed render attempts.
5. **Rules**: Ensure strict adherence to the local `rules/` directory when writing code.
