import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ENV } from '../env';

export async function createClient() {
  const cookieStore = await cookies();

  const url = ENV.SUPABASE_URL;
  const key = ENV.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have the proxy refreshing
          // user sessions.
        }
      },
    },
  });
}
