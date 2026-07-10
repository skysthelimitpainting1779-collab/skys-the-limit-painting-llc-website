#!/usr/bin/env node
/**
 * Enforce Conventional Commits style PR titles.
 * Exit 0 ok, 1 fail, 2 auto-fixed (when --fix and GH available).
 *
 * Usage:
 *   node scripts/pr-title-lint.mjs
 *   node scripts/pr-title-lint.mjs --fix   # attempt gh pr edit --title
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const CC =
  /^(feat|fix|chore|docs|infra|refactor|test|style|ci|build|perf|revert)(?:\([a-z0-9_.-]+\))?!?: .{1,100}$/i;

function loadTitle() {
  if (process.env.PR_TITLE) return process.env.PR_TITLE;
  if (process.env.GITHUB_EVENT_PATH && existsSync(process.env.GITHUB_EVENT_PATH)) {
    const e = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    return e.pull_request?.title || '';
  }
  return '';
}

function suggest(title) {
  const t = String(title || '').trim();
  if (CC.test(t)) return t;
  // "Feature: foo" → feat: foo
  const m = t.match(/^(feature|feat|fix|bugfix|bug|chore|docs|doc|infra|ci|test|wip)[:\s-]+(.+)$/i);
  if (m) {
    const map = {
      feature: 'feat',
      feat: 'feat',
      fix: 'fix',
      bugfix: 'fix',
      bug: 'fix',
      chore: 'chore',
      docs: 'docs',
      doc: 'docs',
      infra: 'infra',
      ci: 'ci',
      test: 'test',
      wip: 'chore',
    };
    const type = map[m[1].toLowerCase()] || 'chore';
    return `${type}: ${m[2].trim()}`;
  }
  if (!t) return 'chore: update';
  return `chore: ${t.replace(/^:+\s*/, '')}`;
}

function main() {
  const fix = process.argv.includes('--fix');
  const title = loadTitle();
  const ok = CC.test(title.trim());
  const suggested = suggest(title);

  const result = { ok, title, suggested, fixed: false };
  console.log(JSON.stringify(result, null, 2));

  if (ok) process.exit(0);

  if (fix && process.env.PR_NUMBER && process.env.GITHUB_REPOSITORY) {
    try {
      execFileSync(
        'gh',
        [
          'pr',
          'edit',
          String(process.env.PR_NUMBER),
          '--repo',
          process.env.GITHUB_REPOSITORY,
          '--title',
          suggested,
        ],
        { stdio: 'inherit', env: process.env }
      );
      console.log(JSON.stringify({ ...result, fixed: true, title: suggested }));
      process.exit(0);
    } catch (err) {
      console.error('Could not fix title:', err.message);
      process.exit(1);
    }
  }

  process.exit(1);
}

if (process.argv[1]?.includes('pr-title-lint')) main();
