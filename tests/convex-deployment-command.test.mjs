import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

function sourceFiles(directoryUrl) {
  return readdirSync(directoryUrl, { withFileTypes: true }).flatMap((entry) => {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl);
    if (entry.isDirectory()) return sourceFiles(entryUrl);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [entryUrl] : [];
  });
}

test('Vercel validates the deployment environment then deploys Convex around the web build', () => {
  const packageJson = JSON.parse(read('package.json'));
  const vercel = JSON.parse(read('vercel.json'));

  assert.equal(
    packageJson.scripts['validate:convex-deploy-env'],
    'node scripts/validate-convex-deploy-env.mjs'
  );
  assert.equal(
    packageJson.scripts['build:vercel'],
    'npm run validate:convex-deploy-env && npx convex deploy --cmd "npm run build"'
  );
  assert.equal(vercel.buildCommand, 'npm run build:vercel');
});

test('deployment validation consumes the key without printing it', () => {
  const validator = fileURLToPath(
    new URL('../scripts/validate-convex-deploy-env.mjs', import.meta.url)
  );
  const secret = 'preview:validation|do-not-print';
  const result = spawnSync(process.execPath, [validator], {
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_APP_ENV: 'preview',
      CONVEX_DEPLOY_KEY: secret,
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'Convex deployment environment validated.\n');
  assert.equal(`${result.stdout}${result.stderr}`.includes(secret), false);
});

test('deployment validation fails closed before Convex CLI execution', () => {
  const validator = fileURLToPath(
    new URL('../scripts/validate-convex-deploy-env.mjs', import.meta.url)
  );
  const result = spawnSync(process.execPath, [validator], {
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_APP_ENV: 'production',
      CONVEX_DEPLOY_KEY: 'preview:wrong-tier|do-not-print',
    },
  });

  assert.equal(result.status, 1);
  assert.equal(result.stderr, 'Convex deployment environment validation failed.\n');
  assert.doesNotMatch(result.stderr, /preview:wrong-tier/);
});

test('deployment credentials stay outside the request-time source graph', () => {
  const allowed = new Set([
    'src/lib/env/deployment-schema.ts',
    'src/lib/env/deployment.ts',
  ]);
  const violations = sourceFiles(new URL('../src/', import.meta.url))
    .map((url) => ({
      path: fileURLToPath(url)
        .replace(fileURLToPath(root), '')
        .replaceAll('\\', '/'),
      source: readFileSync(url, 'utf8'),
    }))
    .filter(({ path }) => !allowed.has(path))
    .filter(
      ({ source }) =>
        /CONVEX_DEPLOY_KEY/.test(source) ||
        /(?:from|import\()\s*['"][^'"]*env\/deployment(?:-schema)?['"]/.test(source)
    )
    .map(({ path }) => path);

  assert.deepEqual(violations, []);
});
