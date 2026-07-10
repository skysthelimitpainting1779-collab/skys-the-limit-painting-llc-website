import { execSync } from 'child_process';
import { recordFailure, runHealPass } from './learning-loop.mjs';

/**
 * Compile pipeline with true self-healing loop:
 * DETECT → RECORD (deduped) → HEAL → RETRY once → exit
 */
const runCommand = (command, stepName, { allowRetry = true } = {}) => {
  console.log(`\n--- Starting Step: ${stepName} ---`);
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { stdio: 'pipe', encoding: 'utf8' });
    if (output) console.log(output);
    console.log(`--- Completed Step: ${stepName} ---\n`);
    return true;
  } catch (error) {
    const stdout = error.stdout ? error.stdout.toString() : '';
    const stderr = error.stderr ? error.stderr.toString() : error.message;
    console.error(`\n[!] Error executing step: ${stepName}`);
    console.error(`Command failed: ${command}`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr.slice(0, 2000));

    const recorded = recordFailure({
      title: `Step failed: ${stepName}`,
      error: `${stderr}\n${stdout}`.trim(),
      command,
      area: 'compile',
      step: stepName,
    });
    console.log(`[learning-loop] ${recorded.message}`);

    if (allowRetry && (recorded.healed || recorded.category === 'okf-wiki' || recorded.category === 'harness-checkpoint')) {
      console.log(`[self-heal] Attempting heal pass + single retry for ${stepName}...`);
      const heal = runHealPass();
      console.log(`[self-heal] ${heal.message}`);
      const retried = runCommand(command, `${stepName} (retry)`, { allowRetry: false });
      if (retried) return true;
    }

    process.exit(1);
  }
};

// Proactive heal before gates (cheap; keeps wiki tags compliant)
try {
  const heal = runHealPass();
  if (heal.wikiFixed > 0) {
    console.log(`[self-heal] Pre-flight: ${heal.message}`);
  }
} catch (e) {
  console.warn(`[self-heal] Pre-flight heal skipped: ${e.message}`);
}

runCommand('node scripts/validate-okf.js', 'A: OKF Validator');
runCommand('npm run lint:md', 'B: Markdown Linter');
runCommand('graphify update .', 'C: Graphifyy Update');
console.log('Compilation pipeline completed successfully.');
