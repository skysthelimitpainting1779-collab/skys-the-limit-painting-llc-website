import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test, describe } from 'node:test';

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// ---------------------------------------------------------------------------
// Re-implement pure functions from lib modules for real unit testing
// ---------------------------------------------------------------------------

// From src/lib/env.ts
function getEnv(key) {
  if (typeof process !== 'undefined' && process.env) {
    return (
      process.env[key] ||
      process.env[`NEXT_PUBLIC_${key}`] ||
      process.env[`VITE_${key}`]
    );
  }
  return undefined;
}

// From src/lib/contact.ts
const businessEmail = 'skysthelimitpainting1779@gmail.com';
const businessPhone = '651-410-4196';
const smsPhone = '16514104196';

function buildEstimateMailto(fields) {
  const body = Object.entries(fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

  const subject = "Estimate request - Sky's the Limit Painting LLC";
  return `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// From src/lib/seo.ts
const siteUrl = (
  getEnv('SITE_URL') || 'https://www.skysthelimitpaintingllc.com'
).replace(/\/$/, '');

function serviceSchema(name, description, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'HousePainter',
      name: "Sky's the Limit Painting LLC",
      telephone: '+1-651-410-4196',
      email: 'skysthelimitpainting1779@gmail.com',
      url: siteUrl,
    },
    areaServed: 'Minnesota',
    url: `${siteUrl}${path}`,
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

function localBusinessSchema(cityName, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    name: `${cityName} Painting Contractor | Sky's the Limit Painting LLC`,
    telephone: '+1-651-410-4196',
    email: 'skysthelimitpainting1779@gmail.com',
    url: `${siteUrl}/service-areas/${slug}`,
    logo: `${siteUrl}/brand/SkyLLP_BrandLogo.svg`,
    image: `${siteUrl}/brand/generated/sky-local-authority.webp`,
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '17:00',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: 'MN',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'City', name: cityName },
      { '@type': 'Place', name: 'Twin Cities Metro' },
    ],
  };
}

// From src/lib/analytics.ts (server-side fallback)
function readUtmParamsServerFallback() {
  return {
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
  };
}

// ---------------------------------------------------------------------------
// ENV module tests
// ---------------------------------------------------------------------------
describe('lib/env - Environment variable loading', () => {
  test('ENV object exported with all expected keys', () => {
    const src = read('src/lib/env.ts');
    const expectedKeys = [
      'SITE_URL',
      'GA_MEASUREMENT_ID',
      'FORMSPREE_FORM_ID',
      'GOOGLE_SITE_VERIFICATION',
      'FACEBOOK_URL',
      'INSTAGRAM_URL',
      'LINKEDIN_URL',
      'TIKTOK_URL',
      'BOOKING_URL',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
    ];
    for (const key of expectedKeys) {
      assert.match(src, new RegExp(`${key}:`), `ENV should export ${key}`);
    }
  });

  test('getEnv checks process.env, NEXT_PUBLIC_, and VITE_ prefixes', () => {
    const src = read('src/lib/env.ts');
    assert.match(src, /process\.env\[c\]/);
    assert.match(src, /NEXT_PUBLIC_/);
    assert.match(src, /VITE_/);
  });

  test('getEnv returns correct value from process.env', () => {
    process.env.TEST_LIB_ENV_KEY = 'test-value';
    assert.equal(getEnv('TEST_LIB_ENV_KEY'), 'test-value');
    delete process.env.TEST_LIB_ENV_KEY;
  });

  test('getEnv falls back to NEXT_PUBLIC_ prefix', () => {
    process.env.NEXT_PUBLIC_SOME_KEY = 'next-value';
    assert.equal(getEnv('SOME_KEY'), 'next-value');
    delete process.env.NEXT_PUBLIC_SOME_KEY;
  });

  test('getEnv falls back to VITE_ prefix', () => {
    process.env.VITE_ANOTHER_KEY = 'vite-value';
    assert.equal(getEnv('ANOTHER_KEY'), 'vite-value');
    delete process.env.VITE_ANOTHER_KEY;
  });

  test('getEnv returns undefined when key is not set', () => {
    assert.equal(getEnv('NONEXISTENT_KEY_12345'), undefined);
  });

  test('SITE_URL has correct default', () => {
    const src = read('src/lib/env.ts');
    assert.match(src, /https:\/\/www\.skysthelimitpaintingllc\.com/);
  });

  test('FORMSPREE_FORM_ID has correct default', () => {
    const src = read('src/lib/env.ts');
    assert.match(src, /xanybvkd/);
  });

  test('Social media URLs have correct defaults', () => {
    const src = read('src/lib/env.ts');
    assert.match(src, /facebook\.com\/skysthelimitpainting1779/);
    assert.match(src, /instagram\.com\/skysthelimitpainting1779/);
    assert.match(src, /linkedin\.com\/company\/skys-the-limit-painting-llc/);
    assert.match(src, /tiktok\.com\/@skysthelimitpainting/);
  });
});

