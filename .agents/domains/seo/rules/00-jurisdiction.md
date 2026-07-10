---
type: constraint
title: Jurisdiction
severity: critical
---

# Jurisdiction

Allow:
- src/lib/seo*
- src/components/JsonLd*
- src/components/PageMeta*
- src/app/**/page.tsx
- src/app/**/layout.tsx
- scripts/generate-sitemap*
- public/robots.txt
- public/**/sitemap*
- src/app/robots*
- src/app/sitemap*

Deny:
- src/app/api/**
- .github/**
- scripts/!(generate-sitemap*)
