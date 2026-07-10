import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth callback — exchanges ?code= for a Supabase session cookie, then
 * redirects into the portal (or ?next= path under /portal).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextRaw = searchParams.get('next') || '/portal';
  const next = nextRaw.startsWith('/portal') ? nextRaw : '/portal';

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.warn('[auth/callback] exchange failed:', error.message);
    } catch (err) {
      console.warn('[auth/callback] error:', err);
    }
  }

  const login = new URL('/portal/login', origin);
  login.searchParams.set('error', 'oauth_callback_failed');
  login.searchParams.set('next', next);
  return NextResponse.redirect(login);
}
