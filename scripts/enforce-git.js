#!/usr/bin/env node
/**
 * enforce-git.js
 * Enforces branch naming and protected branch policies during lint.
 * Compliant with project guidelines: no direct commits to main/staging.
 * Safe in CI (skips strict checks).
 */
import { execSync } from 'child_process';

const isCI = !!(process.env.CI || process.env.GITHUB_ACTIONS || process.env.VERCEL);

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getCommitMessage() {
  try {
    return execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const branch = getCurrentBranch();
const commitMsg = getCommitMessage();

const protectedBranches = ['main', 'master', 'staging', 'develop'];

console.log(`[enforce-git] Branch: ${branch || 'unknown'} | CI: ${isCI}`);

if (!branch) {
  console.warn('[enforce-git] Unable to determine branch (non-git env or shallow checkout). Allowing.');
  process.exit(0);
}

if (isCI) {
  // In CI/PR we allow because PRs come from feature branches. Only gate direct pushes on protected in release flows.
  if (protectedBranches.includes(branch) && process.env.GITHUB_EVENT_NAME === 'push') {
    // On direct push to protected in CI (should be disallowed by branch protection), still warn but do not hard fail the build here.
    console.warn(`[enforce-git] WARNING: CI push detected directly to protected branch '${branch}'. Rely on branch protection rules.`);
  }
  console.log('[enforce-git] CI context - branch policy checks delegated to GitHub branch protection + PR rules.');
  process.exit(0);
}

// Local enforcement
if (protectedBranches.includes(branch)) {
  console.error(`\n[enforce-git] ERROR: Direct development on protected branch '${branch}' is prohibited.`);
  console.error('Create a feature branch using one of the allowed prefixes:');
  console.error('  feat/<desc> | fix/<desc> | chore/<desc> | docs/<desc> | infra/<desc>');
  console.error('Then commit and open a PR to staging or main.\n');
  process.exit(1);
}

// Optional: basic conventional commit check (non-fatal for flexibility, but log)
const conventional = /^(feat|fix|chore|docs|infra|test|refactor|perf|style|ci|build)(\(.+\))?: .+/;
if (commitMsg && !conventional.test(commitMsg.split('\n')[0])) {
  console.warn('[enforce-git] Warning: Last commit message does not follow Conventional Commits.');
  console.warn('Expected format: type(scope): subject  e.g. feat(seo): add meta tags');
}

console.log('[enforce-git] Branch and commit policy OK.');
process.exit(0);
