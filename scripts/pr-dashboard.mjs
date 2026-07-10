#!/usr/bin/env node
/**
 * Build a sticky PR dashboard markdown body from env JSON blobs.
 */
function parse(name, fallback = {}) {
  try {
    if (!process.env[name]) return fallback;
    return JSON.parse(process.env[name]);
  } catch {
    return fallback;
  }
}

const branch = parse('BRANCH_NORMALIZE_JSON', {});
const vercel = parse('VERCEL_VERIFY_JSON', {});
const labels = parse('PR_LABELS_JSON', {});
const titleLint = parse('PR_TITLE_JSON', {});
const quality = process.env.CI_QUALITY_CONCLUSION || 'unknown';
const number = process.env.PR_NUMBER || '';
const sha = (process.env.GITHUB_SHA || '').slice(0, 7);

const row = (ok, label, detail) =>
  `| ${ok ? '✅' : '❌'} | **${label}** | ${detail.replace(/\|/g, '/')} |`;

const branchOk = branch.action === 'ok' || branch.action === 'skip';
const vercelOk = !!(vercel.ok || vercel.skipped);
const titleOk = titleLint.ok !== false;

const lines = [
  `## Agent OS PR dashboard`,
  '',
  `| | Check | Detail |`,
  `|---|--------|--------|`,
  row(branchOk, 'Branch', `\`${branch.original || '—'}\`${branch.action === 'rename' ? ` → \`${branch.normalized}\`` : ''}`),
  row(titleOk, 'PR title', titleLint.ok ? `\`${titleLint.title}\`` : `needs CC · suggested \`${titleLint.suggested || ''}\``),
  row(quality === 'success' || quality === 'unknown', 'CI quality', quality),
  row(vercelOk, 'Vercel', vercel.ok ? `[preview](${vercel.url}) · HTTP ${vercel.httpStatus || '—'}` : vercel.skipped ? 'skipped (no token)' : vercel.error || vercel.state || 'pending'),
  row(true, 'Size', labels.labels?.find?.((l) => l.startsWith('size/')) || `${labels.files ?? '—'} files`),
  '',
  vercel.url ? `### Preview\n\n${vercel.url}\n` : '',
  `### Labels`,
  '',
  (labels.labels || []).length ? (labels.labels || []).map((l) => `\`${l}\``).join(' ') : '_none yet_',
  '',
  `### Quick commands`,
  '',
  '```bash',
  'npm run lint:ci && npm test && npm run build',
  '```',
  '',
  `<sub>SHA \`${sha}\` · PR #${number} · updated ${new Date().toISOString()}</sub>`,
];

process.stdout.write(lines.filter((l) => l !== undefined).join('\n'));
