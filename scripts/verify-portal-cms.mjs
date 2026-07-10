#!/usr/bin/env node
/**
 * Structural + pure-function verification for portal auth + Directus client files.
 * Run from repo root: npx tsx scripts/verify-portal-cms.mjs
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const portalUrl = pathToFileURL(join(ROOT, 'src/lib/auth/portal.ts')).href;
const {
  gatePortalAccess,
  isProtectedPortalPath,
  portalLoginUrl,
  buildPortalOAuthOptions,
} = await import(portalUrl);

const checks = [];
function ok(name, cond, detail = '') {
  checks.push({ name, ok: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}

ok('portal page', existsSync(join(ROOT, 'src/app/portal/page.tsx')));
ok('portal login', existsSync(join(ROOT, 'src/app/portal/login/page.tsx')));
ok('auth callback', existsSync(join(ROOT, 'src/app/auth/callback/route.ts')));
ok('proxy portal matcher', readFileSync(join(ROOT, 'src/proxy.ts'), 'utf8').includes('/portal'));
ok('gate denies anon', !gatePortalAccess(null).authenticated);
ok('gate allows user', gatePortalAccess({ id: '1', email: 'a@b.com' }).authenticated === true);
ok('path /portal protected', isProtectedPortalPath('/portal'));
ok('path login public', !isProtectedPortalPath('/portal/login'));
ok(
  'oauth redirect',
  buildPortalOAuthOptions('http://localhost:3000', 'google').options.redirectTo.includes(
    '/auth/callback'
  )
);
ok('login url', portalLoginUrl('/portal').startsWith('/portal/login'));
ok('directus client', existsSync(join(ROOT, 'src/lib/directus/client.ts')));
ok('docs', existsSync(join(ROOT, 'docs/DIRECTUS_AND_PORTAL.md')));
ok('compose', existsSync(join(ROOT, 'docker-compose.yml')));
ok(
  'vercel plugin mandate',
  readFileSync(join(ROOT, '.agents/AGENTS.md'), 'utf8').includes('Vercel plugin')
);
ok(
  'projects uses getCaseStudies',
  readFileSync(join(ROOT, 'src/views/Projects.tsx'), 'utf8').includes('getCaseStudies')
);

const failed = checks.filter((c) => !c.ok);
console.log(JSON.stringify({ pass: failed.length === 0, checks }, null, 2));
process.exit(failed.length ? 1 : 0);
