import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type PublicSupabaseEnv = Pick<
  NodeJS.ProcessEnv,
  'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
>;

export function hasPublicSupabaseConfig(
  env: PublicSupabaseEnv = process.env,
): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

/**
 * Create an anonymous, cookie-free client for public read-only content.
 *
 * Authenticated portal routes must continue using the server client in
 * `src/lib/supabase/server.ts`. Returning null when public variables are
 * absent keeps static builds deterministic and lets callers use local data.
 */
export function createPublicClient(
  env: PublicSupabaseEnv = process.env,
): SupabaseClient | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
