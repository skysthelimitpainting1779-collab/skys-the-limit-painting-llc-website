import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/portal(.*)', '/manage(.*)']);
const isPortalLogin = createRouteMatcher(['/portal/login(.*)']);

const handleClerkRequest = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request) && !isPortalLogin(request)) {
    await auth.protect();
  }
});

/** Clerk establishes request identity; Convex functions authorize resources. */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  return handleClerkRequest(request, event);
}

export const config = {
  matcher: [
    '/portal',
    '/portal/:path*',
    '/manage/:path*',
  ],
};
