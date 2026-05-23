import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('top-level routes use the three-market architecture', () => {
  const app = read('src/App.tsx');

  for (const route of ['"/"', '"/residential"', '"/commercial"', '"/public-sector"', '"/projects"', '"/about"', '"/contact"', '"/service-area"']) {
    assert.match(app, new RegExp(route.replace('/', '\\/')));
  }

  assert.match(app, /"\/service-areas\/:slug"/);
  assert.match(app, /"\/painting-services\/:slug"/);
});

test('primary navigation leads with residential, commercial, and public sector', () => {
  const header = read('src/components/ConversionHeader.tsx');

  const residential = header.indexOf('Residential');
  const commercial = header.indexOf('Commercial');
  const publicSector = header.indexOf('Public Sector');

  assert.ok(residential >= 0, 'Residential nav item is missing');
  assert.ok(commercial > residential, 'Commercial should follow Residential');
  assert.ok(publicSector > commercial, 'Public Sector should follow Commercial');
  assert.doesNotMatch(header, /Services/);
});

test('homepage states the approved positioning and avoids forbidden claims', () => {
  const home = read('src/pages/Home.tsx');

  assert.match(home, /Residential detail\. Commercial discipline\. Public-sector ready\./);
  assert.match(home, /registered Minnesota Specialty Contractor \(Painting\)/);
  assert.doesNotMatch(home, /Public-work ambition/i);
  assert.doesNotMatch(home, /Licensed|Bonded|MnDOT-approved|Government-certified|DBE certified|TGB certified|Trusted by government agencies|Awarded public contracts|Workers comp/i);
});

test('remediation guardrails cover secrets, headers, prerendering, and accessible interactions', () => {
  const viteConfig = read('vite.config.ts');
  const packageJson = read('package.json');
  const vercelConfig = JSON.parse(read('vercel.json'));
  const prerender = read('scripts/prerender.mjs');
  const slider = read('src/components/BeforeAfterSlider.tsx');
  const leadForm = read('src/components/LeadForm.tsx');
  const serviceAreaMap = read('src/components/ServiceAreaMap.tsx');
  const leadsApi = read('api/leads.ts');

  assert.doesNotMatch(viteConfig, /GEMINI_API_KEY|VITE_GEMINI_API_KEY/);
  assert.doesNotMatch(packageJson, /@google\/genai/);
  assert.match(leadsApi, /function escapeHtml/);
  assert.match(leadsApi, /escapeHtml\(key\)/);
  assert.match(leadsApi, /escapeHtml\(value\)/);

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

  for (const route of ['/', '/residential', '/commercial', '/public-sector', '/projects', '/about', '/contact', '/capabilities', '/service-area', '/404']) {
    assert.match(prerender, new RegExp(`path: '${route.replace('/', '\\/')}'`));
  }
  assert.match(prerender, /404\.html/);
  assert.match(prerender, /application\/ld\+json/);
  assert.match(prerender, /fallbackContent/);

  assert.match(slider, /type="range"/);
  assert.match(slider, /aria-valuetext/);
  assert.match(slider, /onKeyDown/);
  assert.match(serviceAreaMap, /role="img"/);
  assert.match(serviceAreaMap, /aria-labelledby/);
  assert.match(serviceAreaMap, /useReducedMotion/);
  assert.doesNotMatch(serviceAreaMap, /iframe/);

  for (const label of ['Full name', 'Phone', 'Email', 'City', 'Market', 'Project type', 'Timeline', 'Budget range', 'Preferred contact method', 'Project details']) {
    assert.match(leadForm, new RegExp(`aria-label="${label}"`));
  }
});

test('local SEO and service landing pages are routable, prerendered, and listed in the sitemap', () => {
  const landingPages = read('src/data/landingPages.ts');
  const landingRoute = read('src/pages/LandingPage.tsx');
  const prerender = read('scripts/prerender.mjs');
  const sitemap = read('public/sitemap.xml');

  for (const slug of [
    'inver-grove-heights',
    'south-st-paul',
    'st-paul',
    'eagan',
    'woodbury',
    'minneapolis',
    'twin-cities',
    'interior-painting',
    'exterior-painting',
    'commercial-painting',
    'cabinet-painting',
    'drywall-repair',
    'deck-fence-staining',
    'parking-lot-striping',
    'pavement-marking',
  ]) {
    assert.match(landingPages, new RegExp(`slug: '${slug}'`));
    assert.match(prerender, new RegExp(slug));
    assert.match(sitemap, new RegExp(slug));
  }

  assert.match(landingRoute, /LeadForm/);
  assert.match(landingRoute, /landingPagePath/);
  assert.match(landingRoute, /PageMeta/);
});
