/**
 * Auto-learn bridge — derives prevention rules from the structured learning index.
 * Prefer: node scripts/learning-loop.mjs heal|status|record
 *
 * Kept for backward compatibility with older callers.
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getStatus, loadIndex, rebuildMarkdownViews, runHealPass } from './learning-loop.mjs';

const RULES_FILE = join(process.cwd(), '.agents', 'governance', 'RULES.md');
const rulesDir = dirname(RULES_FILE);
if (!existsSync(rulesDir)) {
  mkdirSync(rulesDir, { recursive: true });
}

console.log('\n[Auto-Learn] Running structured learning-loop heal + rule sync...');

const heal = runHealPass();
console.log(`[Auto-Learn] ${heal.message}`);

const index = loadIndex();
const byRecent = Object.values(index.incidents).sort(
  (a, b) => new Date(b.last_seen) - new Date(a.last_seen)
);
const latest = byRecent.find((i) => i.status === 'open') || byRecent[0];

if (!latest) {
  console.log('[Auto-Learn] No incidents in index yet. Nothing to codify.');
  rebuildMarkdownViews(index);
  process.exit(0);
}

const ruleEntry = `
### Auto-Generated Rule based on failure at ${new Date().toISOString()}
- **Incident**: ${latest.id} (${latest.category}, ${latest.count}x)
- **Triggering Error Context**: ${latest.title}
- **Rule**: ${latest.prevention}
`;

const existing = existsSync(RULES_FILE) ? readFileSync(RULES_FILE, 'utf8') : '';
if (!existing.includes(latest.id)) {
  if (!existsSync(RULES_FILE)) {
    writeFileSync(RULES_FILE, `# Governance Rules\n\nLiving rules derived from the learning loop.\n`, 'utf8');
  }
  appendFileSync(RULES_FILE, ruleEntry, 'utf8');
  console.log(`[Auto-Learn] Appended prevention for ${latest.id} → ${RULES_FILE}`);
} else {
  console.log(`[Auto-Learn] Rule for ${latest.id} already present; skipped append.`);
}

rebuildMarkdownViews(index);
const status = getStatus();
console.log(
  `[Auto-Learn] Index: ${status.stats.unique_fingerprints} unique · ${status.stats.duplicates_suppressed || 0} dupes suppressed · ${status.stats.auto_heals || 0} auto-heals`
);
