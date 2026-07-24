import assert from 'node:assert/strict';
import test from 'node:test';

import { isCommitOk } from '../scripts/enforce-git.js';

test('accepts conventional commits with one or repeated scopes', () => {
  assert.equal(isCommitOk('fix(ci): repair workflow guard'), true);
  assert.equal(isCommitOk('chore(deps)(deps-dev): bump tsx from 4.23.0 to 4.23.1'), true);
  assert.equal(isCommitOk('chore(actions)(deps): bump CodeQL'), true);
});

test('accepts merge, revert, and standard Dependabot subjects', () => {
  assert.equal(isCommitOk('Merge pull request #123 from owner/branch'), true);
  assert.equal(isCommitOk('Revert "fix(ci): change"'), true);
  assert.equal(isCommitOk('Bump next from 16.2.9 to 16.2.10'), true);
});

test('rejects non-conventional subjects', () => {
  assert.equal(isCommitOk('updated stuff'), false);
  assert.equal(isCommitOk('chore: '), false);
});
