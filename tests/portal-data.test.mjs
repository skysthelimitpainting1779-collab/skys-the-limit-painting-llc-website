/**
 * Portal data mapping — pure path from shipped mapLeadsForPortal.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const { mapLeadsForPortal } = await import(
  pathToFileURL(join(process.cwd(), 'src/lib/auth/portal.ts')).href
);

test('portal DTO never returns another email’s leads', () => {
  const rows = [
    { lead_id: 'mine', email: 'me@co.com', status: 'new', project_type: 'Interior' },
    { lead_id: 'theirs', email: 'them@co.com', status: 'won', project_type: 'Exterior' },
  ];
  const out = mapLeadsForPortal(rows, 'me@co.com');
  assert.equal(out.length, 1);
  assert.equal(out[0].lead_id, 'mine');
  assert.equal(out[0].project_type, 'Interior');
  assert.ok(!out.some((l) => l.email === 'them@co.com'));
});

test('null rows yield empty list', () => {
  assert.deepEqual(mapLeadsForPortal(null, 'a@b.com'), []);
  assert.deepEqual(mapLeadsForPortal(undefined, 'a@b.com'), []);
});
