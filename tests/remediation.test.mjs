import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Vite config does not expose server-only Gemini secrets to the client', () => {
  const viteConfig = read('vite.config.ts');
  const packageJson = read('package.json');

  assert.doesNotMatch(viteConfig, /GEMINI_API_KEY/);
  assert.doesNotMatch(viteConfig, /VITE_GEMINI_API_KEY/);
  assert.doesNotMatch(packageJson, /@google\/genai/);
});

test('lead email HTML escapes submitted keys and values', () => {
  const leadsApi = read('api/leads.ts');

  assert.match(leadsApi, /function escapeHtml/);
  assert.match(leadsApi, /replaceAll\('&', '&amp;'\)/);
  assert.match(leadsApi, /escapeHtml\(key\)/);
  assert.match(leadsApi, /escapeHtml\(value\)/);
});

test('Vercel config has security headers and no blanket SPA rewrite', () => {
  const vercelConfig = JSON.parse(read('vercel.json'));
  const headerKeys = vercelConfig.headers?.[0]?.headers?.map((header) => header.key) || [];

  for (const key of [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Strict-Transport-Security',
    'Content-Security-Policy',
  ]) {
    assert.ok(headerKeys.includes(key), `${key} header is missing`);
  }

  assert.equal(vercelConfig.rewrites, undefined);
});

test('build pipeline prerenders public routes and static 404 metadata', () => {
  const packageJson = JSON.parse(read('package.json'));
  const prerender = read('scripts/prerender.mjs');

  assert.match(packageJson.scripts.build, /scripts\/prerender\.mjs/);
  for (const route of ['/', '/residential', '/commercial', '/public-sector', '/projects', '/about', '/contact', '/404']) {
    assert.match(prerender, new RegExp(`path: '${route.replace('/', '\\/')}'`));
  }
  assert.match(prerender, /404\.html/);
  assert.match(prerender, /application\/ld\+json/);
  assert.match(prerender, /canonical/);
  assert.match(prerender, /fallbackContent/);
});

test('before and after slider remains pointer-enabled and is keyboard accessible', () => {
  const slider = read('src/components/BeforeAfterSlider.tsx');

  assert.match(slider, /type="range"/);
  assert.match(slider, /aria-valuetext/);
  assert.match(slider, /onKeyDown/);
  assert.match(slider, /onMouseDown/);
  assert.match(slider, /onTouchStart/);
});

test('lead form controls have accessible names and normalized funnel events', () => {
  const leadForm = read('src/components/LeadForm.tsx');

  for (const label of ['Full name', 'Phone', 'Email', 'City', 'Market', 'Project type', 'Timeline', 'Budget range', 'Preferred contact method', 'Project details']) {
    assert.match(leadForm, new RegExp(`aria-label="${label}"`));
  }

  for (const eventName of ['lead_form_start', 'lead_form_submit_success', 'lead_form_submit_error', 'lead_mailto_fallback_opened']) {
    assert.match(leadForm, new RegExp(`'${eventName}'`));
  }
});
