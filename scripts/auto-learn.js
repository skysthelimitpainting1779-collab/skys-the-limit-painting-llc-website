import fs from 'fs';
import path from 'path';

const ERRORS_FILE = path.join(process.cwd(), '.learnings', 'ERRORS.md');
const RULES_FILE = path.join(
  process.cwd(),
  '.agents',
  'governance',
  'RULES.md'
);

// Ensure governance directory exists
const rulesDir = path.dirname(RULES_FILE);
if (!fs.existsSync(rulesDir)) {
  fs.mkdirSync(rulesDir, { recursive: true });
}

if (!fs.existsSync(ERRORS_FILE)) {
  console.log('No errors file found. Exiting.');
  process.exit(0);
}

const errorsContent = fs.readFileSync(ERRORS_FILE, 'utf8');
const errorBlocks = errorsContent.split('## [ERR-');

if (errorBlocks.length <= 1) {
  console.log('No specific errors logged yet.');
  process.exit(0);
}

// Get the latest error block
const latestErrorRaw = errorBlocks[errorBlocks.length - 1];
const latestError = `## [ERR-${latestErrorRaw}`;

console.log('\n[Auto-Learn] Analyzing latest failure...');

// Stubbed LLM Analysis
// In a real implementation, we would pass `latestError` to an LLM.
// Here we parse the generic trace to generate a stubbed rule.

let preventativeRule =
  'Always read execution logs to determine the root cause of the crash.';
if (
  latestError.includes('validate-okf.js') ||
  latestError.includes('Missing frontmatter properties')
) {
  preventativeRule =
    'Always ensure YAML frontmatter has a `type`, `title`, and `timestamp` in Markdown files.';
} else if (latestError.includes('markdownlint')) {
  preventativeRule =
    'Ensure all markdown files comply with `markdownlint` standards. Fix trailing spaces and blank lines before committing.';
} else {
  preventativeRule =
    'Review the execution logs carefully before running pipeline scripts.';
}

const ruleEntry = `\n### Auto-Generated Rule based on failure at ${new Date().toISOString()}\n- **Triggering Error Context**: ${latestErrorRaw.split('\n')[1] || 'Unknown Step'}\n- **Rule**: ${preventativeRule}\n`;

fs.appendFileSync(RULES_FILE, ruleEntry, 'utf8');

console.log(
  `[Auto-Learn] Successfully extracted and stored preventative rule:`
);
console.log(`  -> ${preventativeRule}`);
console.log(`[Auto-Learn] Rule appended to ${RULES_FILE}`);
