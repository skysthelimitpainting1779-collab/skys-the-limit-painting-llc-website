#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(
  readFileSync(resolve(root, '.agents/governance/development-lifecycle.json'), 'utf8')
);
const remoteName = process.argv[2] || '';
const expectedRemoteRef = `refs/heads/${config.integrationBranch}`;
const zeroSha = '0'.repeat(40);
const input = readFileSync(0, 'utf8').trim();
const errors = [];

if (remoteName !== 'origin') {
  errors.push(`governed pushes must use origin, not ${remoteName || '<missing>'}`);
}
if (!input) {
  errors.push('pre-push did not receive any ref updates');
}

const head = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
  windowsHide: true,
}).trim();

for (const [index, line] of input.split(/\r?\n/).filter(Boolean).entries()) {
  const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
  if (!localRef || !localSha || !remoteRef || !remoteSha) {
    errors.push(`push update ${index + 1} is malformed`);
    continue;
  }
  if (remoteRef !== expectedRemoteRef) {
    errors.push(
      `push update ${index + 1} targets ${remoteRef}; use HEAD:${config.integrationBranch}`
    );
  }
  if (localSha === zeroSha) {
    errors.push(`push update ${index + 1} attempts to delete ${remoteRef}`);
    continue;
  }
  if (localSha !== head) {
    errors.push(`push update ${index + 1} is not the checked-out HEAD`);
  }
  if (remoteSha !== zeroSha) {
    try {
      execFileSync('git', ['merge-base', '--is-ancestor', remoteSha, localSha], {
        cwd: root,
        stdio: 'ignore',
        windowsHide: true,
      });
    } catch {
      errors.push(`push update ${index + 1} is not a fast-forward`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `[Push Target] ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`[Push Target] OK: origin HEAD:${config.integrationBranch}`);
}
