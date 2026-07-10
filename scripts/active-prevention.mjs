#!/usr/bin/env node
/**
 * Active prevention — turn recorded lessons into agent context + hard blocks.
 *
 * Logging alone does not stop repeats. This module:
 *   1. inject  — compact cold-start context from ERRORS_INDEX / index.json / ROOT_CAUSE
 *   2. check   — PreToolUse evaluation: deny known-bad patterns, else advise
 *   3. rebuild — write .learnings/ACTIVE_CONTEXT.md (token-cheap SSOT for inject)
 *
 * CLI:
 *   node scripts/active-prevention.mjs inject
 *   node scripts/active-prevention.mjs rebuild
 *   node scripts/active-prevention.mjs check   # stdin tool payload JSON
 *   node scripts/active-prevention.mjs self-test
 *
 * Env:
 *   ACTIVE_PREVENTION_SKIP=1   no-op check (still can inject)
 *   ACTIVE_PREVENTION_SOFT=1   never deny — advise only
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const LEARNINGS = join(ROOT, '.learnings');
const INDEX_JSON = join(LEARNINGS, 'index.json');
const ERRORS_INDEX = join(LEARNINGS, 'ERRORS_INDEX.md');
const ACTIVE_CONTEXT = join(LEARNINGS, 'ACTIVE_CONTEXT.md');
const ROOT_CAUSE = join(ROOT, '.agents', 'governance', 'ROOT_CAUSE.md');
const PREVENTION = join(ROOT, '.agents', 'governance', 'PREVENTION_RULES.md');

const MAX_LESSONS = Number(process.env.ACTIVE_PREVENTION_MAX_LESSONS || 8);
const MAX_CONTEXT_CHARS = Number(process.env.ACTIVE_PREVENTION_MAX_CHARS || 3500);

// ---------------------------------------------------------------------------
// Load lessons
// ---------------------------------------------------------------------------

function readJson(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function isSynthetic(title = '') {
  return /synthetic|dedupe-test/i.test(String(title));
}

/**
 * Real lessons only, most recent / highest count first.
 * @returns {Array<{id:string,title:string,category:string,status:string,count:number,prevention:string,command?:string,snippet?:string}>}
 */
export function loadLessons() {
  const idx = readJson(INDEX_JSON);
  const incidents = Object.values(idx?.incidents || {});
  return incidents
    .filter((i) => i && !isSynthetic(i.title))
    .sort((a, b) => {
      const t = String(b.last_seen || b.first_seen || '').localeCompare(
        String(a.last_seen || a.first_seen || '')
      );
      if (t !== 0) return t;
      return (b.count || 1) - (a.count || 1);
    })
    .map((i) => ({
      id: i.id,
      title: i.title || '',
      category: i.category || 'general',
      status: i.status || 'open',
      count: i.count || 1,
      prevention: String(i.prevention || '').trim(),
      command: i.command || '',
      snippet: i.snippet || '',
    }));
}

