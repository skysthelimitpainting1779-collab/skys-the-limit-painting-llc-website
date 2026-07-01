#!/usr/bin/env node
/**
 * Utility to help codify failures (exit codes, errors) into .learnings/ERRORS.md
 *
 * Usage:
 *   node scripts/codify-failure.mjs "Short title" "Error message here" "Area" "Related file"
 *
 * Or call from other scripts on non-zero exit.
 *
 * This makes systematic error codification fast and consistent.
 */

import { appendFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const [
  ,
  ,
  title = 'Unnamed failure',
  errorMsg = 'No details',
  area = 'general',
  related = 'unknown',
] = process.argv;

const date = new Date();
const id = `ERR-${date.toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 900) + 100)}`;

const entry = `
## [${id}] ${title}

**Logged**: ${date.toISOString()}
**Priority**: medium
**Status**: open (needs prevention code)
**Area**: ${area}

### Summary [${id}]

${title}

### Error [${id}]

\`\`\`text
${errorMsg}
\`\`\`

### Fix / Learning [${id}]

Root cause analysis and working example needed.

### Prevention Rule [${id}]

Implement guard / check / validation so this class of error never recurs. Reference this ID in the code.

### Metadata [${id}]

- Reproducible: ?
- Related Files: ${related}
- See Also: Gemini brain or previous session that surfaced this
`;

appendFileSync('.learnings/ERRORS.md', entry);
console.log(`Appended ${id} to .learnings/ERRORS.md`);
console.log(
  'Now add # CORRECT / # WRONG prevention code and mark as resolved.'
);
