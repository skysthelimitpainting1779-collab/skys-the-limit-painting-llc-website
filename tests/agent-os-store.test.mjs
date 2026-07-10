import assert from 'node:assert/strict';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, before, after } from 'node:test';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = join(tmpdir(), `agent-os-store-test-${Date.now()}`);
const ORIG_CWD = process.cwd();

before(() => {
  mkdirSync(join(ROOT, '.agents'), { recursive: true });
  process.chdir(ROOT);
  // Isolate env
  delete process.env.TURSO_DATABASE_URL;
  delete process.env.TURSO_AUTH_TOKEN;
  delete process.env.LIBSQL_URL;
  process.env.AGENT_OS_STORE = 'json';
});

after(() => {
  process.chdir(ORIG_CWD);
  try {
    rmSync(ROOT, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
});

test('json backend round-trips hub document', async () => {
  // Dynamic import after chdir so ROOT paths resolve
  const storePath = join(ORIG_CWD, 'scripts', 'agent-os-store.mjs');
  // Import from original package location via file URL relative to repo
  const mod = await import(pathToFileUrl(join(ORIG_CWD, 'scripts/agent-os-store.mjs')));
  mod._resetStoreForTests();

  process.env.AGENT_OS_STORE = 'json';
  const seed = {
    meta: { system: 'test' },
    goals: [{ id: 'G1' }],
    tasks: [{ id: 'T1', status: 'pending' }],
  };
  const init = await mod.initStore({ seed });
  assert.equal(init.mode, 'json');
  assert.ok(init.hasData);

  const hub = mod.getHub();
  assert.equal(hub.goals[0].id, 'G1');

  hub.tasks.push({ id: 'T2', status: 'pending' });
  const saved = await mod.saveHub(hub);
  assert.equal(saved.ok, true);

  const disk = JSON.parse(readFileSync(join(ROOT, '.agents', 'hub_db.json'), 'utf8'));
  assert.equal(disk.tasks.length, 2);
});

test('file: libsql backend works offline as Turso-compatible store', async () => {
  const mod = await import(pathToFileUrl(join(ORIG_CWD, 'scripts/agent-os-store.mjs')));
  mod._resetStoreForTests();

  // Isolate from prior json test artifacts
  const hubPath = join(ROOT, '.agents', 'hub_db.json');
  if (existsSync(hubPath)) rmSync(hubPath, { force: true });

  const dbFile = join(ROOT, '.agents', 'agent-os-test.db').replace(/\\/g, '/');
  if (existsSync(dbFile)) rmSync(dbFile, { force: true });
  if (existsSync(dbFile.replace(/\//g, '\\'))) rmSync(dbFile.replace(/\//g, '\\'), { force: true });

  process.env.AGENT_OS_STORE = 'turso';
  process.env.TURSO_DATABASE_URL = `file:${dbFile}`;
  delete process.env.TURSO_AUTH_TOKEN;

  const seed = {
    meta: { system: 'turso-file-test' },
    goals: [{ id: 'G-TURSO' }],
    tasks: [{ id: 'T-TURSO', status: 'pending', dependencies: [], attempts: 0 }],
  };

  const init = await mod.initStore({ seed });
  assert.equal(init.mode, 'turso', 'expected turso mode for file: URL');
  assert.ok(init.hasData);

  const hub = mod.getHub();
  assert.ok(hub, 'hub cache loaded');
  assert.equal(hub.goals[0].id, 'G-TURSO');

  hub.meta.note = 'persisted';
  const saved = await mod.saveHub(hub);
  assert.equal(saved.ok, true, saved.error || 'save failed');

  // Re-init and confirm load from libsql file (not leftover local seed)
  mod._resetStoreForTests();
  if (existsSync(hubPath)) rmSync(hubPath, { force: true });
  process.env.TURSO_DATABASE_URL = `file:${dbFile}`;
  process.env.AGENT_OS_STORE = 'turso';
  await mod.initStore({ seed: { meta: {}, goals: [], tasks: [] } });
  const again = mod.getHub();
  assert.ok(again);
  assert.equal(again.meta.note, 'persisted');
  assert.equal(again.goals[0].id, 'G-TURSO');
});

test('agent-os.js CLI wires store commands', () => {
  const src = readFileSync(join(ORIG_CWD, 'scripts/agent-os.js'), 'utf8');
  assert.match(src, /agent-os-store\.mjs/);
  assert.match(src, /migrate-turso/);
  assert.match(src, /pull-turso/);
  assert.match(src, /bootStore/);
  assert.match(src, /flushStore/);
  assert.match(src, /saveHub/);
});

function pathToFileUrl(p) {
  let path = p.replace(/\\/g, '/');
  if (!path.startsWith('/')) {
    // Windows drive
    path = `/${path}`;
  }
  return `file://${path}`;
}
