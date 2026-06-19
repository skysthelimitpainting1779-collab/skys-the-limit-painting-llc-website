import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('top-level routes use the three-market architecture in Next.js filesystem routing', () => {
  const appExists = existsSync(new URL('../src/App.tsx', import.meta.url));
  assert.ok(!appExists, 'src/App.tsx should be deleted to clean up Vite router remnants');

  for (const route of ['', 'residential', 'commercial', 'public-sector', 'projects', 'about', 'contact', 'service-area']) {
    const pagePath = route === '' ? 'src/app/page.tsx' : `src/app/${route}/page.tsx`;
    assert.ok(existsSync(new URL(`../${pagePath}`, import.meta.url)), `${pagePath} should exist`);
  }

  assert.ok(existsSync(new URL('../src/app/service-areas/[slug]/page.tsx', import.meta.url)));
  assert.ok(existsSync(new URL('../src/app/painting-services/[slug]/page.tsx', import.meta.url)));
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
  const home = read('src/app/HomeClient.tsx');

  assert.match(home, /Residential detail\. Commercial discipline\. Public-sector ready\./);
  assert.match(home, /registered Minnesota Specialty Contractor \(Painting\)/);
  assert.doesNotMatch(home, /Public-work ambition/i);
  assert.doesNotMatch(home, /Licensed|Bonded|MnDOT-approved|Government-certified|DBE certified|TGB certified|Trusted by government agencies|Awarded public contracts|Workers comp/i);
});

test('remediation guardrails cover secrets, headers, prerendering, and accessible interactions', () => {
  const viteConfigExists = existsSync(new URL('../vite.config.ts', import.meta.url));
  assert.ok(!viteConfigExists, 'vite.config.ts should be deleted to prevent client exposure of configs');

  const packageJson = read('package.json');
  const vercelConfig = JSON.parse(read('vercel.json'));
  const prerender = read('scripts/prerender.mjs');
  const slider = read('src/components/BeforeAfterSlider.tsx');
  const leadForm = read('src/components/LeadForm.tsx');
  const serviceAreaMap = read('src/components/ServiceAreaMap.tsx');
  const leadsApi = read('src/app/api/leads/route.ts');

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
  const landingRoute = read('src/views/LandingPage.tsx');
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

  // Assert that App Router dynamic page has generateMetadata for SEO headers
  const appSlugPage = read('src/app/service-areas/[slug]/page.tsx');
  assert.match(appSlugPage, /generateMetadata/);
});

test('M2 compliance and contractor registration statements are correctly set', () => {
  const layout = read('src/components/Layout.tsx');
  const footerCta = read('src/components/ConversionFooterCta.tsx');
  const refer = read('src/views/Refer.tsx');
  const estimate = read('src/views/Estimate.tsx');
  const ogPreview = read('public/og-preview.svg');

  // 1. og-preview.svg
  assert.match(ogPreview, /REGISTERED • MN SPECIALTY • INSURED/);
  assert.match(ogPreview, /width="530"/);
  assert.match(ogPreview, /MN CONTRACTOR REG\./);

  // 2. Layout.tsx
  assert.match(layout, /Registered MN Specialty Contractor \(ID: IR816596\) \| Owner exempt from workers’ comp under MN Statute 176.041 \| Fully Insured/);

  // 3. ConversionFooterCta.tsx
  assert.match(footerCta, /body: 'Registered Minnesota Specialty Contractor \(Painting\), fully insured, and owner-operator workers\\' comp exempt under MN Statute 176\.041\.',/);

  // 4. Refer.tsx
  assert.match(refer, /Sky’s the Limit Painting LLC is an owner-operated registered MN specialty contractor \(Registration ID: IR816596\) based in Inver Grove Heights\. All referrals are subject to verification\. Owner is exempt from standard workers’ comp rules under MN Statute 176\.041\./);

  // 5. Estimate.tsx
  assert.match(estimate, /\{\/\* Trust Badges & Registration Disclosures \(Fogg Motivation\) \*\/\}/);
  assert.match(estimate, /reg: ir816596 \| painting/);
});
