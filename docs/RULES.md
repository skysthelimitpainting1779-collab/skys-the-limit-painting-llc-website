# Repository Rules

## Code Standards

- Use TypeScript for application code.
- Keep reusable UI in `src/components/`.
- Keep business data in `src/data/`.
- Keep shared helpers in `src/lib/`.
- Avoid hard-coded secrets in source files.
- Prefer small, focused changes that can be validated with the existing checks.

## Validation Before Merge

Run these before publishing important changes:

```bash
npm run lint
node --test tests/site-architecture.test.mjs
npm run build
```

For visual changes, also review the affected pages in a browser.

## Git Standards

- Use clear commit messages, for example `feat: add service area gallery`.
- Keep unrelated changes out of the same commit when possible.
- Open pull requests for review when the change affects production behavior.

## Security Rules

- Never commit `.env` or real API keys.
- Keep `.env.example` updated with safe placeholder names.
- Let Dependabot update dependencies through reviewable pull requests.
- Treat lead handling, contact forms, and analytics as sensitive surfaces.
