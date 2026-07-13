/**
 * Vercel frontier config (2026) — typed project configuration.
 * @see https://vercel.com/docs/project-configuration/vercel-ts
 * @see Vercel plugin skill: knowledge-update
 *
 * Only ONE of vercel.ts | vercel.json — vercel.ts is the source of truth.
 * Fluid Compute + Node 24 is the default platform runtime (not Edge-only).
 */
import { routes, type VercelConfig } from '@vercel/config/v1';

/** CSP for marketing + portal + HubSpot analytics + Supabase + Cal.com */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: https: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://js-na2.hs-scripts.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hubspot.com https://*.hs-banner.com https://*.hscollectedforms.net https://va.vercel-scripts.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com https://va.vercel-scripts.com https://www.google-analytics.com https://www.googletagmanager.com https://*.hubspot.com https://*.hscollectedforms.net https://*.hubapi.com https://*.supabase.co https://*.supabase.in https://*.turso.io wss://*.turso.io",
  "frame-src 'self' https://cal.com https://*.cal.com https://accounts.google.com https://github.com",
  "form-action 'self' mailto:",
].join('; ');

export const config: VercelConfig = {
  framework: 'nextjs',
  buildCommand: 'npm run build',
  installCommand: 'npm install',

  // Fluid / Functions: platform defaults (Node 24 LTS, Active CPU, 300s timeout)
  // Directus and other stateful CMS stay self-hosted — not free Fluid Docker.

  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://www.skysthelimitpaintingllc.com' },
        { key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Accept' },
      ],
    },
    {
      source: '/brand/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, maxAge=31536000, immutable' },
      ],
    },
  ],

  redirects: [
    routes.redirect('/services', '/residential', { permanent: true }),
    routes.redirect('/services/interior', '/residential', { permanent: true }),
    routes.redirect('/services/exterior', '/residential', { permanent: true }),
    routes.redirect('/services/commercial', '/commercial', { permanent: true }),
    routes.redirect('/services/striping', '/public-sector', { permanent: true }),
    routes.redirect('/services/pavement-marking', '/public-sector', { permanent: true }),
  ],

  crons: [
    {
      path: '/api/cron/seo-ping',
      schedule: '0 8 * * *',
    },
  ],

  // Skip builds on agent noise branches (entire/*).
  // Canonical bash pattern per Vercel docs — exits 0 = skip, exits 1 = build.
  ignoreCommand:
    'if [[ "$VERCEL_GIT_COMMIT_REF" == entire/* ]]; then echo "🛑 agent branch, skipping"; exit 0; else echo "✅ proceeding with build"; exit 1; fi',

  // Only auto-deploy from main (production) and infra/* (preview).
  // Agent worktree branches (entire/*, fix/*, feat/*) are gated through PRs.
  git: {
    deploymentEnabled: {
      'entire/*': false,
    },
  },
};
