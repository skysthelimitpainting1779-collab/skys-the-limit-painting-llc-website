import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  /*
   * Supabase session refresh is only needed where an authenticated session
   * exists — the admin dashboard. Public marketing pages are unauthenticated,
   * so scoping the matcher here avoids a Supabase round-trip (and an edge
   * middleware invocation) on every visitor request.
   */
  matcher: ['/admin/:path*'],
};
