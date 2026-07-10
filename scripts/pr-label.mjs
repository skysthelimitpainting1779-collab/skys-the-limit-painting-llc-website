#!/usr/bin/env node
/**
 * Apply path + size labels to a PR.
 *
 * Usage (CI):
 *   node scripts/pr-label.mjs
 *
 * Env: GH_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, GITHUB_BASE_REF, GITHUB_HEAD_REF
 *      or GITHUB_EVENT_PATH
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const PATH_LABELS = [
  { re: /^\.github\/workflows\//, labels: ['area:ci'] },
  { re: /^src\/app\/api\//, labels: ['area:api'] },
  { re: /^src\/(app|components|views)\//, labels: ['area:frontend'] },
  { re: /^src\/lib\/seo|src\/app\/.*metadata|public\/(robots|sitemap|llms)/, labels: ['area:seo'] },
  { re: /^supabase\//, labels: ['area:db'] },
  { re: /^scripts\//, labels: ['area:tooling'] },
  { re: /^\.agents\/|scripts\/agent-os|scripts\/learning|scripts\/entire/, labels: ['area:agent-os'] },
  { re: /^package(-lock)?\.json$/, labels: ['area:deps'] },
  { re: /^vercel\.json$|^\.vercel/, labels: ['area:vercel'] },
  { re: /\.(test|spec)\.(ts|tsx|mjs|js)$|^tests\//, labels: ['area:tests'] },
  { re: /^docs\/|\.md$/, labels: ['area:docs'] },
];

const SIZE = [
  { max: 10, label: 'size/XS' },
  { max: 30, label: 'size/S' },
  { max: 100, label: 'size/M' },
  { max: 300, label: 'size/L' },
  { max: Infinity, label: 'size/XL' },
];

const ALL_MANAGED = [
  ...new Set([
    ...PATH_LABELS.flatMap((p) => p.labels),
    ...SIZE.map((s) => s.label),
    'needs:branch-rename',
    'preview:ready',
    'preview:pending',
    'risk:high',
  ]),
];

function gh(args) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    env: process.env,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function loadPr() {
  if (process.env.GITHUB_EVENT_PATH && existsSync(process.env.GITHUB_EVENT_PATH)) {
    const e = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    if (e.pull_request) return e.pull_request;
  }
  return {
    number: Number(process.env.PR_NUMBER),
    base: { ref: process.env.GITHUB_BASE_REF || 'main' },
    head: { ref: process.env.GITHUB_HEAD_REF || '', sha: process.env.GITHUB_SHA },
  };
}

function changedFiles(base, head) {
  try {
    // Ensure base exists
    try {
      git(['fetch', 'origin', base, '--depth=1']);
    } catch {
      /* ignore */
    }
    const out = git(['diff', '--name-only', `origin/${base}...${head}`]);
    return out ? out.split(/\r?\n/).filter(Boolean) : [];
  } catch {
    try {
      return git(['diff', '--name-only', 'HEAD~1']).split(/\r?\n/).filter(Boolean);
    } catch {
      return [];
    }
  }
}

function sizeLabel(count) {
  for (const s of SIZE) {
    if (count <= s.max) return s.label;
  }
  return 'size/XL';
}

function ensureLabelsExist(repo, labels) {
  let existing = [];
  try {
    existing = JSON.parse(gh(['api', `repos/${repo}/labels?per_page=100`, '--jq', '[.[].name]']));
  } catch {
    existing = [];
  }
  const colors = {
    'size/XS': 'c2e0c6',
    'size/S': '0e8a16',
    'size/M': 'fbca04',
    'size/L': 'd93f0b',
    'size/XL': 'b60205',
    'area:ci': '5319e7',
    'area:api': '1d76db',
    'area:frontend': '0052cc',
    'area:seo': '006b75',
    'area:db': 'd4c5f9',
    'area:tooling': 'e99695',
    'area:agent-os': 'bfdadc',
    'area:deps': 'fef2c0',
    'area:vercel': '000000',
    'area:tests': 'bfd4f2',
    'area:docs': '0075ca',
    'needs:branch-rename': 'e11d48',
    'preview:ready': '0e8a16',
    'preview:pending': 'fbca04',
    'risk:high': 'b60205',
  };
  for (const name of labels) {
    if (existing.includes(name)) continue;
    try {
      gh([
        'api',
        '--method',
        'POST',
        `repos/${repo}/labels`,
        '-f',
        `name=${name}`,
        '-f',
        `color=${colors[name] || 'ededed'}`,
        '-f',
        `description=auto`,
      ]);
    } catch {
      /* race ok */
    }
  }
}

function main() {
  const repo = process.env.GITHUB_REPOSITORY;
  const pr = loadPr();
  const number = pr.number || Number(process.env.PR_NUMBER);
  if (!repo || !number) {
    console.error('Need GITHUB_REPOSITORY and PR number');
    process.exit(1);
  }

  const base = pr.base?.ref || 'main';
  const head = pr.head?.sha || 'HEAD';
  const files = changedFiles(base, head);

  const wanted = new Set();
  for (const f of files) {
    for (const rule of PATH_LABELS) {
      if (rule.re.test(f)) rule.labels.forEach((l) => wanted.add(l));
    }
  }
  wanted.add(sizeLabel(files.length));

  if (process.env.PREVIEW_READY === '1') {
    wanted.add('preview:ready');
  } else if (process.env.PREVIEW_PENDING === '1') {
    wanted.add('preview:pending');
  }
  if (process.env.NEEDS_BRANCH_RENAME === '1') {
    wanted.add('needs:branch-rename');
  }
  if (process.env.RISK_HIGH === '1') {
    wanted.add('risk:high');
  }

  ensureLabelsExist(repo, [...ALL_MANAGED]);

  // Remove managed labels not wanted, add wanted
  let current = [];
  try {
    current = JSON.parse(
      gh(['api', `repos/${repo}/issues/${number}/labels`, '--jq', '[.[].name]'])
    );
  } catch {
    current = [];
  }

  const toRemove = current.filter((l) => ALL_MANAGED.includes(l) && !wanted.has(l));
  for (const l of toRemove) {
    try {
      gh(['api', '--method', 'DELETE', `repos/${repo}/issues/${number}/labels/${encodeURIComponent(l)}`]);
    } catch {
      /* ignore */
    }
  }

  const toAdd = [...wanted].filter((l) => !current.includes(l));
  if (toAdd.length) {
    // add via pr edit
    try {
      gh(['pr', 'edit', String(number), '--repo', repo, '--add-label', toAdd.join(',')]);
    } catch {
      for (const l of toAdd) {
        try {
          gh([
            'api',
            '--method',
            'POST',
            `repos/${repo}/issues/${number}/labels`,
            '-f',
            `labels[]=${l}`,
          ]);
        } catch {
          /* ignore */
        }
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        files: files.length,
        labels: [...wanted],
        added: toAdd,
        removed: toRemove,
      },
      null,
      2
    )
  );
}

if (process.argv[1]?.includes('pr-label')) main();
