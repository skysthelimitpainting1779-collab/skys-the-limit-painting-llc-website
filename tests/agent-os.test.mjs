import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));

test('agent OS exposes prompt-aligned bootstrap, eval, and durable control-plane artifacts', () => {
  const harness = read('scripts/agent-os.js');

  assert.match(harness, /bootstrapSystem/);
  assert.match(harness, /runEvalHarness/);
  assert.match(harness, /implementation-contract\.md/);
  assert.match(harness, /runtime-capability-matrix\.md/);
  assert.match(harness, /operating-summary\.md/);
  assert.match(harness, /DEFAULT_MILESTONES/);
  assert.match(harness, /DEFAULT_CAPABILITIES/);
  assert.match(harness, /effects/);
  assert.match(harness, /waits/);
  assert.match(harness, /checkpoints/);
  assert.match(harness, /dead-letter/);
  assert.match(harness, /appendTrace/);
  assert.match(harness, /EVAL-M1-CLOSED-LOOP/);
});

test('agent OS self-healing quarantines failures instead of reverting user files', () => {
  const harness = read('scripts/agent-os.js');

  assert.match(harness, /Quarantine only/);
  assert.match(harness, /Manual inspection required before retry/);
  assert.doesNotMatch(harness, /execSync\(`git checkout --/);
  assert.doesNotMatch(harness, /execSync\('git checkout --/);
  assert.match(harness, /agent-os-core\.mjs/);
  assert.match(harness, /MAX_TASK_ATTEMPTS|shouldQuarantineTask/);
  assert.match(harness, /assertPhaseEntry|auto-seed/);
});

test('agent OS generated ledgers exist after bootstrap', () => {
  for (const path of [
    '.agents/operating-summary.md',
    '.agents/implementation-contract.md',
    '.agents/runtime-capability-matrix.md',
    '.agents/evals.md',
    '.agents/effects.md',
    '.agents/waits.md',
    '.agents/queues/now.md',
    '.agents/queues/next.md',
    '.agents/queues/blocked.md',
    '.agents/queues/improve.md',
    '.agents/queues/recurring.md',
  ]) {
    assert.ok(exists(path), `${path} should exist`);
  }

  const contract = read('.agents/implementation-contract.md');
  assert.match(contract, /goal -> task graph -> claim -> execute -> verify -> evidence -> memory -> eval\/improvement/);
  assert.match(contract, /does not automatically revert source files/);
});
