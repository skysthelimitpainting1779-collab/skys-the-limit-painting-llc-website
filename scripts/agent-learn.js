import fs from 'node:fs';
import path from 'node:path';

// Self-Healing CLI: Discovers the nearest `.agents` directory and logs errors or skills.
// Usage: node scripts/agent-learn.js --type [error|skill] --name "..." --content "..."

const args = process.argv.slice(2);
const typeIndex = args.indexOf('--type');
const nameIndex = args.indexOf('--name');
const contentIndex = args.indexOf('--content');

if (typeIndex === -1 || nameIndex === -1 || contentIndex === -1) {
  console.error(
    'Usage: node agent-learn.js --type <error|skill> --name <name> --content <content>'
  );
  process.exit(1);
}

const type = args[typeIndex + 1];
const name = args[nameIndex + 1];
const content = args[contentIndex + 1];

// Traverse up from process.cwd() to find the nearest .agents directory
let currentDir = process.cwd();
let agentsDir = null;

while (currentDir !== path.parse(currentDir).root) {
  const potentialAgentsDir = path.join(currentDir, '.agents');
  if (fs.existsSync(potentialAgentsDir)) {
    agentsDir = potentialAgentsDir;
    break;
  }
  currentDir = path.dirname(currentDir);
}

if (!agentsDir) {
  console.error('Error: No .agents directory found in the current tree.');
  process.exit(1);
}

console.log(`[Agent Learn] Target Domain: ${agentsDir}`);

if (type === 'error') {
  const errorLedger = path.join(agentsDir, 'dead-letter', 'ERRORS.md');
  const timestamp = new Date().toISOString().split('T')[0];
  const entry = `\n## [ERR-${timestamp}] ${name}\n${content}\n`;

  fs.appendFileSync(errorLedger, entry);
  console.log(`[Agent Learn] Error logged successfully to ${errorLedger}`);
} else if (type === 'skill') {
  const skillFile = path.join(
    agentsDir,
    'skills',
    `${name.toLowerCase().replace(/\s+/g, '-')}.md`
  );
  const entry = `---
type: skill
name: ${name}
---

# ${name}
${content}
`;

  fs.writeFileSync(skillFile, entry);
  console.log(`[Agent Learn] Skill codified successfully to ${skillFile}`);
} else {
  console.error('Error: --type must be either "error" or "skill".');
  process.exit(1);
}
