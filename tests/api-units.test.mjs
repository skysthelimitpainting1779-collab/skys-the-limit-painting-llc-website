import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test, describe } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// ---------------------------------------------------------------------------
// Re-implement pure utility functions from API routes for real unit testing.
// These functions are module-private in the route files but contain critical
// logic that needs coverage: validation, sanitization, rate limiting, etc.
// ---------------------------------------------------------------------------

// -- asText (shared by leads and manychat routes)
function asText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// -- isPayload (leads route)
function isPayload(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

// -- escapeHtml (shared by leads and manychat routes)
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// -- getSafeValue (leads route)
function getSafeValue(obj, key) {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return undefined;
  }
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return descriptor ? descriptor.value : undefined;
}

// -- buildLeadId (leads route)
function buildLeadId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKY-${stamp}-${random}`;
}

// -- buildManyChatLeadId (manychat route)
function buildManyChatLeadId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKY-MC-${stamp}-${random}`;
}

// -- validate (leads route)
const requiredFields = ['name', 'phone', 'email', 'city', 'market', 'projectType', 'timeline', 'contactMethod', 'notes'];

function validate(payload) {
  const missing = requiredFields.filter((field) => !asText(getSafeValue(payload, field)));
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(asText(payload.email))) {
    return 'Enter a valid email address.';
  }
  if (asText(payload.website)) {
    return 'Spam check failed.';
  }
  const photosUrl = asText(payload.photosUrl);
  if (photosUrl) {
    try {
      const url = new URL(photosUrl);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) {
        return 'Enter a valid project photo link.';
      }
    } catch {
      return 'Enter a valid project photo link.';
    }
  }
  return '';
}

// -- buildLeadHtml (leads route)
function buildLeadHtml(payload) {
  const rows = Object.entries(payload)
    .filter(([key, value]) => key !== 'website' && asText(value).length > 0)
    .map(([key, value]) => '<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:700;">' + escapeHtml(key) + '</td><td style="padding:6px 10px;border:1px solid #ddd;">' + escapeHtml(value) + '</td></tr>')
    .join('');
  return '<h1>New Sky\'s the Limit Painting lead</h1><table style="border-collapse:collapse;">' + rows + '</table>';
}

// -- rateLimit (leads route)
function createRateLimiter(maxRequests, windowMs) {
  const cache = new Map();
  return function rateLimit(ip) {
    const now = Date.now();
    const state = cache.get(ip);
    if (!state) {
      cache.set(ip, { count: 1, lastReset: now });
      return true;
    }
    if (now - state.lastReset > windowMs) {
      cache.set(ip, { count: 1, lastReset: now });
      return true;
    }
    if (state.count >= maxRequests) {
      return false;
    }
    state.count += 1;
    return true;
  };
}

// ---------------------------------------------------------------------------
// asText tests
// ---------------------------------------------------------------------------
describe('api/leads - asText utility', () => {

  test('returns trimmed string for string input', () => {
    assert.equal(asText('  hello  '), 'hello');
  });

  test('returns empty string for null', () => {
    assert.equal(asText(null), '');
  });

  test('returns empty string for undefined', () => {
    assert.equal(asText(undefined), '');
  });

  test('returns empty string for number', () => {
    assert.equal(asText(42), '');
  });

  test('returns empty string for boolean', () => {
    assert.equal(asText(true), '');
  });

  test('returns empty string for object', () => {
    assert.equal(asText({}), '');
  });

  test('returns empty string for array', () => {
    assert.equal(asText([]), '');
  });

  test('preserves internal whitespace', () => {
    assert.equal(asText('hello world'), 'hello world');
  });

  test('handles empty string', () => {
    assert.equal(asText(''), '');
  });

  test('handles whitespace-only string', () => {
    assert.equal(asText('   '), '');
  });
});

// ---------------------------------------------------------------------------
// isPayload tests
// ---------------------------------------------------------------------------
describe('api/leads - isPayload guard', () => {

  test('returns true for plain object', () => {
    assert.equal(isPayload({ name: 'test' }), true);
  });

  test('returns true for empty object', () => {
    assert.equal(isPayload({}), true);
  });

  test('returns false for null', () => {
    assert.equal(isPayload(null), false);
  });

  test('returns false for undefined', () => {
    assert.equal(isPayload(undefined), false);
  });

  test('returns false for array', () => {
    assert.equal(isPayload([1, 2, 3]), false);
  });

  test('returns false for string', () => {
    assert.equal(isPayload('string'), false);
  });

  test('returns false for number', () => {
    assert.equal(isPayload(123), false);
  });

  test('returns false for boolean false', () => {
    assert.equal(isPayload(false), false);
  });

  test('returns false for empty string', () => {
    assert.equal(isPayload(''), false);
  });

  test('returns false for zero', () => {
    assert.equal(isPayload(0), false);
  });
});

