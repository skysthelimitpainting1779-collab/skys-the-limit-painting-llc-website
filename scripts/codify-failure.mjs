#!/usr/bin/env node
/**
 * Codify a failure into the learning loop (deduped).
 *
 * Usage:
 *   node scripts/codify-failure.mjs "Short title" "Error message" "Area" "Related file"
 */

import { recordFailure } from './learning-loop.mjs';

const [
  ,
  ,
  title = 'Unnamed failure',
  errorMsg = 'No details',
  area = 'general',
  related = 'unknown',
] = process.argv;

const result = recordFailure({
  title,
  error: `${errorMsg}\nRelated: ${related}`,
  area,
  command: '',
});

console.log(`[codify-failure] ${result.message}`);
if (!result.isDuplicate) {
  console.log('Prevention rule stored. See .learnings/ERRORS_INDEX.md and .agents/governance/PREVENTION_RULES.md');
}
