# Security Policy

## Production site

**https://www.skysthelimitpaintingllc.com**

## Reporting a vulnerability

Email **skysthelimitpainting1779@gmail.com** with:

- Description of the issue
- Steps to reproduce (if applicable)
- Impact assessment if known

Please **do not** open a public GitHub issue for security-sensitive reports.

We aim to acknowledge reports within a few business days.

## Scope

In scope: this repository’s application code, API routes, and deployment config for the public website.

Out of scope: third-party services (Vercel, Supabase, Resend, HubSpot, etc.) — report those to the vendor as well when relevant.

## Practices

- Secrets live in Vercel / local `.env*` only (never committed)
- CI: npm audit, dependency review, CodeQL
- CSP and security headers via `vercel.json`
- Branch protection and code owners on protected branches (recommended)
