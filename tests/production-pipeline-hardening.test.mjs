import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));

test('Vercel uses lockfile-safe installs and keeps main out of automatic production deploys', () => {
  const config = JSON.parse(read('vercel.json'));

  assert.equal(config.installCommand, 'npm ci');
  assert.equal(config.git?.deploymentEnabled?.main, false);

  const brandHeader = config.headers
    .flatMap(({ headers = [] }) => headers)
    .find(({ key }) => key === 'Cache-Control' && /immutable/.test(String(config.headers.find(({ headers = [] }) => headers.some((header) => header.key === 'Cache-Control' && /immutable/.test(header.value)))?.headers?.find((header) => header.key === 'Cache-Control')?.value)));

  assert.ok(brandHeader, 'brand asset cache header must exist');
  assert.equal(brandHeader.value, 'public, max-age=31536000, immutable');
});

test('release workflow uses a bounded staged deployment and project-wide promotion', () => {
  const release = read('.github/workflows/release.yml');

  assert.match(release, /git merge-base --is-ancestor "\$GITHUB_SHA" origin\/main/);
  assert.match(
    release,
    /timeout 5m npx vercel deploy --prebuilt --prod --skip-domain --archive=tgz --no-wait/,
  );
  assert.match(release, /deployment-url\.txt/);
  assert.match(release, /vercel promote "\$DEPLOYMENT_URL" --timeout=0/);
  assert.doesNotMatch(release, /vercel alias set/);
  assert.match(release, /npm run smoke:site/);
});

test('protected production candidates use bounded deployment inspection instead of curl polling', () => {
  const release = read('.github/workflows/release.yml');
  const beforePromotion = release.split('Promote staged deployment project-wide')[0];

  assert.match(
    beforePromotion,
    /timeout 6m npx vercel inspect "\$DEPLOYMENT_URL" --wait --timeout=5m/,
  );
  assert.doesNotMatch(beforePromotion, /for attempt in \$\(seq 1 30\)/);
  assert.doesNotMatch(beforePromotion, /vercel curl/);
});

test('release preserves existing domain ownership and promotes within the linked project', () => {
  const release = read('.github/workflows/release.yml');

  assert.match(release, /--scope="\$VERCEL_SCOPE"/);
  assert.match(release, /vercel promote "\$DEPLOYMENT_URL" --timeout=0/);
  assert.doesNotMatch(release, /vercel domains add/);
  assert.doesNotMatch(release, /vercel domains verify/);
});

test('production can only be pushed from tags, manual approval, or an audited marker change', () => {
  const release = read('.github/workflows/release.yml');

  assert.match(release, /branches:\s*\n\s*- main/);
  assert.match(release, /paths:\s*\n\s*- ['"]\.github\/production-release\.json['"]/);
  assert.ok(
    exists('.github/production-release.json'),
    'audited production release marker must exist',
  );

  const marker = JSON.parse(read('.github/production-release.json'));
  assert.equal(typeof marker.releaseId, 'string');
  assert.equal(typeof marker.requestedAt, 'string');
  assert.equal(typeof marker.reason, 'string');
});

test('scheduled CI health checks include the live production customer paths', () => {
  const health = read('.github/workflows/ci-health-check.yml');

  assert.match(health, /production-smoke:/);
  assert.match(health, /npm run smoke:site/);
  assert.match(health, /needs: \[quality, production-smoke\]/);
});

test('projects public content never initializes the cookie-backed auth client', () => {
  const projects = read('src/views/Projects.tsx');

  assert.doesNotMatch(projects, /lib\/supabase\/server/);
  assert.match(projects, /lib\/supabase\/public/);
  assert.ok(exists('src/lib/supabase/public.ts'), 'public Supabase client helper must exist');
});

test('public Supabase helper stays inert when deployment variables are absent', async () => {
  assert.ok(exists('src/lib/supabase/public.ts'), 'public Supabase client helper must exist');
  const { createPublicClient, hasPublicSupabaseConfig } = await import('../src/lib/supabase/public.ts');

  assert.equal(hasPublicSupabaseConfig({}), false);
  assert.equal(createPublicClient({}), null);
  assert.equal(
    hasPublicSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    }),
    true,
  );
});

test('unconfigured Directus reads return fallback content without warning or network work', async () => {
  const previousPublicUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const previousServerUrl = process.env.DIRECTUS_URL;
  delete process.env.NEXT_PUBLIC_DIRECTUS_URL;
  delete process.env.DIRECTUS_URL;

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args);

  try {
    const { getCaseStudies } = await import('../src/lib/directus/client.ts');
    assert.deepEqual(await getCaseStudies(), []);
    assert.deepEqual(warnings, []);
  } finally {
    console.warn = originalWarn;
    if (previousPublicUrl === undefined) delete process.env.NEXT_PUBLIC_DIRECTUS_URL;
    else process.env.NEXT_PUBLIC_DIRECTUS_URL = previousPublicUrl;
    if (previousServerUrl === undefined) delete process.env.DIRECTUS_URL;
    else process.env.DIRECTUS_URL = previousServerUrl;
  }
});

test('site smoke runner proves critical routes and reports the exact failed route', async () => {
  assert.ok(exists('scripts/smoke-site.mjs'), 'production smoke runner must exist');
  const { checkSite } = await import('../scripts/smoke-site.mjs');

  const healthyFetch = async (url) => {
    const body = url.pathname === '/projects' ? 'Recent Work' : "Sky's the Limit Painting";
    return new Response(body, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  };

  const results = await checkSite({
    baseUrl: 'https://example.com',
    routes: [
      { path: '/', contains: "Sky's the Limit Painting" },
      { path: '/projects', contains: 'Recent Work' },
    ],
    fetchImpl: healthyFetch,
  });

  assert.equal(results.length, 2);
  assert.equal(results.every(({ ok }) => ok), true);

  await assert.rejects(
    checkSite({
      baseUrl: 'https://example.com',
      routes: [{ path: '/contact' }],
      fetchImpl: async () => new Response('broken', { status: 503 }),
    }),
    /\/contact.*503/,
  );
});
