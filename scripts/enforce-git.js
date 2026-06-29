import { execSync } from 'node:child_process';

console.log('[Git Guard] Running Git standards compliance check...');

try {
  // 1. Validate branch name
  let branchName = '';
  if (process.env.GITHUB_ACTIONS) {
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
      branchName = process.env.GITHUB_HEAD_REF || '';
    } else {
      branchName = process.env.GITHUB_REF_NAME || '';
    }
    console.log(`[Git Guard] Running in CI. Detected branch: "${branchName}"`);
  } else {
    branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    console.log(`[Git Guard] Current branch: "${branchName}"`);
  }
  
  const protectedBranches = ['main', 'staging'];
  const allowedPrefixes = ['feat/', 'fix/', 'chore/', 'docs/', 'infra/', 'devin/', 'agent/'];
  
  if (protectedBranches.includes(branchName)) {
    console.log(`\x1b[33m[WARNING] You are working directly on a protected branch: "${branchName}".\x1b[0m`);
    console.log('\x1b[33m[WARNING] Please ensure you do not commit directly to this branch. Use feature branches and PRs.\x1b[0m');
  } else {
    const isValidPrefix = allowedPrefixes.some(prefix => branchName.startsWith(prefix));
    if (!isValidPrefix) {
      console.error(`\x1b[31m[ERROR] Invalid branch name: "${branchName}".\x1b[0m`);
      console.error(`\x1b[31m[ERROR] Branch names must start with one of the following prefixes:\x1b[0m`);
      allowedPrefixes.forEach(prefix => console.error(`  - ${prefix}`));
      process.exit(1);
    }
    console.log('\x1b[32m[Git Guard] Branch name complies with standards.\x1b[0m');
  }
  
  // 2. Validate the last commit message if available (to check message format)
  try {
    const lastCommitMsg = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
    console.log(`[Git Guard] Last commit message: "${lastCommitMsg.split('\n')[0]}"`);
    
    // Conventional commit regex
    const ccRegex = /^(feat|fix|chore|docs|infra|refactor|test|style|ci|build)(?:\([a-z0-9_.-]+\))?!?: .+/i;
    
    if (!ccRegex.test(lastCommitMsg)) {
      console.log(`\x1b[33m[WARNING] Last commit message does not strictly follow Conventional Commits format.\x1b[0m`);
      console.log('\x1b[33m[WARNING] Standard format: <type>(<scope>): <subject> (e.g. feat(seo): add meta tags)\x1b[0m');
    } else {
      console.log('\x1b[32m[Git Guard] Commit message format complies with standards.\x1b[0m');
    }
  } catch (err) {
    console.log('[Git Guard] Could not retrieve last commit message for validation.', err.message);
  }
  
} catch (err) {
  console.error('[Git Guard] Failed to execute git checks. Make sure Git is installed and you are in a repository.', err.message);
  process.exit(1);
}
