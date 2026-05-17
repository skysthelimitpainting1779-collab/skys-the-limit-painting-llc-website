# Repository Configuration

## Repository

- Name: `website`
- Owner: `skysthelimitpainting1779-collab`
- Purpose: Sky's The Limit Painting LLC website
- Production platform: Vercel
- Primary stack: React, TypeScript, Vite

## Configured Systems

- GitHub Actions CI
- Pull request quality gate
- Security scanning
- Dependabot dependency updates
- Stale issue and pull request maintenance
- Tag-based release workflow
- Issue templates
- Pull request template
- Code ownership placeholder
- Operating documentation under `docs/`

## Core Commands

```bash
npm run dev
npm run lint
node --test tests/site-architecture.test.mjs
npm run build
```

## Notes

The automation is built around the real app scripts in `package.json`. It avoids generic template commands that are not currently available in this project.
