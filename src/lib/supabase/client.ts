import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '../env';

export function createClient() {
  const url = ENV.SUPABASE_URL;
  const key = ENV.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return createBrowserClient(url, key);
}
