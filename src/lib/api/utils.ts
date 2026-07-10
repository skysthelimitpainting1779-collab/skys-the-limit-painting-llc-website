export function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function isPayload(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function getSafeValue(obj: Record<string, unknown>, key: string): unknown {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return undefined;
  }
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return descriptor ? descriptor.value : undefined;
}

export function buildLeadId(): string {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKY-${stamp}-${random}`;
}

export function buildManyChatLeadId(): string {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKY-MC-${stamp}-${random}`;
}

const requiredFields = ['name', 'phone', 'email', 'city', 'market', 'projectType', 'timeline', 'contactMethod', 'notes'];

export function validate(payload: Record<string, unknown>): string {
  const missing = requiredFields.filter((field) => !asText(getSafeValue(payload, field)));
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  if (!/^[^\s@]{1,254}@[^\s@]{1,254}\.[^\s@]{2,63}$/.test(asText(payload.email))) {
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

export function buildLeadHtml(payload: Record<string, unknown>): string {
  const rows = Object.entries(payload)
    .filter(([key, value]) => key !== 'website' && asText(value).length > 0)
    .map(([key, value]) => '<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:700;">' + escapeHtml(key) + '</td><td style="padding:6px 10px;border:1px solid #ddd;">' + escapeHtml(value) + '</td></tr>')
    .join('');

  return '<h1>New Sky\'s the Limit Painting lead</h1><table style="border-collapse:collapse;">' + rows + '</table>';
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const cache = new Map<string, { count: number; lastReset: number }>();
  return function rateLimit(ip: string): boolean {
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
