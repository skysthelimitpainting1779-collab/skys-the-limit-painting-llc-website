# Deployment

## Production Platform

The site is configured for Vercel. Production deployments should come from the `main` branch unless a release manager chooses a different flow.

## Pre-Deploy Checklist

```bash
npm ci
npm run lint
node --test tests/site-architecture.test.mjs
npm run build
```

## Environment

Keep real secrets in Vercel environment variables. Keep `.env.example` updated with placeholder names only.

## Release Tags

Create release tags with this format:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release workflow validates the app and creates a GitHub release for the tag.

## Rollback

Use Vercel's deployment history to promote a previous known-good deployment. If code needs to be reverted, open a focused pull request and include the deployment that is being restored.
