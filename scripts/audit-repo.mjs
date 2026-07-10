import { execSync } from 'child_process';
import fs from 'fs';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8' }).trim();
  } catch (e) {
    console.error(`Error running ${cmd}:`, e.message);
    return '';
  }
}

const isCI = process.env.CI === 'true';

// Find all branches in origin, filter out HEAD and main
const branchesOutput = run('git branch -r');
const branches = branchesOutput
  .split('\n')
  .map(b => b.trim().replace('origin/', ''))
  .filter(b => b && !b.includes('HEAD ->') && b !== 'main' && b !== 'staging' && !b.includes('->'));

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const thirtyDaysSec = thirtyDaysAgo.getTime() / 1000;

let report = '# Repository Audit Report\n\n## Branch Status\n\n';
let staleCount = 0;
let activeCount = 0;

for (const branch of branches) {
  // Get last commit timestamp, relative time, and author
  const logInfo = run(`git log -1 --format="%ct|%cr|%an" origin/${branch}`);
  if (!logInfo) continue;
  
  const [timestampStr, relative, author] = logInfo.split('|');
  const timestamp = parseInt(timestampStr, 10);
  const isStale = timestamp < thirtyDaysSec;
  
  // Check for open PRs associated with this branch
  const prs = run(`gh pr list --state open --head ${branch} --json url -q ".[].url"`);
  
  if (isStale && !prs) {
    report += `- 🔴 **${branch}**: Stale (Last updated: ${relative} by ${author} - No open PR)\n`;
    staleCount++;
  } else if (!prs) {
    report += `- 🟡 **${branch}**: Active (Last updated: ${relative} by ${author} - No open PR)\n`;
    activeCount++;
  } else {
    report += `- 🟢 **${branch}**: Active with PR (Last updated: ${relative} by ${author} - [PR](${prs}))\n`;
    activeCount++;
  }
}

report += `\n**Summary:** ${staleCount} stale branches, ${activeCount} active branches.\n`;

console.log(report);

if (isCI) {
  const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;
  if (GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(GITHUB_STEP_SUMMARY, report);
  }
}