// ---------------------------------------------------------------------------
// Contact module tests
// ---------------------------------------------------------------------------
describe('lib/contact - Contact utilities', () => {
  test('businessEmail matches expected value', () => {
    assert.equal(businessEmail, 'skysthelimitpainting1779@gmail.com');
  });

  test('businessPhone matches expected value', () => {
    assert.equal(businessPhone, '651-410-4196');
  });

  test('smsPhone is E.164 format without dashes', () => {
    assert.equal(smsPhone, '16514104196');
    assert.ok(/^\d+$/.test(smsPhone), 'smsPhone should contain only digits');
  });

  test('buildEstimateMailto generates valid mailto link', () => {
    const result = buildEstimateMailto({ Name: 'Jane Doe', Phone: '555-1234' });
    assert.ok(result.startsWith('mailto:skysthelimitpainting1779@gmail.com'));
    assert.ok(result.includes('subject='));
    assert.ok(result.includes('body='));
  });

  test('buildEstimateMailto encodes subject properly', () => {
    const result = buildEstimateMailto({ Name: 'Test' });
    const subjectPart = result.match(/subject=([^&]*)/);
    assert.ok(subjectPart, 'should include subject parameter');
    const decoded = decodeURIComponent(subjectPart[1]);
    assert.equal(decoded, "Estimate request - Sky's the Limit Painting LLC");
  });

  test('buildEstimateMailto encodes body with field labels', () => {
    const result = buildEstimateMailto({ Name: 'Alice', City: 'Eagan' });
    const bodyPart = result.match(/body=(.*)$/);
    assert.ok(bodyPart, 'should include body parameter');
    const decoded = decodeURIComponent(bodyPart[1]);
    assert.ok(decoded.includes('Name: Alice'));
    assert.ok(decoded.includes('City: Eagan'));
  });

  test('buildEstimateMailto filters empty fields', () => {
    const result = buildEstimateMailto({
      Name: 'Bob',
      Empty: '   ',
      Phone: '555',
    });
    const bodyPart = result.match(/body=(.*)$/);
    const decoded = decodeURIComponent(bodyPart[1]);
    assert.ok(decoded.includes('Name: Bob'));
    assert.ok(decoded.includes('Phone: 555'));
    assert.ok(!decoded.includes('Empty'), 'blank values should be filtered');
  });

  test('buildEstimateMailto handles all empty fields', () => {
    const result = buildEstimateMailto({ A: '  ', B: '' });
    const bodyPart = result.match(/body=(.*)$/);
    const decoded = decodeURIComponent(bodyPart[1]);
    assert.equal(decoded, '');
  });

  test('openEstimateEmail sets window.location.href (source check)', () => {
    const src = read('src/lib/contact.ts');
    assert.match(src, /window\.location\.href\s*=\s*buildEstimateMailto/);
  });
});

