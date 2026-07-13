#!/usr/bin/env node
/**
 * Lean improve loop (zero theater):
 *   zero-theater → prevent rebuild → prevent test → ship:eval
 *
 *   npm run ship:improve
 *   npm run ship:improve -- --no-eval
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const noEval = process.argv.includes('--no-eval');

function run(label, cmd, cmdArgs = []) {
  const started = Date.now();
  const r = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: true,
    env: process.env,
  });
  return {
    label,
    ok: r.status === 0,
    status: r.status,
    ms: Date.now() - started,
    tail: `${r.stdout || ''}${r.stderr || ''}`.slice(-1200),
  };
}

const steps = [
  run('zero-theater', 'npm', ['run', 'agents:zero-theater']),
  run('host-compile', 'npm', ['run', 'host:compile']),
  run('prevent-rebuild', 'npm', ['run', 'learn:prevent:rebuild']),
  run('prevent-test', 'npm', ['run', 'learn:prevent:test']),
];
if (!noEval) steps.push(run('ship-eval', 'npm', ['run', 'ship:eval']));

const ok = steps.every((s) => s.ok);
const report = {
  at: new Date().toISOString(),
  ok,
  loop: 'ship-improve-lean',
  steps: steps.map(({ label, ok: o, status, ms }) => ({ label, ok: o, status, ms })),
};

const outDir = join(ROOT, '.agents', 'goals', '_eval');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'improve-last.json'), JSON.stringify(report, null, 2) + '\n');

console.log(JSON.stringify(report, null, 2));
process.exit(ok ? 0 : 1);
