import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const config = JSON.parse(
  readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')
);
const integrationSource = readFileSync(
  new URL('../services/integrations/src/index.ts', import.meta.url),
  'utf8'
);

test('declares the approved web and integrations Vercel Services topology', () => {
  assert.deepEqual(Object.keys(config.services).sort(), ['integrations', 'web']);
  assert.equal(config.services.web.root, '.');
  assert.equal(config.services.web.framework, 'nextjs');
  assert.equal(config.services.web.installCommand, 'npm ci');
  assert.equal(config.services.web.buildCommand, 'npm run build:vercel');
  assert.equal(config.services.integrations.root, 'services/integrations/');
  assert.equal(config.services.integrations.framework, 'hono');
  assert.equal(config.services.integrations.entrypoint, 'src/index.ts');
});

test('binds web to integrations without exposing the integrations service publicly', () => {
  assert.deepEqual(config.services.web.bindings, [
    {
      type: 'service',
      service: 'integrations',
      format: 'url',
      env: 'INTEGRATIONS_URL',
    },
  ]);
  assert.deepEqual(config.rewrites, [
    {
      source: '/(.*)',
      destination: { service: 'web' },
    },
  ]);
  assert.equal(
    config.rewrites.some((rewrite) => rewrite.destination?.service === 'integrations'),
    false
  );
});

test('integrations service exports a minimal Hono application', () => {
  assert.match(integrationSource, /new Hono\(\)/);
  assert.match(integrationSource, /app\.get\(['"]\/health['"]/);
  assert.match(integrationSource, /export default app/);
  assert.doesNotMatch(integrationSource, /process\.env|console\./);
});