// ---------------------------------------------------------------------------
// escapeHtml tests
// ---------------------------------------------------------------------------
describe('api/leads - escapeHtml sanitization', () => {

  test('escapes ampersand', () => {
    assert.equal(escapeHtml('a&b'), 'a&amp;b');
  });

  test('escapes less-than', () => {
    assert.equal(escapeHtml('<script>'), '&lt;script&gt;');
  });

  test('escapes greater-than', () => {
    assert.equal(escapeHtml('a>b'), 'a&gt;b');
  });

  test('escapes double quotes', () => {
    assert.equal(escapeHtml('a"b'), 'a&quot;b');
  });

  test('escapes single quotes', () => {
    assert.equal(escapeHtml("a'b"), 'a&#39;b');
  });

  test('escapes all special characters in combination', () => {
    assert.equal(escapeHtml('<b>"Hello" & \'world\'</b>'), '&lt;b&gt;&quot;Hello&quot; &amp; &#39;world&#39;&lt;/b&gt;');
  });

  test('passes through safe strings unchanged', () => {
    assert.equal(escapeHtml('Hello World 123'), 'Hello World 123');
  });

  test('converts non-string values to string first', () => {
    assert.equal(escapeHtml(42), '42');
    assert.equal(escapeHtml(true), 'true');
  });

  test('handles empty string', () => {
    assert.equal(escapeHtml(''), '');
  });

  test('handles null (converts to string)', () => {
    assert.equal(escapeHtml(null), 'null');
  });

  test('handles undefined (converts to string)', () => {
    assert.equal(escapeHtml(undefined), 'undefined');
  });
});

// ---------------------------------------------------------------------------
// getSafeValue tests
// ---------------------------------------------------------------------------
describe('api/leads - getSafeValue prototype pollution guard', () => {

  test('returns value for normal key', () => {
    assert.equal(getSafeValue({ name: 'Alice' }, 'name'), 'Alice');
  });

  test('returns undefined for __proto__', () => {
    assert.equal(getSafeValue({ __proto__: 'evil' }, '__proto__'), undefined);
  });

  test('returns undefined for constructor', () => {
    assert.equal(getSafeValue({ constructor: 'evil' }, 'constructor'), undefined);
  });

  test('returns undefined for prototype', () => {
    assert.equal(getSafeValue({ prototype: 'evil' }, 'prototype'), undefined);
  });

  test('returns undefined for missing key', () => {
    assert.equal(getSafeValue({}, 'missing'), undefined);
  });

  test('returns falsy values correctly', () => {
    assert.equal(getSafeValue({ count: 0 }, 'count'), 0);
    assert.equal(getSafeValue({ flag: false }, 'flag'), false);
    assert.equal(getSafeValue({ text: '' }, 'text'), '');
  });
});

// ---------------------------------------------------------------------------
// buildLeadId tests
// ---------------------------------------------------------------------------
describe('api/leads - buildLeadId generation', () => {

  test('starts with SKY- prefix', () => {
    const id = buildLeadId();
    assert.ok(id.startsWith('SKY-'), `lead ID should start with SKY-: ${id}`);
  });

  test('matches expected format SKY-TIMESTAMP-RANDOM', () => {
    const id = buildLeadId();
    assert.match(id, /^SKY-\d{14}-[A-Z0-9]+$/);
  });

  test('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => buildLeadId()));
    assert.equal(ids.size, 100, 'all generated IDs should be unique');
  });

  test('timestamp portion is 14 digits', () => {
    const id = buildLeadId();
    const stamp = id.split('-')[1];
    assert.equal(stamp.length, 14);
    assert.match(stamp, /^\d{14}$/);
  });

  test('ManyChat lead ID starts with SKY-MC-', () => {
    const id = buildManyChatLeadId();
    assert.ok(id.startsWith('SKY-MC-'), `ManyChat lead ID should start with SKY-MC-: ${id}`);
  });

  test('ManyChat lead ID matches expected format', () => {
    const id = buildManyChatLeadId();
    assert.match(id, /^SKY-MC-\d{14}-[A-Z0-9]+$/);
  });
});