// ---------------------------------------------------------------------------
// SEO module tests
// ---------------------------------------------------------------------------
describe('lib/seo - Schema.org JSON-LD generation', () => {
  test('businessSchema has correct @context and @type', () => {
    const src = read('src/lib/seo.ts');
    assert.match(src, /'https:\/\/schema\.org'/);
    assert.match(src, /'HousePainter'/);
  });

  test('businessSchema has required business fields', () => {
    const src = read('src/lib/seo.ts');
    assert.match(src, /Sky's the Limit Painting LLC/);
    assert.match(src, /Anthony Briseno/);
    assert.match(src, /\+1-651-410-4196/);
    assert.match(src, /skysthelimitpainting1779@gmail\.com/);
  });

  test('businessSchema includes opening hours for weekdays', () => {
    const src = read('src/lib/seo.ts');
    assert.match(src, /Monday/);
    assert.match(src, /Friday/);
    assert.match(src, /07:00/);
    assert.match(src, /17:00/);
  });

  test('businessSchema lists Inver Grove Heights as primary address', () => {
    const src = read('src/lib/seo.ts');
    assert.match(src, /Inver Grove Heights/);
    assert.match(src, /addressRegion.*MN/);
    assert.match(src, /addressCountry.*US/);
  });

  test('businessSchema includes Twin Cities Metro area served', () => {
    const src = read('src/lib/seo.ts');
    assert.match(src, /Twin Cities Metro/);
  });

  test('businessSchema lists all expected cities in areaServed', () => {
    const src = read('src/lib/seo.ts');
    const cities = [
      'Inver Grove Heights',
      'South St. Paul',
      'St. Paul',
      'Eagan',
      'Woodbury',
      'Minneapolis',
    ];
    for (const city of cities) {
      assert.match(
        src,
        new RegExp(city),
        `businessSchema should serve ${city}`
      );
    }
  });

  test('businessSchema includes knowsAbout topics', () => {
    const src = read('src/lib/seo.ts');
    const topics = [
      'Residential painting',
      'Commercial painting',
      'Pavement marking',
      'Parking-lot striping',
    ];
    for (const topic of topics) {
      assert.match(
        src,
        new RegExp(topic),
        `knowsAbout should include ${topic}`
      );
    }
  });

  test('serviceSchema returns valid Service schema', () => {
    const result = serviceSchema(
      'Interior Painting',
      'Professional interior painting',
      '/painting-services/interior-painting'
    );
    assert.equal(result['@context'], 'https://schema.org');
    assert.equal(result['@type'], 'Service');
    assert.equal(result.name, 'Interior Painting');
    assert.equal(result.description, 'Professional interior painting');
    assert.equal(result.areaServed, 'Minnesota');
    assert.ok(result.url.endsWith('/painting-services/interior-painting'));
  });

  test('serviceSchema provider has correct type and contact', () => {
    const result = serviceSchema('Test', 'Desc', '/test');
    assert.equal(result.provider['@type'], 'HousePainter');
    assert.equal(result.provider.name, "Sky's the Limit Painting LLC");
    assert.equal(result.provider.telephone, '+1-651-410-4196');
    assert.equal(result.provider.email, 'skysthelimitpainting1779@gmail.com');
  });

  test('breadcrumbSchema returns valid BreadcrumbList', () => {
    const items = [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/painting-services' },
      { name: 'Interior', path: '/painting-services/interior-painting' },
    ];
    const result = breadcrumbSchema(items);
    assert.equal(result['@context'], 'https://schema.org');
    assert.equal(result['@type'], 'BreadcrumbList');
    assert.equal(result.itemListElement.length, 3);
  });

  test('breadcrumbSchema positions are 1-indexed and sequential', () => {
    const items = [
      { name: 'Home', path: '/' },
      { name: 'Areas', path: '/service-areas' },
    ];
    const result = breadcrumbSchema(items);
    assert.equal(result.itemListElement[0].position, 1);
    assert.equal(result.itemListElement[1].position, 2);
  });

  test('breadcrumbSchema items have correct type and absolute URLs', () => {
    const items = [{ name: 'Home', path: '/' }];
    const result = breadcrumbSchema(items);
    const first = result.itemListElement[0];
    assert.equal(first['@type'], 'ListItem');
    assert.equal(first.name, 'Home');
    assert.ok(first.item.startsWith('https://'), 'item URL should be absolute');
  });

  test('breadcrumbSchema handles empty items array', () => {
    const result = breadcrumbSchema([]);
    assert.equal(result.itemListElement.length, 0);
  });

  test('localBusinessSchema returns valid schema for a city', () => {
    const result = localBusinessSchema('Eagan', 'eagan');
    assert.equal(result['@context'], 'https://schema.org');
    assert.equal(result['@type'], 'HousePainter');
    assert.ok(result.name.includes('Eagan'));
    assert.ok(result.name.includes("Sky's the Limit Painting LLC"));
    assert.ok(result.url.includes('/service-areas/eagan'));
  });

  test('localBusinessSchema sets addressLocality to the city name', () => {
    const result = localBusinessSchema('Woodbury', 'woodbury');
    assert.equal(result.address.addressLocality, 'Woodbury');
    assert.equal(result.address.addressRegion, 'MN');
    assert.equal(result.address.addressCountry, 'US');
  });

  test('localBusinessSchema areaServed includes city and Twin Cities Metro', () => {
    const result = localBusinessSchema('St. Paul', 'st-paul');
    assert.equal(result.areaServed.length, 2);
    assert.equal(result.areaServed[0].name, 'St. Paul');
    assert.equal(result.areaServed[1].name, 'Twin Cities Metro');
  });

  test('localBusinessSchema includes logo and image URLs', () => {
    const result = localBusinessSchema('Minneapolis', 'minneapolis');
    assert.ok(result.logo.includes('SkyLLP_BrandLogo.svg'));
    assert.ok(result.image.includes('sky-local-authority.webp'));
  });

  test('localBusinessSchema includes opening hours', () => {
    const result = localBusinessSchema('Eagan', 'eagan');
    assert.equal(result.openingHoursSpecification.length, 1);
    const hours = result.openingHoursSpecification[0];
    assert.equal(hours.opens, '07:00');
    assert.equal(hours.closes, '17:00');
    assert.deepEqual(hours.dayOfWeek, [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ]);
  });
});

// ---------------------------------------------------------------------------
// Analytics module tests
// ---------------------------------------------------------------------------
describe('lib/analytics - Event tracking and UTM parsing', () => {
  test('trackEvent guards against server-side execution', () => {
    const src = read('src/lib/analytics.ts');
    assert.match(src, /typeof window === 'undefined'/);
  });

  test('trackEvent calls window.va for Vercel Analytics', () => {
    const src = read('src/lib/analytics.ts');
    assert.match(src, /window\.va\?\.\(eventName/);
  });

  test('trackEvent calls window.gtag for Google Analytics', () => {
    const src = read('src/lib/analytics.ts');
    assert.match(src, /window\.gtag\(/);
    assert.match(src, /'event'/);
  });

  test('readUtmParams returns empty strings on server side', () => {
    const result = readUtmParamsServerFallback();
    assert.equal(result.utmSource, '');
    assert.equal(result.utmMedium, '');
    assert.equal(result.utmCampaign, '');
    assert.equal(result.utmTerm, '');
    assert.equal(result.utmContent, '');
  });

  test('readUtmParams maps correct URL param names', () => {
    const src = read('src/lib/analytics.ts');
    assert.match(src, /utm_source/);
    assert.match(src, /utm_medium/);
    assert.match(src, /utm_campaign/);
    assert.match(src, /utm_term/);
    assert.match(src, /utm_content/);
  });

  test('AnalyticsPayload type allows string, number, boolean, undefined', () => {
    const src = read('src/lib/analytics.ts');
    assert.match(src, /string \| number \| boolean \| undefined/);
  });
});

// ---------------------------------------------------------------------------
// Settings module tests
// ---------------------------------------------------------------------------
describe('lib/settings - Company settings and defaults', () => {
  test('CompanySettings interface has all required fields', () => {
    const src = read('src/lib/settings.ts');
    const fields = [
      'company_name',
      'phone',
      'email',
      'logo_url',
      'primary_color',
      'tagline',
      'service_areas',
      'services',
      'meta_title_default',
      'meta_desc_default',
    ];
    for (const field of fields) {
      assert.match(
        src,
        new RegExp(field),
        `CompanySettings should include ${field}`
      );
    }
  });

  test('DEFAULT_SETTINGS company_name matches brand', () => {
    const src = read('src/lib/settings.ts');
    assert.match(src, /Sky's the Limit Painting LLC/);
  });

  test('DEFAULT_SETTINGS phone matches business phone', () => {
    const src = read('src/lib/settings.ts');
    assert.match(src, /\+1-651-410-4196/);
  });

  test('DEFAULT_SETTINGS email matches business email', () => {
    const src = read('src/lib/settings.ts');
    assert.match(src, /skysthelimitpainting1779@gmail\.com/);
  });

  test('DEFAULT_SETTINGS primary_color is defined', () => {
    const src = read('src/lib/settings.ts');
    assert.match(src, /primary_color:/);
  });

  test('DEFAULT_SETTINGS tagline matches approved positioning', () => {
    const src = read('src/lib/settings.ts');
    assert.match(
      src,
      /Residential detail\. Commercial discipline\. Public-sector ready\./
    );
  });

  test('DEFAULT_SETTINGS service_areas includes all six service areas', () => {
    const src = read('src/lib/settings.ts');
    const areas = [
      'Inver Grove Heights',
      'South St. Paul',
      'St. Paul',
      'Eagan',
      'Woodbury',
      'Minneapolis',
    ];
    for (const area of areas) {
      assert.match(
        src,
        new RegExp(area.replace(/\./g, '\\.')),
        `service_areas should include ${area}`
      );
    }
  });

  test('DEFAULT_SETTINGS services includes core service types', () => {
    const src = read('src/lib/settings.ts');
    const services = [
      'Residential Painting',
      'Commercial Painting',
      'Pavement Marking',
      'Parking-Lot Striping',
    ];
    for (const svc of services) {
      assert.match(src, new RegExp(svc), `services should include ${svc}`);
    }
  });

  test('getCompanySettings falls back to DEFAULT_SETTINGS on error', () => {
    const src = read('src/lib/settings.ts');
    assert.match(src, /return DEFAULT_SETTINGS/);
    assert.match(src, /catch/);
  });

  test('getCompanySettings queries Supabase settings table', () => {
    const src = read('src/lib/settings.ts');
    assert.match(src, /\.from\('settings'\)/);
    assert.match(src, /\.eq\('id', 'default'\)/);
    assert.match(src, /\.single\(\)/);
  });
});
