import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const runCommand = (command, stepName) => {
  console.log(`\n--- Starting Step: ${stepName} ---`);
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { stdio: 'pipe' });
    console.log(output.toString());
    console.log(`--- Completed Step: ${stepName} ---\n`);
  } catch (error) {
    console.error(`\n[!] Error executing step: ${stepName}`);
    console.error(`Command failed: ${command}`);
    
    const stdout = error.stdout ? error.stdout.toString() : '';
    const stderr = error.stderr ? error.stderr.toString() : error.message;
    console.log(stdout);
    console.error(stderr);
    
    const timestamp = new Date().toISOString();
    const errorEntry = `\n## [ERR-${timestamp}]\n**Step Failed**: ${stepName}\n**Command**: \`${command}\`\n**Error Trace**:\n\`\`\`\n${stderr}\n${stdout}\n\`\`\`\n`;
    
    const errorsFile = path.join(process.cwd(), '.learnings', 'ERRORS.md');
    // Ensure dir exists
    if (!fs.existsSync(path.dirname(errorsFile))) fs.mkdirSync(path.dirname(errorsFile), { recursive: true });
    
    fs.appendFileSync(errorsFile, errorEntry, 'utf8');
    
    try {
      execSync('node scripts/auto-learn.js', { stdio: 'inherit' });
    } catch (e) {
      console.error('Failed to run auto-learn.js', e.message);
    }
    
    process.exit(1); // Explicitly fail
  }
};

runCommand('node scripts/validate-okf.js', 'A: OKF Validator');
runCommand('npm run lint:md', 'B: Markdown Linter');
runCommand('npx graphify update .', 'C: Graphifyy Update');
console.log('Compilation pipeline completed successfully.');
