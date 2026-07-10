#!/usr/bin/env node
/**
 * Windows-safe Semgrep Guardian hook wrapper.
 * Soft-allows when Guardian is not logged in (avoids blocking all Write/Edit).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWin = process.platform === 'win32';
const exe = join(__dirname, 'hook-windows-amd64.exe');
const sh = join(__dirname, 'hook.sh');

function readStdin() {
  try {
    if (process.stdin.isTTY) return '{}';
    const s = readFileSync(0, 'utf8');
    return s && s.trim() ? s : '{}';
  } catch {
    return '{}';
  }
}

const args = process.argv.slice(2);
const stdin = readStdin();
const hookName = args[1] || '';

let cmd;
let cmdArgs;
if (isWin && existsSync(exe)) {
  cmd = exe;
  cmdArgs = args;
} else if (existsSync(sh)) {
  cmd = 'bash';
  if (isWin) {
    const gitBash = 'C:\\Program Files\\Git\\bin\\bash.exe';
    if (existsSync(gitBash)) cmd = gitBash;
  }
  cmdArgs = [sh, ...args];
} else {
  process.exit(0);
}

const r = spawnSync(cmd, cmdArgs, {
  input: stdin,
  encoding: 'utf8',
  windowsHide: true,
  env: process.env,
});

let out = (r.stdout || '').trim();
const err = (r.stderr || '').trim();

if (r.error || (r.status !== 0 && !out)) {
  if (process.env.HOOKS_VERBOSE === '1' && (err || r.error)) {
    console.error('[semgrep-hook-safe]', err || r.error?.message);
  }
  process.exit(0);
}

const notLoggedIn =
  /Not logged into Semgrep Guardian/i.test(out) ||
  /Not logged into Semgrep Guardian/i.test(err) ||
  /login failed/i.test(out);

if (notLoggedIn) {
  if (hookName === 'PreToolUse' || /PreToolUse/i.test(args.join(' '))) {
    if (process.env.SEMGREP_NUDGE_LOGIN === '1') {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            additionalContext:
              'Semgrep Guardian is not logged in — security scan skipped. Login via guardian MCP when you want blocking scans.',
          },
        }),
      );
    }
    process.exit(0);
  }
  process.exit(0);
}

if (out) process.stdout.write(out.endsWith('\n') ? out : out + '\n');
process.exit(0);
