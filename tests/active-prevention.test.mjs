import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  evaluateToolUse,
  selfTest,
  buildInjectText,
  rebuildActiveContext,
  preToolHookOutput,
  loadLessons,
} from '../scripts/active-prevention.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('selfTest suite passes (hard guards)', () => {
  const results = selfTest();
  const failed = results.filter((r) => !r.ok);
  assert.equal(failed.length, 0, JSON.stringify(failed, null, 2));
});

test('denies next/dynamic ssr:false writes', () => {
  const r = evaluateToolUse('Write', {
    file_path: 'src/components/Hero.tsx',
    content: `import dynamic from 'next/dynamic';
const Map = dynamic(() => import('./Map'), { ssr: false });
`,
  });
  assert.equal(r.decision, 'deny');
  assert.ok(r.matched.includes('next-dynamic-ssr-false'));
});

test('denies nested powershell -Command', () => {
  const r = evaluateToolUse('Bash', {
    command:
      'powershell -Command "powershell -Command Get-ChildItem"',
  });
  assert.equal(r.decision, 'deny');
});

test('allows clean node commands', () => {
  const r = evaluateToolUse('Bash', {
    command: 'node scripts/learning-loop.mjs status',
  });
  assert.equal(r.decision, null);
});

test('preToolHookOutput returns permissionDecision deny JSON', () => {
  const out = preToolHookOutput('Edit', {
    file_path: 'src/app/page.tsx',
    new_string: `import dynamic from 'next/dynamic'\nexport const X = dynamic(() => import('./x'), { ssr: false })`,
  });
  assert.ok(out);
  assert.equal(out.hookSpecificOutput.permissionDecision, 'deny');
  assert.match(out.hookSpecificOutput.permissionDecisionReason, /ssr/i);
});

test('rebuild + inject produce non-empty active context', () => {
  const rebuilt = rebuildActiveContext();
  assert.ok(existsSync(rebuilt.path));
  const inject = buildInjectText();
  assert.ok(inject.length > 80);
  assert.match(inject, /ACTIVE PREVENTION|OBEY|ROOT/i);
  const md = readFileSync(join(process.cwd(), '.learnings', 'ACTIVE_CONTEXT.md'), 'utf8');
  assert.match(md, /Active prevention/);
});

test('loadLessons filters synthetic incidents', () => {
  const lessons = loadLessons();
  for (const L of lessons) {
    assert.ok(!/synthetic|dedupe-test/i.test(L.title));
  }
});
