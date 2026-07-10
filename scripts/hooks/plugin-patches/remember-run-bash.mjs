#!/usr/bin/env node
/**
 * Resolve a real bash for Remember hooks on Windows.
 * Avoids C:\Windows\System32\bash.exe (WSL launcher) which fails without WSL.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = process.argv[2];
if (!script) process.exit(0);

const candidates = [
  process.env.GIT_BASH,
  process.env.REMEMBER_BASH,
  'C:\\Program Files\\Git\\bin\\bash.exe',
  'C:\\Program Files\\Git\\usr\\bin\\bash.exe',
  'C:\\Program Files (x86)\\Git\\bin\\bash.exe',
  // last: PATH bash only if not System32 WSL stub
];

function isWslStub(p) {
  if (!p) return true;
  const n = p.replace(/\//g, '\\').toLowerCase();
  return n.includes('\\system32\\bash.exe') || n.includes('\\syswow64\\bash.exe');
}

let bash = candidates.find((p) => p && existsSync(p));
if (!bash) {
  const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['bash'], {
    encoding: 'utf8',
    windowsHide: true,
  });
  const first = (which.stdout || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
  if (first && !isWslStub(first) && existsSync(first)) bash = first;
}

if (!bash) {
  // Soft-fail: Remember is optional memory — never block the agent
  if (process.env.HOOKS_VERBOSE === '1') {
    console.error('[remember] no Git Bash found; hook skipped');
  }
  process.exit(0);
}

const r = spawnSync(bash, [script, ...process.argv.slice(3)], {
  stdio: 'inherit',
  env: process.env,
  windowsHide: true,
});

// Soft-fail on non-zero (plugin contract: hooks should not block)
process.exit(r.status === 0 ? 0 : 0);
