import { execSync } from 'child_process';
import path from 'path';

function runStep(name, command, cwd) {
  console.log(`\n========================================`);
  console.log(`Running CI Step: ${name}...`);
  console.log(`Command: ${command}`);
  console.log(`========================================\n`);

  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    console.log(`\n[PASS] Step completed successfully: ${name}!`);
    return true;
  } catch (error) {
    console.error(`\n[FAIL] Step failed: ${name}!`);
    console.error(`Error details: ${error.message}`);
    return false;
  }
}

function runCiCheck() {
  console.log('STARTING AUTOMATED TS/LINT COMPILATION RUNNER (CI Pre-Flight Check)');
  const websiteDir = path.resolve('.');

  // Step 1: Clean build artifacts to ensure a fresh test environment
  console.log('\nCleaning previous build artifacts...');
  try {
    execSync('npm run clean', { cwd: websiteDir, stdio: 'ignore' });
    console.log('Clean complete.');
  } catch (e) {
    // If clean fails or doesn't exist, proceed anyway
    console.log('Clean script skipped or failed. Proceeding with fresh compile.');
  }

  // Step 2: Lint / TypeScript Compilation check
  const lintPassed = runStep(
    'TypeScript Compilation & Linting',
    'npm run lint',
    websiteDir
  );

  if (!lintPassed) {
    console.error('\nCI Pre-Flight Check failed at Lint/TS check!');
    process.exit(1);
  }

  // Step 3: Production Build Simulation
  const buildPassed = runStep(
    'Production Bundle & Post-Build Chains',
    'npm run build',
    websiteDir
  );

  if (!buildPassed) {
    console.error('\nCI Pre-Flight Check failed at Production Build Simulation!');
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('CI PRE-FLIGHT CHECK PASSED PERFECTLY!');
  console.log('Your codebase has compiled with zero errors, successfully linted,');
  console.log('and passed all post-build sitemap & schema validators.');
  console.log('Ready for secure deployment to Vercel production.');
  console.log('========================================\n');
  process.exit(0);
}

runCiCheck();
