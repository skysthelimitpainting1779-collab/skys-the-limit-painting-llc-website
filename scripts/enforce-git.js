#!/usr/bin/env node
/**
 * Git standards: branch prefixes + conventional commits.
 * Safe on Windows/CI (execFileSync; no shell % expansion).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PROTECTED = new Set(['main', 'staging']);
const ALLOWED_PREFIXES = [
  'feat/',
  'fix/',
  'chore/',
  'docs/',
  'infra/',
  'devin/',
  'agent/',
  'dependabot/',
];
const CC_RE =
  /^(feat|fix|chore|docs|infra|refactor|test|style|ci|build|perf|revert)(?:\([a-z0-9_.-]+\))?!?: .{1,200}/i;
const MERGE_RE = /^Merge (pull request|branch|remote-tracking branch)\b/i;
const REVERT_RE = /^Revert\b/i;

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  }).trim();
}

function getBranchName() {
  if (process.env.GITHUB_ACTIONS) {
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
      return process.env.GITHUB_HEAD_REF || '';
    }
    return process.env.GITHUB_REF_NAME || '';
  }
  return git(['rev-parse', '--abbrev-ref', 'HEAD']);
}

function getCommitMessagesToCheck() {
  const msgs = [];
  try {
    const head = git(['log', '-1', '--pretty=format:%B']);
    if (head) msgs.push(head);
  } catch {
    /* ignore */
  }
  if (process.env.GITHUB_EVENT_NAME === 'pull_request' && process.env.GITHUB_EVENT_PATH) {
    try {
      const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      const title = event?.pull_request?.title;
      if (title) msgs.push(String(title));
    } catch {
      /* ignore */
    }
  }
  return msgs;
}

function isCommitOk(msg) {
  const first = String(msg || '').trim().split(/\r?\n/)[0] || '';
  if (!first) return false;
  if (MERGE_RE.test(first) || REVERT_RE.test(first)) return true;
  if (CC_RE.test(first)) return true;
  if (/^chore\(deps\):/i.test(first) || /^Bump /i.test(first)) return true;
  return false;
}

console.log('[Git Guard] Running Git standards compliance check...');

try {
  const branchName = getBranchName();
  console.log(`[Git Guard] Branch: "${branchName}"`);

  if (!branchName) {
    console.warn('[Git Guard] Could not resolve branch name; skipping prefix check.');
  } else if (PROTECTED.has(branchName)) {
    console.log(
      `\x1b[33m[WARNING] On protected branch "${branchName}". Use feature branches + PRs.\x1b[0m`
    );
  } else if (branchName === 'HEAD') {
    console.log('[Git Guard] Detached HEAD — skipping prefix check.');
  } else {
    const ok = ALLOWED_PREFIXES.some((p) => branchName.startsWith(p));
    if (!ok) {
      console.error(`\x1b[31m[ERROR] Invalid branch name: "${branchName}".\x1b[0m`);
      console.error('[ERROR] Allowed prefixes:', ALLOWED_PREFIXES.join(' '));
      process.exit(1);
    }
    console.log('\x1b[32m[Git Guard] Branch name OK.\x1b[0m');
  }

  const messages = getCommitMessagesToCheck();
  if (messages.length === 0) {
    console.log('[Git Guard] No commit messages to validate.');
  } else {
    let anyOk = false;
    for (const msg of messages) {
      const first = msg.trim().split(/\r?\n/)[0];
      console.log(`[Git Guard] Checking: "${first}"`);
      if (isCommitOk(msg)) {
        anyOk = true;
        console.log('\x1b[32m[Git Guard] Commit message OK.\x1b[0m');
      }
    }
    if (!anyOk) {
      const strict =
        process.env.GIT_GUARD_STRICT === '1' || process.env.GIT_GUARD_STRICT === 'true';
      const text =
        'Commit message should follow Conventional Commits: type(scope): subject';
      if (strict) {
        console.error(`\x1b[31m[ERROR] ${text}\x1b[0m`);
        process.exit(1);
      } else {
        console.log(`\x1b[33m[WARNING] ${text}\x1b[0m`);
      }
    }
  }
} catch (err) {
  console.error('[Git Guard] Failed:', err.message);
  process.exit(1);
}
