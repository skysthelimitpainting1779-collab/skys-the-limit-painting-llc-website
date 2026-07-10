import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';

import {
  classifyFailure,
  fingerprint,
  normalizeErrorText,
} from '../scripts/learning-loop.mjs';

test('normalizeErrorText strips paths and timestamps for stable fingerprints', () => {
  const a = normalizeErrorText('Error in C:\\Users\\Johnny Cage\\DEV\\repo\\file.md at 2026-07-08T02:35:05.324Z');
  const b = normalizeErrorText('Error in C:\\Users\\Other\\proj\\file.md at 2026-07-09T11:00:00.000Z');
  assert.equal(a, b);
});

test('fingerprint is stable across duplicate OKF dumps with different paths', () => {
  const title = 'Step failed: A: OKF Validator';
  const command = 'node scripts/validate-okf.js';
  const e1 = 'Error in C:\\Users\\A\\repo\\.agents\\wiki\\Foo.md: Synthesis section is under 30 words';
  const e2 = 'Error in C:\\Users\\B\\other\\.agents\\wiki\\Foo.md: Synthesis section is under 30 words';
  assert.equal(
    fingerprint({ title, error: e1, command, area: 'compile' }),
    fingerprint({ title, error: e2, command, area: 'compile' })
  );
});

test('classifyFailure maps OKF wiki failures to healable okf-wiki', () => {
  const c = classifyFailure({
    title: 'Step failed: A: OKF Validator',
    command: 'node scripts/validate-okf.js',
    error: 'Awaiting semantic compilation Synthesis section under 30 words',
  });
  assert.equal(c.category, 'okf-wiki');
  assert.equal(c.healable, true);
  assert.match(c.prevention, /auto-compiled|wiki/i);
});

test('classifyFailure maps PowerShell switch errors', () => {
  const c = classifyFailure({
    title: 'Select-String switch',
    error: 'Cannot convert String to SwitchParameter CaseSensitive',
    command: 'powershell -Command Select-String',
  });
  assert.equal(c.category, 'shell-powershell');
  assert.equal(c.healable, false);
});

test('learning-loop CLI record dedupes second identical failure', () => {
  const root = process.cwd();
  // Use real repo learning loop via CLI so index lands in .learnings — isolate by unique title token
  const token = `dedupe-test-${Date.now()}`;
  const title = `Synthetic failure ${token}`;
  const error = `unique-marker-${token} boom`;

  const r1 = spawnSync(
    process.execPath,
    [
      'scripts/learning-loop.mjs',
      'record',
      '--title',
      title,
      '--error',
      error,
      '--command',
      'node -e "process.exit(1)"',
      '--area',
      'test',
    ],
    { encoding: 'utf8', cwd: root }
  );
  assert.equal(r1.status, 0, r1.stderr || r1.stdout);
  assert.match(r1.stdout, /Recorded ERR-/);

  const r2 = spawnSync(
    process.execPath,
    [
      'scripts/learning-loop.mjs',
      'record',
      '--title',
      title,
      '--error',
      error,
      '--command',
      'node -e "process.exit(1)"',
      '--area',
      'test',
    ],
    { encoding: 'utf8', cwd: root }
  );
  assert.equal(r2.status, 0, r2.stderr || r2.stdout);
  assert.match(r2.stdout, /Duplicate suppressed/);

  assert.ok(existsSync(join(root, '.learnings', 'ERRORS_INDEX.md')));
  assert.ok(existsSync(join(root, '.learnings', 'index.json')));
  const index = JSON.parse(readFileSync(join(root, '.learnings', 'index.json'), 'utf8'));
  assert.ok(index.stats.duplicates_suppressed >= 1);
});

test('validate-okf exits 0 on auto-compiled wiki tree', () => {
  const r = spawnSync(process.execPath, ['scripts/validate-okf.js'], {
    encoding: 'utf8',
    cwd: process.cwd(),
  });
  assert.equal(r.status, 0, r.stderr || r.stdout);
  assert.match(r.stdout, /OKF Validation passed/);
});

test('agent OS still quarantines without git checkout rollback', () => {
  const harness = readFileSync(new URL('../scripts/agent-os.js', import.meta.url), 'utf8');
  assert.match(harness, /recordFailure/);
  assert.match(harness, /learning-loop/);
  assert.doesNotMatch(harness, /execSync\(`git checkout --/);
  assert.doesNotMatch(harness, /execSync\('git checkout --/);
});