function truncate(s, n) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n - 1)}…`;
}

// ---------------------------------------------------------------------------
// Hard guards (machine-enforceable known-bad patterns from real incidents)
// ---------------------------------------------------------------------------

function collectText(input = {}) {
  return [
    input.command,
    input.new_string,
    input.new_str,
    input.newString,
    input.content,
    input.contents,
    input.old_string,
    input.old_str,
    input.oldString,
    input.patch,
    input.diff,
    typeof input === 'string' ? input : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function filePathFromInput(input = {}) {
  return String(
    input.file_path ||
      input.filePath ||
      input.path ||
      input.target_file ||
      input.targetFile ||
      ''
  ).replace(/\\/g, '/');
}

/**
 * @typedef {{ id: string, name: string, severity: 'deny'|'advise', match: (ctx) => boolean, reason: (ctx) => string }} Guard
 */

/** @type {Guard[]} */
export const HARD_GUARDS = [
  {
    id: 'ERR-20260709-2e26',
    name: 'next-dynamic-ssr-false',
    severity: 'deny',
    match({ tool, text, path }) {
      if (!/Write|Edit|MultiEdit|StrReplace|search_replace|NotebookEdit|ApplyPatch/i.test(tool)) {
        return false;
      }
      if (path && !/\.(tsx?|jsx?|mjs|cjs)$/i.test(path)) return false;
      // next/dynamic + ssr:false in same edit
      const hasDynamic =
        /from\s+['"]next\/dynamic['"]/.test(text) ||
        /require\(\s*['"]next\/dynamic['"]\s*\)/.test(text) ||
        /dynamic\s*\(/.test(text);
      const hasSsrFalse = /ssr\s*:\s*false/.test(text);
      return hasDynamic && hasSsrFalse;
    },
    reason() {
      return (
        'BLOCKED by active prevention (ERR-20260709-2e26 / nextjs-render): ' +
        'Never use next/dynamic with { ssr: false } inside Server Components. ' +
        'Import client leaves statically when browser work is already behind useEffect. ' +
        'See .learnings/ERRORS_INDEX.md'
      );
    },
  },
  {
    id: 'ERR-20260709-070a',
    name: 'powershell-command-misuse',
    severity: 'deny',
    match({ tool, text }) {
      if (!/Bash|Shell|Terminal|run_terminal|run_shell|Execute/i.test(tool)) return false;
      const cmd = text;
      if (!/powershell(\.exe)?(\s+|-)/i.test(cmd)) return false;
      // Nested powershell invocations
      if ((cmd.match(/\bpowershell(\.exe)?\b/gi) || []).length >= 2) return true;
      // Em/en dash in -Command (PS parse failures on this machine)
      if (/powershell[\s\S]{0,40}(-Command|-c)\b/i.test(cmd) && /[—–]/.test(cmd)) return true;
      // SwitchParameter / CaseSensitive string assignment footgun
      if (/CaseSensitive\s+['"`]|SwitchParameter/i.test(cmd)) return true;
      // Multi-statement -Command soup without a .ps1 file (common failure mode)
      if (
        /powershell(\.exe)?\s+(-NoProfile\s+)?(-ExecutionPolicy\s+\S+\s+)?(-Command|-c)\s+/i.test(
          cmd
        ) &&
        /;.*(Select-String|Get-Content|Set-Content|Out-File)/i.test(cmd) &&
        cmd.length > 180
      ) {
        return true;
      }
      return false;
    },
    reason() {
      return (
        'BLOCKED by active prevention (ERR-20260709-070a / shell-powershell): ' +
        'On Windows prefer `node scripts/...` or a .ps1 file over nested powershell -Command. ' +
        'Never assign values to switch parameters; escape $ as `$ inside double-quoted -Command. ' +
        'See .learnings/ERRORS_INDEX.md'
      );
    },
  },
  {
    id: 'ERR-20260710-28e9',
    name: 'system32-bash-as-fix',
    severity: 'deny',
    match({ tool, text, path }) {
      // Claiming "fixed bash" by hardcoding System32 or soft-skipping wrong bash
      const blob = `${path}\n${text}`;
      if (/C:\\\\Windows\\\\System32\\\\bash\.exe|C:\/Windows\/System32\/bash\.exe/i.test(blob)) {
        if (/fix|path|hook|wrapper/i.test(blob)) return true;
      }
      // Soft-skip "bash not found" as the only fix inside hooks (symptom treatment)
      if (
        /hooks|semgrep|remember|run-bash/i.test(path || text) &&
        /exit\s+0/.test(text) &&
        /(bash not found|command not found|which bash|WSL)/i.test(text) &&
        !/Git[\\/]bin|fix-windows-bash-path|ROOT_CAUSE|Machine PATH/i.test(text)
      ) {
        return true;
      }
      return false;
    },
    reason() {
      return (
        'BLOCKED by active prevention (ERR-20260710-28e9 + ROOT_CAUSE): ' +
        'Do not soft-skip wrong bash or hardcode System32 bash. ' +
        'ROOT FIX: Admin `npm run hooks:fix-bash-path` (prepend Git\\bin to Machine PATH). ' +
        'VERIFY: where bash → Git\\bin first. Policy: .agents/governance/ROOT_CAUSE.md'
      );
    },
  },
  {
    id: 'LAW-12',
    name: 'symptom-only-always-exit-zero-hook',
    severity: 'advise',
    match({ tool, text, path }) {
      if (!/Write|Edit|MultiEdit|StrReplace|search_replace/i.test(tool)) return false;
      if (!/hooks|hook/i.test(path || '')) return false;
      // Always-exit-0 pattern without root-cause comment
      return (
        /process\.exit\(0\)|exit\s+0/.test(text) &&
        /catch\s*\([^)]*\)\s*\{[^}]{0,80}\}/s.test(text) &&
        !/ROOT_CAUSE|defense-in-depth|after PATH/i.test(text)
      );
    },
    reason() {
      return (
        'ADVISE (iron law 12 / ROOT_CAUSE): hook soft-exits look like symptom treatment. ' +
        'Fix the underlying mechanism first; wrappers only after root fix is verified.'
      );
    },
  },
  {
    id: 'ERR-20260710-87d7',
    name: 'disable-semgrep-permanently',
    severity: 'advise',
    match({ tool, text, path }) {
      const hay = `${tool} ${path} ${text}`;
      if (!/semgrep|guardian/i.test(hay)) return false;
      if (!/Write|Edit|MultiEdit|StrReplace|settings/i.test(tool + path)) return false;
      return /(disable|remove|uninstall|comment\s*out).{0,60}(semgrep|guardian)/i.test(text);
    },
    reason() {
      return (
        'ADVISE (ERR-20260710-87d7): Semgrep Guardian blocks Write when not logged in. ' +
        'Log into guardian MCP for real scans, or make a product decision — do not silently leave permanent disable.'
      );
    },
  },
];

