#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';

function read(path) {
  return readFileSync(path, 'utf8');
}

function write(path, content) {
  writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

function replaceRequired(path, oldValue, newValue) {
  const content = read(path);
  if (!content.includes(oldValue)) {
    throw new Error(`Expected content not found in ${path}: ${oldValue.slice(0, 100)}`);
  }
  write(path, content.replace(oldValue, newValue));
}

function replaceSection(path, startMarker, endMarker, replacement) {
  const content = read(path);
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) {
    throw new Error(`Expected section not found in ${path}: ${startMarker}`);
  }
  write(path, `${content.slice(0, start)}${replacement}\n\n${content.slice(end)}`);
}

const packageJson = JSON.parse(read('package.json'));
packageJson.scripts.test = 'tsx --test tests/*.mjs';
packageJson.dependencies['@libsql/client'] = '0.17.4';
delete packageJson.dependencies['react-router-dom'];
packageJson.dependencies = Object.fromEntries(
  Object.entries(packageJson.dependencies).sort(([a], [b]) => a.localeCompare(b))
);
write('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

replaceSection(
  'tests/e2e.test.mjs',
  "  test('T1.4 Routing & Navigation - Redirects for legacy routes redirect to new pages'",
  "  test('T1.5 Routing & Navigation - Invalid paths serve the customized 404 page'",
  `  test('T1.4 Routing & Navigation - Redirects for legacy routes redirect to new pages', () => {
    const vercel = JSON.parse(read('vercel.json'));
    assert.ok(vercel.redirects.some(({ source, destination }) => source === '/services' && destination === '/residential'));
    assert.ok(vercel.redirects.some(({ source, destination }) => source === '/services/interior' && destination === '/residential'));
  });`
);

replaceRequired(
  'tests/e2e.test.mjs',
  'assert.match(home, /Residential detail\\. Commercial discipline\\. Public-sector ready\\./);',
  'assert.match(home, /Residential detail\\. Commercial discipline\\.[\\s\\S]*Preps[\\s\\S]*first\\./i);'
);

replaceSection(
  'tests/e2e.test.mjs',
  "  test('T2.3 Routing & Navigation - CSP and HTTP security headers are configured in vercel.ts'",
  "  test('T2.4 Routing & Navigation - Referral parameters are parsed and stored in LocalStorage'",
  `  test('T2.3 Routing & Navigation - CSP and HTTP security headers are configured in vercel.json', () => {
    const vercel = read('vercel.json');
    assert.match(vercel, /Content-Security-Policy/);
    assert.match(vercel, /default-src 'self'/);
    assert.match(vercel, /object-src 'none'/);
    assert.match(vercel, /frame-ancestors 'none'/);
    assert.match(vercel, /Strict-Transport-Security/);
  });`
);

replaceSection(
  'tests/remediation.test.mjs',
  "test('Vercel config has security headers and no blanket SPA rewrite'",
  "test('build pipeline prerenders public routes and static 404 metadata'",
  `test('Vercel config has security headers and no blanket SPA rewrite', () => {
  assert.ok(!existsSync(new URL('../vercel.ts', import.meta.url)), 'legacy vercel.ts should remain deleted');
  assert.ok(existsSync(new URL('../vercel.json', import.meta.url)), 'vercel.json should exist');

  const vercel = JSON.parse(read('vercel.json'));
  const headerKeys = new Set(
    vercel.headers.flatMap((rule) => rule.headers ?? []).map(({ key }) => key)
  );
  for (const key of [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Strict-Transport-Security',
    'Content-Security-Policy',
  ]) {
    assert.ok(headerKeys.has(key), \`${'${key}'} header is missing\`);
  }

  assert.ok(!Object.hasOwn(vercel, 'rewrites'));
  assert.ok(
    vercel.redirects.some(
      ({ source, destination }) => source === '/services' && destination === '/residential'
    )
  );
});`
);

replaceRequired(
  'tests/site-architecture.test.mjs',
  'assert.match(home, /Residential detail\\. Commercial discipline\\. Public-sector ready\\./);',
  'assert.match(home, /Residential detail\\. Commercial discipline\\.[\\s\\S]*Preps[\\s\\S]*first\\./i);'
);
replaceRequired(
  'tests/site-architecture.test.mjs',
  "  assert.ok(existsSync(new URL('../vercel.ts', import.meta.url)), 'vercel.ts should exist');\n  assert.ok(!existsSync(new URL('../vercel.json', import.meta.url)), 'vercel.json must not coexist with vercel.ts');\n  const vercelTs = read('vercel.ts');",
  "  assert.ok(!existsSync(new URL('../vercel.ts', import.meta.url)), 'legacy vercel.ts should remain deleted');\n  assert.ok(existsSync(new URL('../vercel.json', import.meta.url)), 'vercel.json should exist');\n  const vercelJson = read('vercel.json');"
);
replaceRequired(
  'tests/site-architecture.test.mjs',
  'assert.match(vercelTs, new RegExp(escapeRegExp(key)), `${key} header is missing`);',
  'assert.match(vercelJson, new RegExp(escapeRegExp(key)), `${key} header is missing`);'
);
replaceRequired(
  'tests/site-architecture.test.mjs',
  'assert.doesNotMatch(vercelTs, /rewrites\\s*:/);',
  "assert.ok(!Object.hasOwn(JSON.parse(vercelJson), 'rewrites'));"
);

console.log('CI dependency and test contracts repaired.');