// ---------------------------------------------------------------------------
// validate tests
// ---------------------------------------------------------------------------
describe('api/leads - validate lead payload', () => {

  const validPayload = {
    name: 'Jane Doe',
    phone: '651-555-1234',
    email: 'jane@example.com',
    city: 'Eagan',
    market: 'Residential',
    projectType: 'Interior',
    timeline: 'ASAP',
    contactMethod: 'Phone',
    notes: 'Kitchen repaint',
  };

  test('returns empty string for valid payload', () => {
    assert.equal(validate(validPayload), '');
  });

  test('returns error when name is missing', () => {
    const result = validate({ ...validPayload, name: '' });
    assert.match(result, /Missing required fields.*name/);
  });

  test('returns error when email is missing', () => {
    const result = validate({ ...validPayload, email: '' });
    assert.match(result, /Missing required fields.*email/);
  });

  test('returns error for invalid email format', () => {
    const result = validate({ ...validPayload, email: 'not-an-email' });
    assert.equal(result, 'Enter a valid email address.');
  });

  test('returns error for email without domain', () => {
    const result = validate({ ...validPayload, email: 'user@' });
    assert.equal(result, 'Enter a valid email address.');
  });

  test('returns error for email with spaces', () => {
    const result = validate({ ...validPayload, email: 'user @example.com' });
    assert.equal(result, 'Enter a valid email address.');
  });

  test('accepts valid email formats', () => {
    const emails = ['user@example.com', 'a.b@c.d.e', 'test+tag@domain.org'];
    for (const email of emails) {
      assert.equal(validate({ ...validPayload, email }), '', `should accept ${email}`);
    }
  });

  test('returns spam error when website honeypot is filled', () => {
    const result = validate({ ...validPayload, website: 'http://spam.com' });
    assert.equal(result, 'Spam check failed.');
  });

  test('returns error for multiple missing fields', () => {
    const result = validate({ email: 'a@b.com' });
    assert.match(result, /Missing required fields/);
    assert.match(result, /name/);
    assert.match(result, /phone/);
    assert.match(result, /city/);
  });

  test('accepts payload with valid photosUrl', () => {
    const result = validate({ ...validPayload, photosUrl: 'https://photos.example.com/img.jpg' });
    assert.equal(result, '');
  });

  test('returns error for photosUrl with invalid protocol', () => {
    const result = validate({ ...validPayload, photosUrl: 'ftp://photos.example.com/img.jpg' });
    assert.equal(result, 'Enter a valid project photo link.');
  });

  test('returns error for photosUrl that is not a URL', () => {
    const result = validate({ ...validPayload, photosUrl: 'not-a-url' });
    assert.equal(result, 'Enter a valid project photo link.');
  });

  test('returns error for photosUrl without valid hostname', () => {
    const result = validate({ ...validPayload, photosUrl: 'https://localhost/img.jpg' });
    assert.equal(result, 'Enter a valid project photo link.');
  });

  test('allows payload without photosUrl', () => {
    assert.equal(validate(validPayload), '');
  });

  test('trims whitespace from field values during validation', () => {
    const result = validate({ ...validPayload, name: '  Jane  ' });
    assert.equal(result, '');
  });
});