/**
 * Evaluate a tool call against hard guards + optional lesson-derived advice.
 * @returns {{ decision: 'deny'|null, reasons: string[], context: string|null, matched: string[] }}
 */
export function evaluateToolUse(toolName, toolInput = {}) {
  if (process.env.ACTIVE_PREVENTION_SKIP === '1') {
    return { decision: null, reasons: [], context: null, matched: [] };
  }

  const tool = String(toolName || '');
  const input = toolInput && typeof toolInput === 'object' ? toolInput : {};
  const text = collectText(input);
  const path = filePathFromInput(input);
  const ctx = { tool, input, text, path };

  const soft = process.env.ACTIVE_PREVENTION_SOFT === '1';
  const denyReasons = [];
  const adviseReasons = [];
  const matched = [];

  for (const g of HARD_GUARDS) {
    try {
      if (!g.match(ctx)) continue;
    } catch {
      continue;
    }
    matched.push(g.name);
    const r = g.reason(ctx);
    if (g.severity === 'deny' && !soft) denyReasons.push(r);
    else adviseReasons.push(r);
  }

  // Lesson-derived soft advice: if command/snippet overlaps open or high-signal lessons
  const lessons = loadLessons().slice(0, MAX_LESSONS);
  for (const L of lessons) {
    if (!L.prevention) continue;
    const needles = [L.command, L.snippet, L.title]
      .filter(Boolean)
      .map((s) => String(s).slice(0, 40).toLowerCase());
    const hay = `${tool} ${path} ${text}`.toLowerCase();
    const hit = needles.some((n) => n.length >= 8 && hay.includes(n.toLowerCase()));
    if (hit) {
      matched.push(L.id);
      adviseReasons.push(`[${L.id}] ${truncate(L.prevention, 220)}`);
    }
  }

  const decision = denyReasons.length ? 'deny' : null;
  const reasons = decision === 'deny' ? denyReasons : adviseReasons;
  const context =
    adviseReasons.length || denyReasons.length
      ? [...denyReasons, ...adviseReasons].slice(0, 4).join('\n')
      : null;

  return { decision, reasons, context, matched };
}

// ---------------------------------------------------------------------------
// Inject / rebuild ACTIVE_CONTEXT
// ---------------------------------------------------------------------------

