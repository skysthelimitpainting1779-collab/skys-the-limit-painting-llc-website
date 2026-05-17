# Troubleshooting

## `npm ci` Fails

- Confirm `package-lock.json` is committed and matches `package.json`.
- Delete local `node_modules` and run `npm ci` again.
- Check whether a dependency update pull request changed the lockfile.

## Type Check Fails

Run:

```bash
npm run lint
```

Fix the TypeScript errors shown in the output. This repository currently uses the `lint` script for TypeScript validation.

## Build Fails

Run:

```bash
npm run build
```

Common causes:

- Missing environment variable.
- Missing public asset path.
- Import path casing mismatch.
- TypeScript error surfaced during the Vite build.

## Video or Image Missing

- Confirm the file exists under `public/`.
- Confirm the code references it with a leading `/`.
- Regenerate Remotion assets when the source composition changed.

## Lead Form Issues

- Check `api/leads.ts`.
- Confirm environment variables are configured in Vercel.
- Review Vercel function logs for request or delivery errors.
