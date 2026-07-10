#!/usr/bin/env node
/**
 * Upsert a single sticky PR comment identified by an HTML marker.
 *
 * Usage:
 *   node scripts/pr-sticky-comment.mjs --marker "agent-os-dashboard" --body-file /tmp/body.md
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function parseArgs(argv) {
  const out = { marker: 'agent-os', body: '', bodyFile: '' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--marker') out.marker = argv[++i] || out.marker;
    else if (argv[i] === '--body') out.body = argv[++i] || '';
    else if (argv[i] === '--body-file') out.bodyFile = argv[++i] || '';
  }
  return out;
}

function ghJson(args) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    env: process.env,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const repo = process.env.GITHUB_REPOSITORY;
  const pr = process.env.PR_NUMBER || process.env.GITHUB_PR_NUMBER;
  if (!repo || !pr) {
    console.error('Need GITHUB_REPOSITORY and PR_NUMBER');
    process.exit(1);
  }
  let body = opts.body;
  if (opts.bodyFile) body = readFileSync(opts.bodyFile, 'utf8');
  if (!body.trim()) {
    console.error('Empty body');
    process.exit(1);
  }

  const marker = `<!-- sticky:${opts.marker} -->`;
  const full = `${marker}\n${body.trim()}\n`;
  const dir = mkdtempSync(join(tmpdir(), 'sticky-'));
  const file = join(dir, 'body.md');
  writeFileSync(file, full, 'utf8');

  let comments = [];
  try {
    const raw = ghJson([
      'api',
      `repos/${repo}/issues/${pr}/comments?per_page=100`,
    ]);
    comments = JSON.parse(raw);
  } catch (err) {
    console.error('list comments failed', err.message);
    process.exit(1);
  }

  const existing = comments.find(
    (c) => typeof c.body === 'string' && c.body.includes(marker)
  );

  try {
    if (existing) {
      execFileSync(
        'gh',
        [
          'api',
          '--method',
          'PATCH',
          `repos/${repo}/issues/comments/${existing.id}`,
          '-F',
          `body=@${file}`,
        ],
        { stdio: 'inherit', env: process.env }
      );
      console.log(JSON.stringify({ updated: true, id: existing.id, marker: opts.marker }));
    } else {
      execFileSync(
        'gh',
        [
          'api',
          '--method',
          'POST',
          `repos/${repo}/issues/${pr}/comments`,
          '-F',
          `body=@${file}`,
        ],
        { stdio: 'inherit', env: process.env }
      );
      console.log(JSON.stringify({ created: true, marker: opts.marker }));
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

if (process.argv[1]?.includes('pr-sticky-comment')) main();
