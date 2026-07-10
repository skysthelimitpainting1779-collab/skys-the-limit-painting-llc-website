#!/usr/bin/env node
/**
 * Auto-commit agent/platform work with Conventional Commits so Entire hooks fire.
 *
 * Stages typical agent control-plane paths + any already-staged files, commits,
 * then runs Entire post-commit (checkpoint) and optional entire-to-agentos sync.
 *
 * Usage:
 *   node scripts/agent-auto-commit.mjs
 *   node scripts/agent-auto-commit.mjs "fix(seo): repair canonical tags"
 *   node scripts/agent-os.js auto-commit "chore(agent-os): sync control plane"
 */

import { execFileSync, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const DEFAULT_PATHS = [
  'src',
  'scripts',
  'tests',
  '.agents',
  '.learnings',
  '.entire',
  'package.json',
  'package-lock.json',
  'CLAUDE.md',
  'README.md',
  'context.md',
];

function entireBin() {
  if (process.env.ENTIRE_BIN && existsSync(process.env.ENTIRE_BIN)) return process.env.ENTIRE_BIN;
  const win = join(process.env.USERPROFILE || '', '.local', 'bin', 'entire.exe');
  if (existsSync(win)) return win;
  return 'entire';
}

function git(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function inferMessage() {
  try {
    const branch = git('git rev-parse --abbrev-ref HEAD');
    const m = branch.match(/^(feat|fix|chore|docs|infra|refactor|test|ci)\/(.+)$/i);
    if (m) {
      const type = m[1].toLowerCase();
      const scope = m[2].replace(/[-_]+/g, ' ').slice(0, 50);
      return `${type}: ${scope}`;
    }
  } catch {
    /* ignore */
  }
  return 'chore(agent-os): auto-commit agent platform work';
}

/**
 * @param {{ message?: string, paths?: string[], skipSync?: boolean }} [opts]
 */
export function agentAutoCommit(opts = {}) {
  const message = (opts.message && opts.message.trim()) || inferMessage();
  // Enforce conventional-ish first line
  const first = message.split('\n')[0];
  const okCc = /^(feat|fix|chore|docs|infra|refactor|test|style|ci|build)(\([a-z0-9_.-]+\))?!?: .+/i.test(
    first
  );
  const finalMsg = okCc
    ? message
    : `chore(agent-os): ${first}`;

  const paths = opts.paths || DEFAULT_PATHS;

  // Stage
  for (const p of paths) {
    if (!existsSync(join(ROOT, p))) continue;
    try {
      execSync(`git add -A -- "${p}"`, { cwd: ROOT, stdio: 'pipe' });
    } catch {
      /* ignore */
    }
  }

  let staged = '';
  try {
    staged = git('git diff --cached --name-only');
  } catch {
    staged = '';
  }
  if (!staged) {
    return { ok: false, reason: 'nothing staged' };
  }

  // Commit WITHOUT --no-verify so Entire prepare-commit-msg + commit-msg hooks run
  // (they attach Entire-Checkpoint trailer). Lint may fail — use AGENT_AUTO_COMMIT_NO_VERIFY=1 to bypass.
  const noVerify =
    process.env.AGENT_AUTO_COMMIT_NO_VERIFY === '1' || process.env.AGENT_AUTO_COMMIT_NO_VERIFY === 'true';

  try {
    const args = noVerify
      ? ['commit', '--no-verify', '-m', finalMsg]
      : ['commit', '-m', finalMsg];
    execFileSync('git', args, {
      cwd: ROOT,
      stdio: 'pipe',
      env: process.env,
    });
  } catch (err) {
    const stderr = err.stderr ? String(err.stderr) : err.message;
    // If lint blocked, optionally retry with no-verify when requested
    if (!noVerify && /lint|pre-commit/i.test(stderr)) {
      return {
        ok: false,
        reason: 'pre-commit hooks failed (lint). Fix lint or set AGENT_AUTO_COMMIT_NO_VERIFY=1',
        stderr: stderr.slice(0, 1500),
      };
    }
    return { ok: false, reason: 'commit failed', stderr: stderr.slice(0, 1500) };
  }

  // Ensure Entire post-commit runs (husky should already)
  try {
    execFileSync(entireBin(), ['hooks', 'git', 'post-commit'], {
      cwd: ROOT,
      stdio: 'ignore',
      windowsHide: true,
    });
  } catch {
    /* non-fatal */
  }

  let sync = null;
  if (!opts.skipSync) {
    try {
      // Dynamic import sync path via node CLI to avoid circular timing
      const out = execFileSync(process.execPath, ['scripts/entire-to-agentos.mjs'], {
        cwd: ROOT,
        encoding: 'utf8',
        env: { ...process.env, ENTIRE_SYNC_SKIP: '0' },
        windowsHide: true,
      });
      try {
        sync = JSON.parse(out);
      } catch {
        sync = { raw: out.slice(0, 500) };
      }
    } catch (err) {
      sync = { ok: false, error: err.message };
    }
  }

  let sha = '';
  try {
    sha = git('git rev-parse --short HEAD');
  } catch {
    /* ignore */
  }

  return {
    ok: true,
    sha,
    message: finalMsg,
    files: staged.split(/\r?\n/).filter(Boolean),
    entire_post_commit: true,
    entire_sync: sync,
  };
}

// CLI
if (process.argv[1] && process.argv[1].includes('agent-auto-commit')) {
  const msg = process.argv.slice(2).join(' ') || null;
  const result = agentAutoCommit({ message: msg || undefined });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}