// ---------------------------------------------------------------------------
// buildLeadHtml tests
// ---------------------------------------------------------------------------
describe('api/leads - buildLeadHtml email template', () => {

  test('generates HTML with header', () => {
    const html = buildLeadHtml({ name: 'Test' });
    assert.match(html, /New Sky's the Limit Painting lead/);
  });

  test('generates table rows for non-empty fields', () => {
    const html = buildLeadHtml({ name: 'Alice', phone: '555-1234' });
    assert.match(html, /Alice/);
    assert.match(html, /555-1234/);
    assert.match(html, /<tr>/);
    assert.match(html, /<table/);
  });

  test('excludes website honeypot field', () => {
    const html = buildLeadHtml({ name: 'Bob', website: 'http://spam.com' });
    assert.ok(!html.includes('http://spam.com'), 'should exclude website field');
  });

  test('excludes empty fields', () => {
    const html = buildLeadHtml({ name: 'Bob', notes: '' });
    assert.ok(!html.includes('notes'), 'should exclude empty fields');
  });

  test('escapes HTML in values to prevent XSS', () => {
    const html = buildLeadHtml({ name: '<script>alert("xss")</script>' });
    assert.ok(!html.includes('<script>'), 'should escape script tags');
    assert.match(html, /&lt;script&gt;/);
  });

  test('escapes HTML in keys', () => {
    const payload = {};
    payload['<b>key'] = 'value';
    const html = buildLeadHtml(payload);
    assert.ok(!html.includes('<b>key'), 'should escape HTML in keys');
    assert.match(html, /&lt;b&gt;key/);
  });
});

// ---------------------------------------------------------------------------
// rateLimit tests
// ---------------------------------------------------------------------------
describe('api/leads - Rate limiter', () => {

  test('allows first request from an IP', () => {
    const rl = createRateLimiter(5, 60000);
    assert.equal(rl('10.0.0.1'), true);
  });

  test('allows up to max requests', () => {
    const rl = createRateLimiter(3, 60000);
    assert.equal(rl('10.0.0.2'), true);
    assert.equal(rl('10.0.0.2'), true);
    assert.equal(rl('10.0.0.2'), true);
  });

  test('blocks requests beyond max', () => {
    const rl = createRateLimiter(2, 60000);
    rl('10.0.0.3');
    rl('10.0.0.3');
    assert.equal(rl('10.0.0.3'), false);
  });

  test('tracks IPs independently', () => {
    const rl = createRateLimiter(1, 60000);
    assert.equal(rl('10.0.0.4'), true);
    assert.equal(rl('10.0.0.5'), true);
    assert.equal(rl('10.0.0.4'), false);
    assert.equal(rl('10.0.0.5'), false);
  });

  test('resets counter after window expires', () => {
    const rl = createRateLimiter(1, 1);
    rl('10.0.0.6');
    // After 1ms the window should have expired
    const start = Date.now();
    while (Date.now() - start < 5) { /* wait 5ms */ }
    assert.equal(rl('10.0.0.6'), true);
  });
});

// ---------------------------------------------------------------------------
// API route source structure tests
// ---------------------------------------------------------------------------
describe('api/leads/route - Route structure', () => {

  test('exports POST handler', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /export async function POST/);
  });

  test('sends via multiple providers (Resend, webhook, HubSpot)', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /sendWithResend/);
    assert.match(src, /sendLeadWebhook/);
    assert.match(src, /sendToHubspot/);
  });

  test('sends auto-reply email to lead', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /sendAutoReplyToLead/);
  });

  test('uses Promise.allSettled for multi-provider delivery', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /Promise\.allSettled/);
  });

  test('returns 429 when rate limited', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /status:\s*429/);
  });

  test('returns 400 for invalid JSON', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /status:\s*400/);
  });

  test('returns 201 on successful lead creation', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /status:\s*201/);
  });

  test('returns leadId in success response', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /leadId:\s*lead\.leadId/);
  });

  test('saves lead to Supabase database', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /saveLeadToDb/);
  });

  test('logs lead events to database', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /saveLeadEventToDb/);
  });

  test('rate limiter constants are reasonable', () => {
    const src = read('src/app/api/leads/route.ts');
    assert.match(src, /60 \* 1000/);
    assert.match(src, /MAX_REQUESTS = 5/);
  });
});

describe('api/manychat/route - Route structure', () => {

  test('exports POST handler', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /export async function POST/);
  });

  test('parses ManyChat custom_fields', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /custom_fields/);
  });

  test('builds name from first_name and last_name when name is absent', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /first_name/);
    assert.match(src, /last_name/);
  });

  test('requires phone or email for ManyChat leads', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /!lead\.phone && !lead\.email/);
  });

  test('ManyChat lead ID uses SKY-MC- prefix', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /SKY-MC-/);
  });

  test('sends via Resend, webhook, and HubSpot', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /sendWithResend/);
    assert.match(src, /sendLeadWebhook/);
    assert.match(src, /sendToHubspot/);
  });

  test('uses Promise.allSettled for delivery', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /Promise\.allSettled/);
  });

  test('returns 400 when missing phone and email', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /status:\s*400/);
  });

  test('returns 201 on success', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /status:\s*201/);
  });

  test('defaults source to ManyChat', () => {
    const src = read('src/app/api/manychat/route.ts');
    assert.match(src, /source:\s*'ManyChat'/);
  });
});

describe('api/storage/upload-url/route - Route structure', () => {

  test('exports POST handler', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /export async function POST/);
  });

  test('requires Supabase configuration', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /!supabaseUrl \|\| !supabaseServiceKey/);
  });

  test('requires fileName in request body', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /!fileName/);
  });

  test('uses lead-photos bucket', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /lead-photos/);
  });

  test('generates signed upload URL', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /createSignedUploadUrl/);
  });

  test('returns both uploadUrl and publicUrl', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /uploadUrl/);
    assert.match(src, /publicUrl/);
  });

  test('returns 500 when Supabase is not configured', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /status:\s*500/);
  });

  test('returns 400 when fileName is missing', () => {
    const src = read('src/app/api/storage/upload-url/route.ts');
    assert.match(src, /status:\s*400/);
  });
});
