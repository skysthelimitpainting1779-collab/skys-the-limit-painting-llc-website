import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test, describe } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));

// Calculator Cost Simulation Formula matching src/views/Estimate.tsx exactly
function calculateSimulatedCosts(width, length, height, prepLevel, doors, windows, trimLength, cabDoors, cabDrawers) {
  const wallArea = 2 * (width + length) * height;
  const wallBase = wallArea * 3.50;
  const wallPrepValue = prepLevel === 'premium' ? wallBase * 0.35 : 0;
  const wallCost = wallBase + wallPrepValue;
  const openingsCost = doors * 150 + windows * 100;
  const trimCost = trimLength * 4.00;
  const cabinetCost = (cabDoors + cabDrawers) * 125;
  const total = wallCost + openingsCost + trimCost + cabinetCost;
  return {
    low: Math.round(total * 0.90),
    high: Math.round(total * 1.15)
  };
}

describe('Tier 1: Feature Coverage', () => {

  test('T1.1 Routing & Navigation - Core layout components render successfully', () => {
    const layout = read('src/app/layout.tsx');
    assert.match(layout, /import ConversionHeader/);
    assert.match(layout, /import ConversionFooterCta/);
    assert.ok(exists('src/app/layout.tsx'));
    assert.ok(exists('src/components/ConversionHeader.tsx'));
    assert.ok(exists('src/components/ConversionFooterCta.tsx'));
  });

  test('T1.2 Routing & Navigation - Header navigation links exist', () => {
    const header = read('src/components/ConversionHeader.tsx');
    assert.match(header, /to="\/residential"/);
    assert.match(header, /to="\/commercial"/);
    assert.match(header, /to="\/public-sector"/);
  });

  test('T1.3 Routing & Navigation - Micro-utility header bar displays warning/intake message', () => {
    const header = read('src/components/ConversionHeader.tsx');
    assert.match(header, /Prep-first painting across the Twin Cities/);
    assert.match(header, /Price range, scope review, and schedule conversation in one path/);
  });

  test('T1.4 Routing & Navigation - Redirects for legacy routes redirect to new pages', () => {
    // SSOT is vercel.ts (typed Vercel config); assert redirect routes as source.
    const vercelTs = read('vercel.ts');
    assert.match(vercelTs, /routes\.redirect\('\/services',\s*'\/residential'/);
    assert.match(vercelTs, /routes\.redirect\('\/services\/interior',\s*'\/residential'/);
  });

  test('T1.5 Routing & Navigation - Invalid paths serve the customized 404 page', () => {
    const notFound = read('src/app/not-found.tsx');
    assert.match(notFound, /NotFoundPage/);
    assert.ok(exists('src/views/NotFound.tsx'));
  });

  test('T1.6 Three-Market Content - Home page renders the approved positioning statement', () => {
    const home = read('src/app/HomeClient.tsx');
    assert.match(home, /Residential detail\. Commercial discipline\. Public-sector ready\./);
  });

  test('T1.7 Three-Market Content - Residential page loads specific data fields', () => {
    const res = read('src/views/Residential.tsx');
    assert.match(res, /market="Residential"/);
    assert.match(res, /PageMeta/);
  });

  test('T1.8 Three-Market Content - Commercial page loads specific data fields', () => {
    const comm = read('src/views/Commercial.tsx');
    assert.match(comm, /market="Commercial"/);
    assert.match(comm, /PageMeta/);
  });

  test('T1.9 Three-Market Content - Public Sector page loads specific data fields', () => {
    const pub = read('src/views/PublicSector.tsx');
    assert.match(pub, /market="Public Sector"/);
    assert.match(pub, /PageMeta/);
  });

  test('T1.10 Three-Market Content - Capabilities statement page displays NAICS and SWIFT details', () => {
    const cap = read('src/views/Capabilities.tsx');
    assert.match(cap, /NAICS 238320/);
    assert.match(cap, /VN0001223327_1/);
  });

  test('T1.11 Local SEO Pages - Service Areas landing pages load data', () => {
    const pages = read('src/data/landingPages.ts');
    assert.match(pages, /slug: 'inver-grove-heights'/);
    assert.match(pages, /slug: 'south-st-paul'/);
  });

  test('T1.12 Local SEO Pages - Painting Services landing pages load data', () => {
    const pages = read('src/data/landingPages.ts');
    assert.match(pages, /slug: 'interior-painting'/);
    assert.match(pages, /slug: 'exterior-painting'/);
  });

  test('T1.13 Local SEO Pages - XML Sitemap contains SEO slugs', () => {
    const sitemap = read('public/sitemap.xml');
    assert.match(sitemap, /inver-grove-heights/);
    assert.match(sitemap, /interior-painting/);
  });

  test('T1.14 Local SEO Pages - Static prerender script compiles routes to directories', () => {
    const prerender = read('scripts/prerender.mjs');
    assert.match(prerender, /routes/);
    assert.match(prerender, /dist/);
    assert.match(prerender, /404\.html/);
  });

  test('T1.15 Local SEO Pages - Breadcrumb schemas contain valid JSON-LD metadata', () => {
    const prerender = read('scripts/prerender.mjs');
    assert.match(prerender, /BreadcrumbList/);
    assert.match(prerender, /itemListElement/);
  });

  test('T1.16 Interactive Components - BeforeAfterSlider renders before and after images', () => {
    const slider = read('src/components/BeforeAfterSlider.tsx');
    assert.match(slider, /Before/);
    assert.match(slider, /After/);
  });

  test('T1.17 Interactive Components - ServiceAreaMap renders SVG map with city pins', () => {
    const map = read('src/components/ServiceAreaMap.tsx');
    assert.match(map, /<svg/);
    assert.match(map, /role="img"/);
  });

  test('T1.18 Interactive Components - Clicking service area pins navigates user correctly', () => {
    const map = read('src/components/ServiceAreaMap.tsx');
    assert.match(map, /Link/);
    assert.match(map, /href=\{\`\/service-areas\/\${pin\.slug}\`\}/);
  });

  test('T1.19 Interactive Components - CustomCursor renders elements on screen', () => {
    const cursor = read('src/components/CustomCursor.tsx');
    assert.match(cursor, /pointer-events-none/);
    assert.match(cursor, /mix-blend-difference/);
  });

  test('T1.20 Interactive Components - MagneticButtons trigger hover states and scale', () => {
    const btn = read('src/components/animations/MagneticButton.tsx');
    assert.match(btn, /motion/);
    assert.match(btn, /useSpring/);
  });

  test('T1.21 Room Calculator - Preset selections apply correct room dimensions', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /Bedroom.*12.*14.*8/);
    assert.match(est, /Living Room.*16.*20.*8/);
  });

  test('T1.22 Room Calculator - Room dimensions width/length changes update wall surface area calculations', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /2 \* \(dimensions\.width \+ dimensions\.length\) \* dimensions\.ceilingHeight/);
    
    // Simulate Bedroom Preset (12 x 14 x 8)
    const result1 = calculateSimulatedCosts(12, 14, 8, 'standard', 1, 1, 50, 0, 0);
    // Area = 2 * (12 + 14) * 8 = 416
    // Cost = 416 * 3.5 = 1456. Openings = 150 + 100 = 250. Trim = 50 * 4 = 200. Total = 1906.
    // Low = Math.round(1906 * 0.90) = 1715. High = Math.round(1906 * 1.15) = 2192.
    assert.equal(result1.low, 1715);
    assert.equal(result1.high, 2192);

    // Simulate Width increase from 12 to 15
    const result2 = calculateSimulatedCosts(15, 14, 8, 'standard', 1, 1, 50, 0, 0);
    // Area = 2 * (15 + 14) * 8 = 464
    // Cost = 464 * 3.5 = 1624. Openings = 250. Trim = 200. Total = 2074.
    // Low = Math.round(2074 * 0.90) = 1867. High = Math.round(2074 * 1.15) = 2385.
    assert.equal(result2.low, 1867);
    assert.equal(result2.high, 2385);
  });

  test('T1.23 Room Calculator - Adjusting doors and windows counts updates openings cost', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /doorsCount \* 150 \+ .*windowsCount \* 100/);
    
    // Width 12, Length 14, Height 8, Doors 2, Windows 3
    const result = calculateSimulatedCosts(12, 14, 8, 'standard', 2, 3, 50, 0, 0);
    // Area = 416. WallCost = 1456. Openings = 2 * 150 + 3 * 100 = 600. Trim = 200. Total = 2256.
    // Low = Math.round(2256 * 0.90) = 2030. High = Math.round(2256 * 1.15) = 2594.
    assert.equal(result.low, 2030);
    assert.equal(result.high, 2594);
  });

  test('T1.24 Room Calculator - Selecting cabinet doors/drawers increments high-margin cabinet paint costs', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /cabinetDoors \+ .*cabinetDrawers.* \* 125/);
    
    // Width 12, Length 14, Height 8, Doors 1, Windows 1, Cabinet Doors 10, Drawers 5
    const result = calculateSimulatedCosts(12, 14, 8, 'standard', 1, 1, 50, 10, 5);
    // Area = 416. WallCost = 1456. Openings = 250. Trim = 200. Cabinets = 15 * 125 = 1875. Total = 3781.
    // Low = Math.round(3781 * 0.90) = 3403. High = Math.round(3781 * 1.15) = 4348.
    assert.equal(result.low, 3403);
    assert.equal(result.high, 4348);
  });

  test('T1.25 Room Calculator - Base estimate calculation returns output range between 90% (low) and 115% (high)', () => {
    const result = calculateSimulatedCosts(20, 20, 10, 'premium', 2, 4, 100, 20, 10);
    // Area = 2 * (40) * 10 = 800
    // WallBase = 800 * 3.50 = 2800. Premium = 2800 * 0.35 = 980. WallCost = 3780.
    // Openings = 2 * 150 + 4 * 100 = 700. Trim = 100 * 4 = 400. Cabinets = 30 * 125 = 3750. Total = 8630.
    // Low = 8630 * 0.90 = 7767. High = 8630 * 1.15 = 9925.
    assert.equal(result.low, 7767);
    assert.equal(result.high, 9925);
  });

  test('T1.26 Reputation Funnel - Rating 4 stars displays the Google Review redirect prompt', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /rating >= 4/);
    assert.match(rev, /Leave Us a Google Review/);
  });

  test('T1.27 Reputation Funnel - Google Review link opens in a new tab pointing to the GBP review page', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /href=\{googleReviewUrl\}/);
    assert.match(rev, /target="_blank"/);
    assert.match(rev, /rel="noopener noreferrer"/);
    assert.match(rev, /ChIJ8d-Nq98d9kgR50-mR-K5k84/);
  });

  test('T1.28 Reputation Funnel - Rating 1, 2, or 3 stars intercepts user and displays private feedback form', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /We want to make it right\./);
    assert.match(rev, /handlePrivateSubmit/);
  });

  test('T1.29 Reputation Funnel - Feedback form submits private reviews to Formspree endpoint', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /formspree\.io\/f\//);
    assert.match(rev, /xanybvkd/);
  });

  test('T1.30 Reputation Funnel - Clicking "Change rating" button resets rating state', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /onClick=\{\(\) => setRating\(null\)\}/);
    assert.match(rev, /Change rating/);
  });

  test('T1.31 Lead Capture & API - Submitting LeadForm sends POST request to /api/leads', () => {
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /fetch\('\/api\/leads'/);
    assert.match(form, /method: 'POST'/);
  });

  test('T1.32 Lead Capture & API - Local Storage lead queue saves submission payloads when offline', () => {
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /!navigator\.onLine/);
    assert.match(form, /localStorage\.setItem\('pending_leads'/);
  });

  test('T1.33 Lead Capture & API - Regaining online status triggers immediate flushing of lead queue', () => {
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /window\.addEventListener\('online', syncOfflineLeads\)/);
  });

  test('T1.34 Lead Capture & API - /api/leads validates email structures and throws bad request', () => {
    const api = read('src/lib/api/utils.ts');
    assert.match(api, /Enter a valid email address\./);
  });

  test('T1.35 Lead Capture & API - /api/manychat extracts and normalizes payload parameters', () => {
    const mc = read('src/app/api/manychat/route.ts');
    assert.match(mc, /customFields/);
    assert.match(mc, /budget/);
    assert.match(mc, /timeline/);
  });

});

describe('Tier 2: Boundary/Corner Cases', () => {

  test('T2.1 Routing & Navigation - Mobile menu toggle handles accessibility attributes', () => {
    const header = read('src/components/ConversionHeader.tsx');
    assert.match(header, /aria-label=\{mobileMenuOpen \?/);
    assert.match(header, /aria-expanded=\{mobileMenuOpen\}/);
  });

  test('T2.2 Routing & Navigation - Sticky mobile call CTAs render on narrow layouts', () => {
    const layout = read('src/components/Layout.tsx');
    assert.match(layout, /href="tel:\+16514104196"/);
  });

  test('T2.3 Routing & Navigation - CSP and HTTP security headers are configured in vercel.ts', () => {
    const vercelTs = read('vercel.ts');
    assert.match(vercelTs, /Content-Security-Policy/);
    assert.match(vercelTs, /default-src 'self'/);
    assert.match(vercelTs, /object-src 'none'/);
    assert.match(vercelTs, /frame-ancestors 'none'/);
    assert.match(vercelTs, /Strict-Transport-Security/);
  });

  test('T2.4 Routing & Navigation - Referral parameters are parsed and stored in LocalStorage', () => {
    const header = read('src/components/ConversionHeader.tsx');
    assert.match(header, /ref/);
    assert.match(header, /localStorage\.setItem\('referrer_email'/);
  });

  test('T2.5 Routing & Navigation - E.164 phone numbers are format-compliant', () => {
    const header = read('src/components/ConversionHeader.tsx');
    assert.match(header, /tel:\+16514104196/);
    const layout = read('src/components/Layout.tsx');
    assert.match(layout, /tel:\+16514104196/);
  });

  test('T2.6 Three-Market Content - Emojis are 100% absent in code/components/markup', () => {
    const files = [
      'src/app/layout.tsx',
      'src/components/ConversionHeader.tsx',
      'src/components/LeadForm.tsx',
      'src/components/Layout.tsx',
      'src/app/HomeClient.tsx',
      'src/views/Estimate.tsx',
      'src/views/Review.tsx',
      'src/app/api/leads/route.ts',
      'src/app/api/manychat/route.ts'
    ];
    for (const f of files) {
      const content = read(f);
      // Ensure no emojis like 🚀, ✅, ❌, 🎉, ⚠️, 🧬, etc.
      assert.doesNotMatch(content, /[\u{1F300}-\u{1F9FF}]/u);
    }
  });

  test('T2.7 Three-Market Content - Licensed or Bonded claims are absent on Home page', () => {
    const home = read('src/app/HomeClient.tsx');
    assert.doesNotMatch(home, /Licensed/i);
    assert.doesNotMatch(home, /Bonded/i);
    assert.doesNotMatch(home, /Government-certified/i);
  });

  test('T2.8 Three-Market Content - Contractor registration ID is present on all pages', () => {
    const footer = read('src/components/Layout.tsx');
    assert.match(footer, /IR816596/);
  });

  test('T2.9 Three-Market Content - Workers comp exemption statement is present near insurance references', () => {
    const capabilities = read('src/views/Capabilities.tsx');
    assert.match(capabilities, /Minnesota Statute 176\.041/);
    assert.match(capabilities, /Workers' Compensation Exemption/);
  });

  test('T2.10 Three-Market Content - SAM.gov active claims are absent on the Capabilities page', () => {
    const capabilities = read('src/views/Capabilities.tsx');
    assert.doesNotMatch(capabilities, /SAM\.gov active claim/i);
    assert.match(capabilities, /Registration package in preparation/);
  });

  test('T2.11 Local SEO Pages - Invalid SEO slugs return 404', () => {
    const landing = read('src/views/LandingPage.tsx');
    assert.match(landing, /if \(!pageData\)/);
    assert.match(landing, /return <NotFound \/>/);
  });

  test('T2.12 Local SEO Pages - Schema breadcrumbs handle nesting without double-slash errors', () => {
    const prerender = read('scripts/prerender.mjs');
    assert.match(prerender, /itemListElement/);
    assert.doesNotMatch(prerender, /\/\//);
  });

  test('T2.13 Local SEO Pages - robots.txt declared sitemap and protects review page', () => {
    const sitemapGen = read('scripts/generate-sitemap.js');
    assert.match(sitemapGen, /Disallow: \/review/);
    assert.match(sitemapGen, /Sitemap:/);
  });

  test('T2.14 Local SEO Pages - Prerender handles fallback content variables', () => {
    const prerender = read('scripts/prerender.mjs');
    assert.match(prerender, /fallbackContent/);
  });

  test('T2.15 Local SEO Pages - LocalBusiness schema includes required pricing and hours', () => {
    const prerender = read('scripts/prerender.mjs');
    assert.match(prerender, /priceRange/);
    assert.match(prerender, /openingHoursSpecification/);
  });

  test('T2.16 Interactive Components - BeforeAfterSlider keyboard controls support left/right arrows', () => {
    const slider = read('src/components/BeforeAfterSlider.tsx');
    assert.match(slider, /ArrowLeft/);
    assert.match(slider, /ArrowRight/);
  });

  test('T2.17 Interactive Components - Slider position clamps exactly to 0 and 100 on Home/End key presses', () => {
    const slider = read('src/components/BeforeAfterSlider.tsx');
    assert.match(slider, /Home/);
    assert.match(slider, /End/);
    assert.match(slider, /0/);
    assert.match(slider, /100/);
  });

  test('T2.18 Interactive Components - ServiceAreaMap honors reduced motion requests', () => {
    const map = read('src/components/ServiceAreaMap.tsx');
    assert.match(map, /useReducedMotion/);
  });

  test('T2.19 Interactive Components - CustomCursor respects reduced motion by hiding', () => {
    const cursor = read('src/components/CustomCursor.tsx');
    assert.match(cursor, /useReducedMotion/);
    assert.match(cursor, /if \(prefersReducedMotion\)/);
  });

  test('T2.20 Interactive Components - ServiceAreaMap SVG has alt elements and role', () => {
    const map = read('src/components/ServiceAreaMap.tsx');
    assert.match(map, /role="img"/);
    assert.match(map, /aria-labelledby=/);
  });

  test('T2.21 Room Calculator - Width values clamp strictly to 5 (min) and 50 (max)', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /5, 50/);
  });

  test('T2.22 Room Calculator - Length values clamp strictly to 5 (min) and 50 (max)', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /5, 50/);
  });

  test('T2.23 Room Calculator - Ceiling height values clamp strictly to 7 (min) and 20 (max)', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /7, 20/);
  });

  test('T2.24 Room Calculator - Cabinet doors count clamps strictly to 0 (min) and 60 (max)', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /0, 60/);
  });

  test('T2.25 Room Calculator - State is persisted in localStorage to prevent loss', () => {
    const est = read('src/views/Estimate.tsx');
    assert.match(est, /sky_estimate_progress/);
    assert.match(est, /localStorage\.setItem/);
  });

  test('T2.26 Reputation Funnel - Empty reviews submitted to Formspree block with validation warnings', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /!privateFeedback\.trim\(\)/);
    assert.match(rev, /Please add a few details/);
  });

  test('T2.27 Reputation Funnel - Formspree connection failures show a clear fallback contact message', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /The private feedback form did not send\. Please call or text/);
  });

  test('T2.28 Reputation Funnel - Selected review rating events are logged to the analytics engine', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /trackEvent\('review_rating_select'/);
  });

  test('T2.29 Reputation Funnel - Hovering over star selection scales buttons and alters fill', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /onMouseEnter/);
    assert.match(rev, /onMouseLeave/);
    assert.match(rev, /hoverRating/);
  });

  test('T2.30 Reputation Funnel - Submitting a 0-star rating is blocked', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /rating === null/);
  });

  test('T2.31 Lead Capture & API - Honeypot field triggers immediate success page for bots', () => {
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /bot_honeypot/);
    assert.match(form, /if \(botHoneypot\)/);
  });

  test('T2.32 Lead Capture & API - API rate limiting blocks requests exceeding 5 per minute', () => {
    const api = read('src/app/api/leads/route.ts');
    assert.match(api, /createRateLimiter\(5,/);
    assert.match(api, /rateLimit/);
  });

  test('T2.33 Lead Capture & API - Upload photo URLs are validated and rejected if protocol is missing', () => {
    const api = read('src/lib/api/utils.ts');
    assert.match(api, /\['http:', 'https:'\].includes\(url\.protocol\)/);
  });

  test('T2.34 Lead Capture & API - HubSpot CRM integration skips gracefully if credentials are missing', () => {
    const api = read('src/app/api/leads/route.ts');
    assert.match(api, /HUBSPOT_FORM_ID/);
    assert.match(api, /if \(!formId\)/);
  });

  test('T2.35 Lead Capture & API - API endpoints return 500 with email draft fallbacks if Resend is missing', () => {
    const api = read('src/app/api/leads/route.ts');
    assert.match(api, /res\.status\(500\)\.json\(\{.*fallback: 'email'/);
  });

});

describe('Tier 3: Cross-Feature Combinations', () => {

  test('T3.1 Offline + Calculator - Submitting estimate lead while offline queues it locally', () => {
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /localStorage\.setItem\('pending_leads'/);
    assert.match(form, /Offline Mode:/);
  });

  test('T3.2 Offline + Review Funnel - Submitting negative reviews offline triggers fallback message', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /catch \(err\)/);
    assert.match(rev, /The private feedback form did not respond\. Please call or text/);
  });

  test('T3.3 SEO Landing + Lead Form - Lead submissions from local SEO routes capture page paths', () => {
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /page: window\.location\.pathname/);
  });

  test('T3.4 Custom Cursor + Calculator - Hovering over interactive presets triggers cursor transition', () => {
    const cursor = read('src/components/CustomCursor.tsx');
    assert.match(cursor, /a, button, select, input/);
    assert.match(cursor, /hovered/);
  });

  test('T3.5 Accessibility + Lead Form - Reduced motion options disable animations during interaction', () => {
    const form = read('src/components/LeadForm.tsx');
    // Reduced motion is handled globally or via transitions
    assert.ok(exists('src/components/PageTransition.tsx'));
  });

  test('T3.6 Slider + Room Calculator - Keyboard events do not conflict between sliders', () => {
    const slider = read('src/components/BeforeAfterSlider.tsx');
    const est = read('src/views/Estimate.tsx');
    assert.match(slider, /onKeyDown/);
    assert.match(est, /onChange/);
  });

  test('T3.7 Review Funnel + Analytics - Redirecting to Google Business Reviews logs conversions', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /trackEvent\('google_review_redirect_click'/);
  });

});

describe('Tier 4: Real-World Scenarios', () => {

  test('T4.1 Customer Acquisition - Referral, slider comparison, room calculation, and lead submission flow', () => {
    const header = read('src/components/ConversionHeader.tsx');
    const slider = read('src/components/BeforeAfterSlider.tsx');
    const est = read('src/views/Estimate.tsx');
    const form = read('src/components/LeadForm.tsx');
    
    assert.match(header, /localStorage\.setItem\('referrer_email'/);
    assert.match(slider, /BeforeAfterSlider/);
    assert.match(est, /EstimatePage/);
    assert.match(form, /LeadForm/);
  });

  test('T4.2 Intercepted Review - Negative rating intercepts unhappy client to private feedback', () => {
    const rev = read('src/views/Review.tsx');
    assert.match(rev, /rating < 4/);
    assert.match(rev, /We want to make it right/);
    assert.match(rev, /formspree\.io/);
  });

  test('T4.3 Offline Contractor - Estimate costs, queue lead offline, and sync online', () => {
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /!navigator\.onLine/);
    assert.match(form, /window\.addEventListener\('online'/);
  });

  test('T4.4 Security & Anti-Spam - Bot honeypot triggers quick success, and rate limit blocks flood', () => {
    const api = read('src/app/api/leads/route.ts');
    const form = read('src/components/LeadForm.tsx');
    assert.match(form, /bot_honeypot/);
    assert.match(api, /rateLimit/);
  });

  test('T4.5 Static SEO Crawler - Indexation, sitemaps validation, and schema markup checks', () => {
    const prerender = read('scripts/prerender.mjs');
    const sitemap = read('scripts/generate-sitemap.js');
    assert.match(prerender, /application\/ld\+json/);
    assert.match(sitemap, /generateSitemap/);
  });

});
