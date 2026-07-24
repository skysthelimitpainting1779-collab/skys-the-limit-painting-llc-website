/**
 * Directus client — real SDK against stub HTTP server (not a reimplementation).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const clientMod = await import(
  pathToFileURL(join(process.cwd(), 'src/lib/directus/client.ts')).href
);

const {
  createDirectusClient,
  getCaseStudies,
  getMarkets,
  getSiteConfig,
  filterPublishedCaseStudies,
  directusAssetUrl,
  probeDirectusHealth,
} = clientMod;

function startStubServer(handler) {
  return new Promise((resolve) => {
    const server = http.createServer(handler);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

test('filterPublishedCaseStudies drops drafts', () => {
  const out = filterPublishedCaseStudies([
    { id: 1, status: 'published', type: 'A', location: 'x', problem: '', prep: [], result: '', image: null, before_image: null, after_image: null, market: 'residential', sort: 1, date_created: null, date_updated: null },
    { id: 2, status: 'draft', type: 'B', location: 'y', problem: '', prep: [], result: '', image: null, before_image: null, after_image: null, market: 'residential', sort: 2, date_created: null, date_updated: null },
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 1);
});

test('directusAssetUrl builds asset path', () => {
  assert.equal(directusAssetUrl(null), null);
  assert.equal(
    directusAssetUrl('abc-123', 'http://localhost:8055'),
    'http://localhost:8055/assets/abc-123'
  );
  assert.equal(directusAssetUrl('/local.webp', 'http://x'), '/local.webp');
});

test('getCaseStudies uses real SDK against stub Directus REST', async () => {
  const sample = [
    {
      id: 9,
      status: 'published',
      sort: 1,
      type: 'Stub Study',
      location: 'MN',
      problem: 'p',
      prep: ['prep'],
      result: 'r',
      image: null,
      before_image: null,
      after_image: null,
      market: 'residential',
      date_created: null,
      date_updated: null,
    },
  ];
  const { server, base } = await startStubServer((req, res) => {
    // @directus/sdk hits /items/case_studies?...
    if (req.url?.includes('/items/case_studies')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: sample }));
      return;
    }
    res.writeHead(404);
    res.end('not found');
  });
  try {
    const client = createDirectusClient(base);
    const items = await getCaseStudies(client);
    assert.equal(items.length, 1);
    assert.equal(items[0].type, 'Stub Study');
    assert.equal(items[0].status, 'published');
  } finally {
    await new Promise((r) => server.close(r));
  }
});

test('getCaseStudies returns empty on CMS down (graceful fallback)', async () => {
  const client = createDirectusClient('http://127.0.0.1:1'); // nothing listening
  const items = await getCaseStudies(client);
  assert.deepEqual(items, []);
});

test('getMarkets empty when unreachable', async () => {
  const client = createDirectusClient('http://127.0.0.1:1');
  assert.deepEqual(await getMarkets(client), []);
});

test('getSiteConfig null when unreachable', async () => {
  const client = createDirectusClient('http://127.0.0.1:1');
  assert.equal(await getSiteConfig(client), null);
});

test('probeDirectusHealth hits stub /server/health', async () => {
  const { server, base } = await startStubServer((req, res) => {
    if (req.url === '/server/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    res.writeHead(404);
    res.end();
  });
  try {
    const r = await probeDirectusHealth(base);
    assert.equal(r.ok, true);
    assert.equal(r.status, 200);
  } finally {
    await new Promise((x) => server.close(x));
  }
});
