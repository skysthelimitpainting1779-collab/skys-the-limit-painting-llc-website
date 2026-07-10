#!/usr/bin/env node
/**
 * Local CI preflight — mirrors GitHub Actions quality job.
 */
import { execSync } from 'node:child_process';
import path from 'node:path';

const websiteDir = path.resolve('.');

function runStep(name, command) {
  console.log(`\n========================================`);
  console.log(`CI Step: ${name}`);
  console.log(`Command: ${command}`);
  console.log(`========================================\n`);
  try {
    execSync(command, {
      cwd: websiteDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        FORCE_COLOR: '1',
        HOOKS_SKIP: '1',
        ENTIRE_SYNC_SKIP: '1',
        GRAPHIFY_SKIP_HOOK: '1',
        AGENT_OS_SKIP_SCAN: '1',
      },
    });
    console.log(`\n[PASS] ${name}`);
    return true;
  } catch {
    console.error(`\n[FAIL] ${name}`);
    return false;
  }
}

console.log('STARTING LOCAL CI PREFLIGHT (matches .github/workflows/ci.yml quality job)');

const steps = [
  ['Clean', 'npm run clean'],
  ['React pins', 'npm run lint:react'],
  ['TypeScript', 'npm run lint:types'],
  ['Markdownlint', 'npm run lint:md'],
  ['Knip', 'npm run lint:knip'],
  ['Agent OS bootstrap + tests', 'node scripts/agent-os.js bootstrap && npm test'],
  ['Production build', 'npm run build'],
];

for (const [name, cmd] of steps) {
  // clean is best-effort
  if (name === 'Clean') {
    try {
      execSync(cmd, { cwd: websiteDir, stdio: 'ignore' });
    } catch {
      console.log('Clean skipped.');
    }
    continue;
  }
  if (!runStep(name, cmd)) {
    console.error('\nCI preflight failed. Fix the step above, then re-run: npm run ci');
    process.exit(1);
  }
}

console.log('\n========================================');
console.log('CI PREFLIGHT PASSED');
console.log('Ready to push. Protected branches still require PR review.');
console.log('========================================\n');
process.exit(0);