export function buildActiveContextMarkdown() {
  const lessons = loadLessons().slice(0, MAX_LESSONS);
  const lines = [
    '---',
    'type: ledger',
    'title: Active prevention context',
    'description: Token-cheap inject for agents. Generated — do not hand-edit.',
    'tags: [prevention, active, cold-start]',
    '---',
    '',
    '# Active prevention context',
    '',
    `> Generated: ${new Date().toISOString()}`,
    '> **This is not a log.** Agents must OBEY these lessons. Hooks may DENY tool calls that repeat them.',
    '',
    '## Iron laws (always)',
    '',
    '1. **Root cause only** — never soft-skip, `|| true`, or disable checks as the fix (`.agents/governance/ROOT_CAUSE.md`).',
    '2. **Windows bash** — Git\\bin before System32; fix: `npm run hooks:fix-bash-path`; verify `where bash`.',
    '3. **PowerShell** — prefer `node scripts/...` or `.ps1`; no nested `powershell -Command` soup.',
    '4. **Next.js** — never `next/dynamic` + `{ ssr: false }` in Server Components.',
    '5. **Learn → enforce** — after a failure: record, then hard-guard if machine-detectable.',
    '',
    '## Top lessons (obey)',
    '',
  ];

  if (!lessons.length) {
    lines.push('_No non-synthetic lessons in `.learnings/index.json` yet._', '');
  } else {
    lines.push('| ID | Status | Lesson |', '|----|--------|--------|');
    for (const L of lessons) {
      const lesson = truncate(L.prevention || L.title, 140);
      lines.push(`| ${L.id} | ${L.status} | ${lesson} |`);
    }
    lines.push('');
  }

  lines.push(
    '## Hard-blocked patterns (PreToolUse)',
    '',
    '- `next/dynamic` + `ssr: false` in TS/JS edits → **deny**',
    '- Nested / broken `powershell -Command` → **deny**',
    '- System32-bash soft-skip “fixes” in hooks → **deny**',
    '',
    '## Commands',
    '',
    '```bash',
    'npm run learn:prevent          # print inject text',
    'npm run learn:prevent:rebuild  # refresh this file',
    'node scripts/active-prevention.mjs check < payload.json',
    '```',
    ''
  );

  // Keep under budget
  let out = lines.join('\n');
  if (out.length > MAX_CONTEXT_CHARS) {
    out = `${out.slice(0, MAX_CONTEXT_CHARS - 20)}\n\n…(truncated)\n`;
  }
  return out;
}

export function rebuildActiveContext() {
  mkdirSync(LEARNINGS, { recursive: true });
  const md = buildActiveContextMarkdown();
  writeFileSync(ACTIVE_CONTEXT, md, 'utf8');
  return { path: ACTIVE_CONTEXT, bytes: Buffer.byteLength(md, 'utf8') };
}

/**
 * Compact inject string for SessionStart / UserPromptSubmit additionalContext.
 */
export function buildInjectText() {
  // Prefer generated ACTIVE_CONTEXT; rebuild if missing/stale > 24h optional always rebuild cheap
  if (!existsSync(ACTIVE_CONTEXT)) {
    try {
      rebuildActiveContext();
    } catch {
      /* fall through */
    }
  }

  const parts = [];
  parts.push(
    'ACTIVE PREVENTION (mandatory — not optional reading): ' +
      'Do not repeat recorded failures. PreToolUse hooks DENY known-bad patterns. ' +
      'Policy: iron law 12 ROOT_CAUSE + iron law 14 active prevention.'
  );

  if (existsSync(ACTIVE_CONTEXT)) {
    try {
      const body = readFileSync(ACTIVE_CONTEXT, 'utf8')
        .replace(/^---[\s\S]*?---\s*/m, '')
        .replace(/^#.*$/m, '')
        .trim();
      parts.push(truncate(body.replace(/\n+/g, ' · '), MAX_CONTEXT_CHARS - 400));
    } catch {
      /* ignore */
    }
  } else if (existsSync(ERRORS_INDEX)) {
    try {
      const idx = readFileSync(ERRORS_INDEX, 'utf8');
      const table = idx.match(/## Top lessons[\s\S]*?(?=\n## |$)/);
      if (table) parts.push(truncate(table[0].replace(/\n+/g, ' '), 1200));
    } catch {
      /* ignore */
    }
  }

  const lessons = loadLessons().slice(0, 5);
  if (lessons.length) {
    parts.push(
      'OBEY NOW: ' +
        lessons
          .map((L) => `${L.id}: ${truncate(L.prevention || L.title, 100)}`)
          .join(' | ')
    );
  }

  let out = parts.join('\n\n');
  if (out.length > MAX_CONTEXT_CHARS) out = out.slice(0, MAX_CONTEXT_CHARS - 1) + '…';
  return out;
}

/**
 * Claude SessionStart / UserPromptSubmit JSON envelope.
 */
export function sessionInjectHookOutput(hookEventName = 'SessionStart') {
  const additionalContext = buildInjectText();
  return {
    hookSpecificOutput: {
      hookEventName,
      additionalContext,
    },
    systemMessage: `\n[active-prevention] ${truncate(additionalContext, 280)}\n`,
  };
}

/**
 * Claude PreToolUse JSON envelope from evaluateToolUse.
 */
export function preToolHookOutput(toolName, toolInput) {
  const result = evaluateToolUse(toolName, toolInput);
  if (!result.decision && !result.context) return null;

  const out = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
    },
  };

  if (result.decision === 'deny') {
    out.hookSpecificOutput.permissionDecision = 'deny';
    out.hookSpecificOutput.permissionDecisionReason = result.reasons.join(' ');
    // Still attach context so model learns why
    out.hookSpecificOutput.additionalContext = result.context || result.reasons.join('\n');
  } else if (result.context) {
    out.hookSpecificOutput.additionalContext = result.context;
  }

  if (result.decision === 'deny') {
    out.systemMessage = `\n[active-prevention DENY] ${truncate(result.reasons[0] || '', 300)}\n`;
  }

  return out;
}

