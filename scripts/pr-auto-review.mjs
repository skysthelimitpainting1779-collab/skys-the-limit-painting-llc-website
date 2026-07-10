#!/usr/bin/env node
/**
 * Automated PR review — comprehensive Agent OS gate.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { planNormalization } from './normalize-branch.mjs';

function gh(args) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
    env: process.env,
  }).trim();
}

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  }).trim();
}

function loadEvent() {
  if (process.env.GITHUB_EVENT_PATH && existsSync(process.env.GITHUB_EVENT_PATH)) {
    return JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  }
  return null;
}

function listChangedFiles(base, head) {
  try {
    const out = git(['diff', '--name-only', `${base}...${head}`]);
    return out ? out.split(/\r?\n/).filter(Boolean) : [];
  } catch {
    try {
      return git(['diff', '--name-only', 'origin/main...HEAD']).split(/\r?\n/).filter(Boolean);
    } catch {
      return [];
    }
  }
}

function riskFlags(files) {
  const flags = [];
  const join = files.join('\n');
  if (/^\.github\/workflows\//m.test(join)) flags.push('CI workflows changed');
  if (/^supabase\//m.test(join)) flags.push('Database migrations touched');
  if (/package-lock\.json|package\.json/.test(join)) flags.push('Dependencies changed');
  if (/src\/app\/api\//.test(join)) flags.push('API routes changed');
  if (/\.env|secret|credential/i.test(join)) flags.push('Possible secrets/env files in diff');
  if (/vercel\.json/.test(join)) flags.push('Vercel config changed');
  if (files.length > 300) flags.push(`Very large PR (${files.length} files)`);
  return flags;
}

function secretSmells(files) {
  const smells = [];
  for (const f of files.slice(0, 100)) {
    if (/\.env($|\.)/i.test(f) && !/\.env\.example$/i.test(f)) {
      smells.push(`Do not commit env files: \`${f}\``);
    }
    if (/\.(pem|p12|key)$/i.test(f)) smells.push(`Key material: \`${f}\``);
  }
  return smells;
}

const CC =
  /^(feat|fix|chore|docs|infra|refactor|test|style|ci|build|perf|revert)(?:\([a-z0-9_.-]+\))?!?: .{1,100}$/i;

function buildReview({ branchPlan, files, vercel, quality, title, draft }) {
  const checks = [];
  let requestChanges = false;

  if (draft) {
    checks.push({ ok: true, label: 'Draft', detail: 'PR is draft — review is advisory' });
  }

  if (branchPlan.action === 'ok' || branchPlan.action === 'skip') {
    checks.push({ ok: true, label: 'Branch name', detail: `\`${branchPlan.original}\`` });
  } else if (branchPlan.action === 'rename') {
    checks.push({
      ok: false,
      label: 'Branch name',
      detail: `\`${branchPlan.original}\` → should be \`${branchPlan.normalized}\``,
    });
    requestChanges = true;
  } else {
    checks.push({ ok: false, label: 'Branch name', detail: branchPlan.reason });
    requestChanges = true;
  }

  if (CC.test(String(title || '').trim())) {
    checks.push({ ok: true, label: 'PR title', detail: `\`${title}\`` });
  } else {
    checks.push({
      ok: false,
      label: 'PR title',
      detail: 'Use Conventional Commits: `type(scope): subject`',
    });
    if (!draft) requestChanges = true;
  }

  if (quality === 'success') {
    checks.push({ ok: true, label: 'CI quality', detail: 'lint · knip · test · build' });
  } else if (quality === 'failure') {
    checks.push({ ok: false, label: 'CI quality', detail: 'Quality job failed' });
    if (!draft) requestChanges = true;
  } else {
    checks.push({ ok: true, label: 'CI quality', detail: `status: ${quality || 'pending/unknown'}` });
  }

  if (vercel?.ok) {
    checks.push({
      ok: true,
      label: 'Vercel preview',
      detail: `READY · HTTP ${vercel.httpStatus || 200} · ${vercel.url}`,
    });
  } else if (vercel?.skipped) {
    checks.push({ ok: true, label: 'Vercel preview', detail: 'skipped (no VERCEL_TOKEN)' });
  } else if (vercel) {
    checks.push({
      ok: false,
      label: 'Vercel preview',
      detail: vercel.error || vercel.state || 'not ready',
    });
    if (/ERROR|FAILED|CANCELED|Health check/i.test(String(vercel.error || vercel.state || ''))) {
      if (!draft) requestChanges = true;
    }
  } else {
    checks.push({ ok: true, label: 'Vercel preview', detail: 'not checked' });
  }

  const risks = riskFlags(files);
  const smells = secretSmells(files);
  if (smells.length) {
    if (!draft) requestChanges = true;
    checks.push({ ok: false, label: 'Secrets', detail: smells.join('; ') });
  } else {
    checks.push({ ok: true, label: 'Secrets', detail: 'no .env / key files in diff' });
  }

  if (risks.some((r) => /Very large|secrets/i.test(r))) {
    checks.push({ ok: false, label: 'Risk', detail: risks.join('; ') });
  } else if (risks.length) {
    checks.push({ ok: true, label: 'Risk flags', detail: risks.join('; ') });
  } else {
    checks.push({ ok: true, label: 'Risk flags', detail: 'none' });
  }

  const size =
    files.length <= 10
      ? 'XS'
      : files.length <= 30
        ? 'S'
        : files.length <= 100
          ? 'M'
          : files.length <= 300
            ? 'L'
            : 'XL';
  checks.push({ ok: true, label: 'Diff size', detail: `${files.length} files (${size})` });

  const lines = [
    '## Automated PR review (Agent OS)',
    '',
    title ? `**Title:** ${title}` : '',
    draft ? '**Status:** draft' : '',
    '',
    '### Checks',
    '',
    ...checks.map((c) => `- ${c.ok ? '✅' : '❌'} **${c.label}** — ${c.detail}`),
    '',
    `### Files (${files.length})`,
    '',
    files.length
      ? files
          .slice(0, 35)
          .map((f) => `- \`${f}\``)
          .join('\n') + (files.length > 35 ? `\n- … +${files.length - 35} more` : '')
      : '_No file list_',
    '',
    '### Human checklist',
    '',
    '- [ ] Scope matches title',
    '- [ ] Preview UI checked when UI changed',
    '- [ ] No production secrets',
    '',
    '```bash',
    'npm run lint:ci && npm test && npm run build',
    '```',
    '',
    '_`scripts/pr-auto-review.mjs`_',
  ];

  return {
    body: lines.filter((l) => l !== undefined && l !== '').join('\n'),
    event: requestChanges ? 'REQUEST_CHANGES' : 'COMMENT',
    requestChanges,
  };
}

function main() {
  const event = loadEvent();
  const pr =
    event?.pull_request ||
    (process.env.PR_NUMBER
      ? {
          number: Number(process.env.PR_NUMBER),
          title: process.env.PR_TITLE || '',
          draft: process.env.PR_DRAFT === 'true',
          head: { ref: process.env.GITHUB_HEAD_REF, sha: process.env.GITHUB_SHA },
          base: { sha: process.env.GITHUB_BASE_SHA || 'origin/main' },
        }
      : null);

  if (!pr?.number && !process.env.PR_NUMBER) {
    console.error('[pr-auto-review] No PR context');
    process.exit(1);
  }

  const number = pr.number || Number(process.env.PR_NUMBER);
  const title = pr.title || process.env.PR_TITLE || '';
  const draft = !!(pr.draft || process.env.PR_DRAFT === 'true');
  const headRef = pr.head?.ref || process.env.GITHUB_HEAD_REF || '';
  const baseSha = pr.base?.sha || 'origin/main';
  const headSha = pr.head?.sha || process.env.GITHUB_SHA || 'HEAD';

  let branchPlan;
  try {
    branchPlan = process.env.BRANCH_NORMALIZE_JSON
      ? JSON.parse(process.env.BRANCH_NORMALIZE_JSON)
      : planNormalization(headRef);
  } catch {
    branchPlan = planNormalization(headRef);
  }

  let vercel = null;
  if (process.env.VERCEL_VERIFY_JSON) {
    try {
      vercel = JSON.parse(process.env.VERCEL_VERIFY_JSON);
    } catch {
      vercel = { ok: false, error: 'invalid VERCEL_VERIFY_JSON' };
    }
  } else if (process.env.VERCEL_PREVIEW_URL) {
    vercel = { ok: true, url: process.env.VERCEL_PREVIEW_URL, httpStatus: 200 };
  }

  const quality = process.env.CI_QUALITY_CONCLUSION || '';
  const files = listChangedFiles(baseSha, headSha);
  const review = buildReview({ branchPlan, files, vercel, quality, title, draft });
  const repo = process.env.GITHUB_REPOSITORY;

  if (!repo) {
    console.log(review.body);
    process.exit(review.requestChanges ? 2 : 0);
  }

  try {
    const existing = gh([
      'api',
      `repos/${repo}/pulls/${number}/reviews`,
      '--jq',
      '[.[].body] | join("\n---\n")',
    ]);
    if (existing.includes('Automated PR review (Agent OS)')) {
      gh(['pr', 'comment', String(number), '--repo', repo, '--body', `${review.body}\n\n_Updated._`]);
      console.log(JSON.stringify({ event: 'COMMENT', updated: true, requestChanges: review.requestChanges }));
      process.exit(review.requestChanges ? 2 : 0);
    }
  } catch {
    /* create new */
  }

  try {
    if (review.event === 'REQUEST_CHANGES' && !draft) {
      gh([
        'pr',
        'review',
        String(number),
        '--repo',
        repo,
        '--request-changes',
        '--body',
        review.body,
      ]);
    } else {
      gh(['pr', 'review', String(number), '--repo', repo, '--comment', '--body', review.body]);
    }
    console.log(JSON.stringify({ event: review.event, requestChanges: review.requestChanges }));
    process.exit(review.requestChanges ? 2 : 0);
  } catch (err) {
    console.warn('review failed, comment fallback', err.message);
    try {
      gh(['pr', 'comment', String(number), '--repo', repo, '--body', review.body]);
      process.exit(0);
    } catch (e2) {
      console.error(e2.message);
      console.log(review.body);
      process.exit(1);
    }
  }
}

if (process.argv[1]?.includes('pr-auto-review')) main();
