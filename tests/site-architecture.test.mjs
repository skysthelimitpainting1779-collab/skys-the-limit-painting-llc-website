import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('top-level routes use the three-market architecture', () => {
  const app = read('src/App.tsx');

  for (const route of ['"/"', '"/residential"', '"/commercial"', '"/public-sector"', '"/projects"', '"/about"', '"/contact"']) {
    assert.match(app, new RegExp(route.replace('/', '\\/')));
  }
});

test('primary navigation leads with residential, commercial, and public sector', () => {
  const header = read('src/components/ConversionHeader.tsx');

  const residential = header.indexOf('Residential');
  const commercial = header.indexOf('Commercial');
  const publicSector = header.indexOf('Public Sector');

  assert.ok(residential >= 0, 'Residential nav item is missing');
  assert.ok(commercial > residential, 'Commercial should follow Residential');
  assert.ok(publicSector > commercial, 'Public Sector should follow Commercial');
  assert.doesNotMatch(header, /Service Area|Services/);
});

test('homepage states the approved positioning and avoids forbidden claims', () => {
  const home = read('src/pages/Home.tsx');

  assert.match(home, /Residential detail\. Commercial discipline\. Public-sector ready\./);
  assert.match(home, /insured, owner-operated Minnesota painting contractor/);
  assert.doesNotMatch(home, /Public-work ambition/i);
  assert.doesNotMatch(home, /Licensed|Bonded|MnDOT-approved|Government-certified|DBE certified|TGB certified|Trusted by government agencies|Awarded public contracts|Workers comp/i);
});