// ---------------------------------------------------------------------------
// Self-test + CLI
// ---------------------------------------------------------------------------

export function selfTest() {
  const cases = [
    {
      name: 'blocks next/dynamic ssr:false',
      tool: 'Write',
      input: {
        file_path: 'src/app/page.tsx',
        content: `import dynamic from 'next/dynamic';\nconst X = dynamic(() => import('./x'), { ssr: false });\n`,
      },
      expectDeny: true,
    },
    {
      name: 'allows normal write',
      tool: 'Write',
      input: { file_path: 'src/app/page.tsx', content: 'export default function Page(){return null}' },
      expectDeny: false,
    },
    {
      name: 'blocks nested powershell',
      tool: 'Bash',
      input: {
        command:
          'powershell -Command "powershell -Command Select-String -Path a -Pattern b -CaseSensitive \'true\'"',
      },
      expectDeny: true,
    },
    {
      name: 'allows node script',
      tool: 'Bash',
      input: { command: 'node scripts/learning-loop.mjs status' },
      expectDeny: false,
    },
  ];

  const results = [];
  for (const c of cases) {
    const r = evaluateToolUse(c.tool, c.input);
    const denied = r.decision === 'deny';
    const ok = denied === c.expectDeny;
    results.push({ name: c.name, ok, denied, matched: r.matched });
  }
  return results;
}

function main() {
  const cmd = process.argv[2] || 'inject';

  if (cmd === 'inject') {
    process.stdout.write(buildInjectText() + '\n');
    return;
  }
  if (cmd === 'rebuild') {
    const r = rebuildActiveContext();
    console.log(JSON.stringify({ ok: true, ...r }, null, 2));
    return;
  }
  if (cmd === 'check') {
    let raw = '';
    try {
      if (!process.stdin.isTTY) raw = readFileSync(0, 'utf8');
    } catch {
      raw = '';
    }
    let payload = {};
    try {
      payload = raw.trim() ? JSON.parse(raw) : {};
    } catch {
      payload = {};
    }
    const tool = payload.tool_name || payload.toolName || payload.name || '';
    const input = payload.tool_input || payload.toolInput || payload.input || {};
    const out = preToolHookOutput(tool, input);
    if (out) process.stdout.write(JSON.stringify(out, null, 2) + '\n');
    else process.stdout.write(JSON.stringify({ ok: true, decision: null }) + '\n');
    process.exitCode = out?.hookSpecificOutput?.permissionDecision === 'deny' ? 2 : 0;
    // Note: Claude uses JSON deny; exit 2 also blocks — we prefer JSON and exit 0 for hosts that only read stdout
    process.exitCode = 0;
    return;
  }
  if (cmd === 'self-test') {
    const results = selfTest();
    const failed = results.filter((r) => !r.ok);
    console.log(JSON.stringify({ ok: failed.length === 0, results }, null, 2));
    process.exitCode = failed.length ? 1 : 0;
    return;
  }
  if (cmd === 'hook-session-start') {
    process.stdout.write(JSON.stringify(sessionInjectHookOutput('SessionStart')));
    return;
  }
  if (cmd === 'hook-user-prompt') {
    process.stdout.write(JSON.stringify(sessionInjectHookOutput('UserPromptSubmit')));
    return;
  }

  console.error(
    'Usage: active-prevention.mjs <inject|rebuild|check|self-test|hook-session-start|hook-user-prompt>'
  );
  process.exitCode = 1;
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('active-prevention.mjs') ||
    process.argv[1].includes('active-prevention'));

if (isMain) main();
