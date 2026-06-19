// Safe helper to get environment variables across Next.js and Vite.
function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || process.env[`VITE_${key}`];
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || import.meta.env[`VITE_${key}`];
    }
  } catch (e) {
    // ignore
  }
  return undefined;
}

export const ENV = {
  SITE_URL: getEnv('SITE_URL') || 'https://www.skysthelimitpaintingllc.com',
  GA_MEASUREMENT_ID: getEnv('GA_MEASUREMENT_ID'),
  FORMSPREE_FORM_ID: getEnv('FORMSPREE_FORM_ID') || 'xanybvkd',
  GOOGLE_SITE_VERIFICATION: getEnv('GOOGLE_SITE_VERIFICATION'),
  FACEBOOK_URL: getEnv('FACEBOOK_URL') || 'https://facebook.com/skysthelimitpainting1779',
  INSTAGRAM_URL: getEnv('INSTAGRAM_URL') || 'https://instagram.com/skysthelimitpainting1779',
  LINKEDIN_URL: getEnv('LINKEDIN_URL') || 'https://linkedin.com/company/skys-the-limit-painting-llc',
  TIKTOK_URL: getEnv('TIKTOK_URL') || 'https://tiktok.com/@skysthelimitpainting',
  BOOKING_URL: getEnv('BOOKING_URL') || '',
  SUPABASE_URL: getEnv('SUPABASE_URL') || '',
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY') || '',
};
