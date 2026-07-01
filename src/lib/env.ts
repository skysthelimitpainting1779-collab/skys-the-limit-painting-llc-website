// Safe helper to get environment variables across Next.js and Vite.
// Supports standard, NEXT_PUBLIC_, and integration-prefixed names (e.g. backend_ from Vercel Supabase).
function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    const candidates = [
      key,
      `NEXT_PUBLIC_${key}`,
      `backend_${key}`,
      `NEXT_PUBLIC_backend_${key}`,
      `VITE_${key}`,
    ];
    for (const c of candidates) {
      if (process.env[c]) return process.env[c];
    }
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const metaCandidates = [key, `VITE_${key}`];
      for (const c of metaCandidates) {
        // @ts-ignore
        if (import.meta.env[c]) return import.meta.env[c];
      }
    }
  } catch {
    // import.meta may not exist in all runtimes (feature detection)
  }
  return undefined;
}

export { getEnv };

export const ENV = {
  SITE_URL: getEnv('SITE_URL') || 'https://www.skysthelimitpaintingllc.com',
  GA_MEASUREMENT_ID: getEnv('GA_MEASUREMENT_ID'),
  FORMSPREE_FORM_ID: getEnv('FORMSPREE_FORM_ID') || 'xanybvkd',
  GOOGLE_SITE_VERIFICATION: getEnv('GOOGLE_SITE_VERIFICATION'),
  FACEBOOK_URL:
    getEnv('FACEBOOK_URL') || 'https://facebook.com/skysthelimitpainting1779',
  INSTAGRAM_URL:
    getEnv('INSTAGRAM_URL') || 'https://instagram.com/skysthelimitpainting1779',
  LINKEDIN_URL:
    getEnv('LINKEDIN_URL') ||
    'https://linkedin.com/company/skys-the-limit-painting-llc',
  TIKTOK_URL:
    getEnv('TIKTOK_URL') || 'https://tiktok.com/@skysthelimitpainting',
  BOOKING_URL: getEnv('BOOKING_URL') || '',
  // Explicitly reference process.env for Next.js client-side static substitution
  SUPABASE_URL:
    process.env.NEXT_PUBLIC_backend_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    getEnv('SUPABASE_URL') ||
    '',
  SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_backend_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    getEnv('SUPABASE_ANON_KEY') ||
    '',
};
