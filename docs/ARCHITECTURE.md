# Architecture

## Application Shape

This is a React 19 and Vite website for Sky's The Limit Painting LLC. The app is optimized for a marketing and lead-generation workflow with public pages, service area content, media assets, API lead handling, and Vercel deployment.

## Key Directories

```text
api/             Vercel serverless endpoints
docs/            Operating docs, audits, and project notes
public/          Static images, videos, sitemap, and generated media
remotion/        Video compositions and brand film renders
src/components/  Reusable interface components
src/data/        Market and service-area data
src/lib/         Contact, SEO, and shared helpers
src/pages/       Route-level page components
tests/           Node-based architecture tests
```

## Build Path

1. `npm ci` installs locked dependencies.
2. `npm run lint` runs TypeScript validation.
3. `node --test tests/site-architecture.test.mjs` checks important site structure.
4. `npm run build` creates the production Vite build in `dist/`.
5. Vercel serves the built site and API functions.

## Operational Priorities

- Keep contact and lead-capture flows working.
- Keep generated media paths stable.
- Keep SEO metadata and sitemap current.
- Keep build checks fast enough to run on every pull request.
