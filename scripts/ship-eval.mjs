#!/usr/bin/env node
/**
 * Deterministic ship evals (Anthropic coding-agent pattern):
 * code graders first — lint, test, optional build — not LLM self-score.
 *
 *   npm run ship:eval
 *   npm run ship:eval -- --build
 *
 * Writes .agents/goals/_eval/last.json and appends to history.jsonl
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const EVAL_DIR = join(ROOT, '.agents', 'goals', '_eval');
const args = process.argv.slice(2);
const withBuild = args.includes('--build');

function run(name, cmd, cmdArgs) {
  const started = Date.now();
  const r = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: true,
    env: process.env,
  });
  return {
    name,
    pass: r.status === 0,
    status: r.status,
    ms: Date.now() - started,
    tail: `${r.stdout || ''}${r.stderr || ''}`.replace(/\r/g, '').slice(-800),
  };
}

mkdirSync(EVAL_DIR, { recursive: true });

const graders = [
  run('lint', 'npm', ['run', 'lint']),
  run('test', 'npm', ['test']),
];
if (withBuild) graders.push(run('build', 'npm', ['run', 'build']));

const ok = graders.every((g) => g.pass);
const report = {
  at: new Date().toISOString(),
  ok,
  suite: 'ship-eval',
  kind: 'regression',
  description:
    'Deterministic graders for coding agents (Anthropic: prefer unit tests / static analysis over self-assessment)',
  graders: graders.map(({ name, pass, status, ms }) => ({ name, pass, status, ms })),
  details: graders,
  pass_rate: graders.filter((g) => g.pass).length / graders.length,
  next: ok
    ? 'Ship / mark goal done'
    : 'Fix failures; re-run npm run ship:eval; do not claim done',
};

writeFileSync(join(EVAL_DIR, 'last.json'), JSON.stringify(report, null, 2) + '\n');
appendFileSync(
  join(EVAL_DIR, 'history.jsonl'),
  JSON.stringify({
    at: report.at,
    ok: report.ok,
    pass_rate: report.pass_rate,
    graders: report.graders,
  }) + '\n',
);

console.log(JSON.stringify(report, null, 2));
process.exit(ok ? 0 : 1);
