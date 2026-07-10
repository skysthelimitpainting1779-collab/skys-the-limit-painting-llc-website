---
type: constraint
title: Jurisdiction
severity: critical
---

# Jurisdiction

Allow:
- .github/**
- .husky/**
- vercel.json
- knip.json
- .markdownlint*
- scripts/ci*
- scripts/pr-*.mjs
- scripts/normalize-branch*
- scripts/verify-vercel*
- scripts/enforce-*.js
- scripts/compile.js
- package.json

Deny:
- src/**
- backend/**
