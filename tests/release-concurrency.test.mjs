import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const release = readFileSync(
  new URL('../.github/workflows/release.yml', import.meta.url),
  'utf8',
);

test('a newer audited production request cancels an older stuck release', () => {
  assert.match(release, /group: production-release/);
  assert.match(release, /cancel-in-progress: true/);
});
