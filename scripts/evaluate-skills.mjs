#!/usr/bin/env node
/**
 * Skill quality evaluator — gate garbage out of the skill catalog.
 *
 * Deterministic scoring (no LLM). Verdicts:
 *   pass       — keep; reusable agent skill
 *   warn       — keep but flag; thin or template-heavy
 *   quarantine — move out of active load path (garbage / one-off)
 *   reject     — hard fail; same as quarantine unless --purge
 *
 * Usage:
 *   node scripts/evaluate-skills.mjs
 *   node scripts/evaluate-skills.mjs --dry-run
 *   node scripts/evaluate-skills.mjs --apply
 *   node scripts/evaluate-skills.mjs --apply --purge
 *   node scripts/evaluate-skills.mjs --dir .agents/skills/from-entire
 *   node scripts/evaluate-skills.mjs --slug chore-deps-deps-bump-next-from-16-2-9-to-16-2-10
 *
 * Thresholds (env override):
 *   SKILL_EVAL_PASS_MIN=70
 *   SKILL_EVAL_WARN_MIN=45
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  renameSync,
  rmSync,
  cpSync,
} from 'node:fs';
import { join, dirname, basename } from 'node:path';

const ROOT = process.cwd();
const DEFAULT_DIR = join(ROOT, '.agents', 'skills', 'from-entire');
const EVAL_DIR_NAME = '_evaluation';
const QUARANTINE_DIR_NAME = '_quarantine';
const SKIP_DIRS = new Set([
  '_evolution',
  '_evaluation',
  '_quarantine',
  'node_modules',
]);

const PASS_MIN = Number(process.env.SKILL_EVAL_PASS_MIN || 70);
const WARN_MIN = Number(process.env.SKILL_EVAL_WARN_MIN || 45);

/** Boilerplate strings from entire-to-agentos writeSkill */
const TEMPLATE_MARKERS = [
  'Apply this skill when work matches the original session/checkpoint pattern described below',
  'Read the context in **Evidence**',
  'Prefer this path over rediscovering from scratch',
  'Link new failures via `node scripts/learning-loop.mjs record`',
  'Reusable skill codified from Entire',
  'Entire platform · kind=',
];

const ONE_OFF_PATTERNS = [
  /\bbump\b.+\bfrom\b.+\bto\b/i,
  /\bdeps?\b.*\bbump\b/i,
  /^chore-deps-deps-bump-/i,
  /^chore-actions-deps-bump-/i,
  /\bdependabot\b.*\bauto-merge\b/i,
  /\bfrom\s+\d+\.\d+.*to\s+\d+\.\d+/i,
  /\bv?\d+\.\d+\.\d+\s+to\s+v?\d+\.\d+\.\d+/i,
];

const GARBAGE_SLUG_PATTERNS = [
  /^chore-deps-deps-bump-/i,
  /^chore-actions-deps-bump-/i,
  /-from-\d+-/i,
  /-to-\d+/i,
];

function parseArgs(argv) {
  const out = {
    dryRun: true,
    apply: false,
    purge: false,
    dir: DEFAULT_DIR,
    slug: null,
    json: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--apply') {
      out.apply = true;
      out.dryRun = false;
    } else if (a === '--purge') out.purge = true;
    else if (a === '--json') out.json = true;
    else if (a === '--dir') out.dir = join(ROOT, argv[++i] || '.agents/skills/from-entire');
    else if (a === '--slug') out.slug = argv[++i] || null;
  }
  return out;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    fm[k] = v;
  }
  return { fm, body: m[2] };
}

function extractSection(body, heading) {
  const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

function countMatches(text, re) {
  const m = text.match(re);
  return m ? m.length : 0;
}

function listSkillDirs(baseDir, slugFilter) {
  if (!existsSync(baseDir)) return [];
  return readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name))
    .filter((d) => !slugFilter || d.name === slugFilter)
    .map((d) => ({
      slug: d.name,
      path: join(baseDir, d.name, 'SKILL.md'),
      dir: join(baseDir, d.name),
    }))
    .filter((s) => existsSync(s.path));
}

/**
 * Score a single skill. Returns 0–100 + checks + verdict.
 */
export function evaluateSkillContent({ slug, text, path }) {
  const { fm, body } = parseFrontmatter(text);
  const title = (body.match(/^#\s+(.+)$/m) || [])[1] || fm.name || slug;
  const whenToUse = extractSection(body, 'When to use') || extractSection(body, 'When to Use');
  const procedure = extractSection(body, 'Procedure') || extractSection(body, 'Implementation');
  const prevention = extractSection(body, 'Prevention');
  const evidence = extractSection(body, 'Evidence');
  const learned = extractSection(body, 'Learned prevention (Turso)');
  const overview = extractSection(body, 'Overview');
  const full = `${title}\n${fm.description || ''}\n${body}`;

  /** @type {{ id: string, points: number, max: number, pass: boolean, detail: string }[]} */
  const checks = [];
  const hardFails = [];

  // --- Structure (20) ---
  const hasName = Boolean(fm.name && /^[a-z0-9][a-z0-9-]*$/i.test(String(fm.name).replace(/^entire-/, '')));
  checks.push({
    id: 'frontmatter_name',
    points: hasName ? 5 : 0,
    max: 5,
    pass: hasName,
    detail: hasName ? 'name present' : 'missing/invalid name',
  });

  const desc = String(fm.description || '');
  const descOk = desc.length >= 40 && desc.length <= 500;
  const descTrigger =
    /^use when/i.test(desc) ||
    /when the user|triggers?:|use for /i.test(desc);
  const descIsTemplate = /Reusable skill codified from Entire/i.test(desc);
  let descPts = 0;
  if (descOk) descPts += 5;
  if (descTrigger && !descIsTemplate) descPts += 10;
  else if (desc && !descIsTemplate) descPts += 3;
  checks.push({
    id: 'description_quality',
    points: descPts,
    max: 15,
    pass: descPts >= 8,
    detail: descIsTemplate
      ? 'template description (not CSO-ready)'
      : descTrigger
        ? 'trigger-oriented description'
        : desc
          ? 'description present but weak triggers'
          : 'missing description',
  });

  // --- Anti one-off / garbage (hard) ---
  const oneOffHit =
    ONE_OFF_PATTERNS.some((re) => re.test(slug) || re.test(title) || re.test(desc)) ||
    GARBAGE_SLUG_PATTERNS.some((re) => re.test(slug));

  // Fake Entire skill: codified from git SHA only
  const entireId = String(fm.entire_id || '');
  if (/^git[-_]/i.test(entireId) || /source:\s*entire/i.test(text) && /^git[-_]/i.test(entireId)) {
    hardFails.push('fake Entire skill (entire_id is git commit, not a checkpoint)');
  }
  if (oneOffHit) {
    hardFails.push('one-off / version-pin skill (deps bump, from→to versions, non-reusable)');
  }
  checks.push({
    id: 'not_one_off',
    points: oneOffHit ? 0 : 15,
    max: 15,
    pass: !oneOffHit,
    detail: oneOffHit ? 'looks like a one-off commit narrative' : 'not an obvious one-off',
  });

  // --- Template detection (20) ---
  const templateHits = TEMPLATE_MARKERS.filter((m) => full.includes(m)).length;
  const templateRatio = templateHits / TEMPLATE_MARKERS.length;
  let templatePts = 20;
  if (templateRatio >= 0.5) templatePts = 0;
  else if (templateRatio >= 0.3) templatePts = 6;
  else if (templateRatio > 0) templatePts = 12;
  if (templateHits >= 4) {
    hardFails.push('mostly auto-generated template with no unique procedure');
  }
  checks.push({
    id: 'not_template_only',
    points: templatePts,
    max: 20,
    pass: templatePts >= 12,
    detail: `${templateHits}/${TEMPLATE_MARKERS.length} template markers`,
  });

  // --- Actionability (25) ---
  const concreteCmds = countMatches(
    body,
    /`(?:npm|npx|node|git|gh|vercel|entire|pnpm|yarn)[^`]*`/g
  );
  const fileRefs = countMatches(
    body,
    /`[^`]+\.(?:mjs|js|ts|tsx|yml|yaml|json|md|css)`|`(?:scripts|src|\.github|app)\//g
  );
  const numberedSteps = countMatches(procedure || body, /^\s*\d+\.\s+/gm);
  const uniqueProcedure =
    procedure &&
    !/Read the context in \*\*Evidence\*\*/.test(procedure) &&
    procedure.length > 120;

  let actionPts = 0;
  if (concreteCmds >= 2) actionPts += 8;
  else if (concreteCmds === 1) actionPts += 4;
  if (fileRefs >= 2) actionPts += 7;
  else if (fileRefs === 1) actionPts += 3;
  if (numberedSteps >= 3) actionPts += 5;
  if (uniqueProcedure) actionPts += 5;
  actionPts = Math.min(25, actionPts);

  checks.push({
    id: 'actionable_procedure',
    points: actionPts,
    max: 25,
    pass: actionPts >= 12,
    detail: `cmds=${concreteCmds} files=${fileRefs} steps=${numberedSteps} uniqueProc=${Boolean(uniqueProcedure)}`,
  });

  // --- When-to-use specificity (10) ---
  const whenGeneric =
    !whenToUse ||
    /matches the original session\/checkpoint pattern/i.test(whenToUse);
  const whenPts = whenGeneric ? 0 : whenToUse.length > 40 ? 10 : 5;
  checks.push({
    id: 'when_to_use',
    points: whenPts,
    max: 10,
    pass: whenPts >= 5,
    detail: whenGeneric ? 'generic/placeholder when-to-use' : 'specific when-to-use',
  });

  // --- Prevention signal (10) ---
  const prevGeneric =
    !prevention ||
    (/Prefer this path over rediscovering/.test(prevention) &&
      prevention.split('\n').filter((l) => l.trim().startsWith('-')).length <= 2);
  const learnedOnlyPaths =
    learned &&
    learned
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .every((l) => /Load skill \.agents\/skills\//.test(l));
  let prevPts = 0;
  if (prevention && !prevGeneric) prevPts += 7;
  else if (prevention && !prevGeneric === false && prevention.length > 80) prevPts += 3;
  if (learned && !learnedOnlyPaths && learned.length > 40) prevPts += 3;
  if (learnedOnlyPaths) prevPts = Math.max(0, prevPts - 3);
  prevPts = Math.min(10, prevPts);
  checks.push({
    id: 'prevention_value',
    points: prevPts,
    max: 10,
    pass: prevPts >= 4,
    detail: learnedOnlyPaths
      ? 'learned prevention is skill-path spam'
      : prevGeneric
        ? 'generic prevention only'
        : 'has useful prevention',
  });

  // --- Evidence substance (optional boost, max 5 into residual) ---
  const evidenceOnlyCommit =
    evidence &&
    /^Commit\s+[a-f0-9]+/i.test(evidence.trim()) &&
    evidence.length < 400;
  const evidencePts =
    evidence && !evidenceOnlyCommit && evidence.length > 200
      ? 5
      : evidence && evidence.length > 80
        ? 2
        : 0;
  checks.push({
    id: 'evidence_substance',
    points: evidencePts,
    max: 5,
    pass: evidencePts >= 2 || !evidence,
    detail: evidenceOnlyCommit
      ? 'evidence is single commit stub'
      : evidence
        ? 'has evidence block'
        : 'no evidence section',
  });

  if (evidenceOnlyCommit && templateHits >= 3 && actionPts < 8) {
    hardFails.push('commit-stub skill with no transferable procedure');
  }

  // --- Length / density ---
  const words = body.split(/\s+/).filter(Boolean).length;
  // Very short unique content after stripping template = empty skill
  let stripped = body;
  for (const m of TEMPLATE_MARKERS) stripped = stripped.split(m).join('');
  const uniqueWords = stripped.split(/\s+/).filter(Boolean).length;
  if (uniqueWords < 40 && oneOffHit) {
    hardFails.push('almost no unique content beyond template');
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      checks.reduce((s, c) => s + c.points, 0)
    )
  );

  let verdict = 'pass';
  if (hardFails.length || score < WARN_MIN) verdict = 'quarantine';
  else if (score < PASS_MIN) verdict = 'warn';
  // Extreme garbage
  if (hardFails.length >= 2 || (oneOffHit && templateHits >= 3)) {
    verdict = 'reject';
  }

  const reasons = [
    ...hardFails,
    ...checks.filter((c) => !c.pass).map((c) => `${c.id}: ${c.detail}`),
  ];

  return {
    slug,
    path: path || null,
    name: fm.name || slug,
    title,
    score,
    verdict,
    hard_fails: hardFails,
    reasons,
    checks,
    stats: {
      words,
      unique_words: uniqueWords,
      template_hits: templateHits,
      concrete_cmds: concreteCmds,
      file_refs: fileRefs,
    },
    fm,
    body,
  };
}

function stampFrontmatter(text, evaluation) {
  const { fm, body } = parseFrontmatter(text);
  const next = {
    ...fm,
    quality_score: String(evaluation.score),
    quality_verdict: evaluation.verdict,
    quality_checked_at: new Date().toISOString(),
  };
  if (evaluation.verdict === 'quarantine' || evaluation.verdict === 'reject') {
    next.status = evaluation.verdict === 'reject' ? 'rejected' : 'quarantined';
  }
  const order = [
    'name',
    'description',
    'source',
    'entire_id',
    'evolved',
    'evolution_version',
    'evolution_score',
    'times_seen',
    'times_helped',
    'status',
    'quality_score',
    'quality_verdict',
    'quality_checked_at',
    'category',
    'tags',
  ];
  const keys = [
    ...order.filter((k) => next[k] !== undefined),
    ...Object.keys(next).filter((k) => !order.includes(k)),
  ];
  const lines = keys.map((k) => {
    const v = next[k];
    if (v === undefined || v === null) return null;
    if (typeof v === 'string' && (v.includes(':') || v.includes('"') || v.includes('\n'))) {
      return `${k}: ${JSON.stringify(v)}`;
    }
    return `${k}: ${v}`;
  });
  return `---\n${lines.filter(Boolean).join('\n')}\n---\n\n${body.trim()}\n`;
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function writeReport(evalDir, results) {
  ensureDir(evalDir);
  const at = new Date().toISOString();
  const byVerdict = { pass: [], warn: [], quarantine: [], reject: [] };
  for (const r of results) {
    (byVerdict[r.verdict] || byVerdict.quarantine).push(r);
  }

  const rows = results
    .sort((a, b) => a.score - b.score)
    .map(
      (r) =>
        `| \`${r.slug}\` | ${r.verdict} | ${r.score} | ${(r.hard_fails[0] || r.reasons[0] || '—').slice(0, 80)} |`
    )
    .join('\n');

  const md = `---
type: report
title: Skill quality evaluation
tags: [skills, quality, evaluation]
---

# Skill quality evaluation

Updated: ${at}

| Verdict | Count |
|---------|------:|
| pass | ${byVerdict.pass.length} |
| warn | ${byVerdict.warn.length} |
| quarantine | ${byVerdict.quarantine.length} |
| reject | ${byVerdict.reject.length} |

## Scores (low → high)

| Slug | Verdict | Score | Top reason |
|------|---------|------:|------------|
${rows}

## Policy

- **pass** (≥${PASS_MIN}): reusable skill with actionable procedure
- **warn** (≥${WARN_MIN}): keep, improve description/procedure next evolve
- **quarantine** / **reject**: one-off, template-only, or non-transferable — not agent load path

Re-run: \`npm run learn:evaluate\` or \`npm run learn:evaluate:apply\`
`;

  writeFileSync(join(evalDir, 'REPORT.md'), md, 'utf8');
  writeFileSync(
    join(evalDir, 'latest.json'),
    JSON.stringify(
      {
        at,
        pass_min: PASS_MIN,
        warn_min: WARN_MIN,
        results: results.map((r) => ({
          slug: r.slug,
          score: r.score,
          verdict: r.verdict,
          hard_fails: r.hard_fails,
          reasons: r.reasons.slice(0, 8),
          stats: r.stats,
        })),
      },
      null,
      2
    ),
    'utf8'
  );
  return join(evalDir, 'REPORT.md');
}

function applyVerdict(baseDir, result, { purge }) {
  const quarantineRoot = join(baseDir, QUARANTINE_DIR_NAME);
  const skillDir = join(baseDir, result.slug);
  const skillPath = join(skillDir, 'SKILL.md');

  if (!existsSync(skillPath)) return { action: 'missing' };

  const stamped = stampFrontmatter(readFileSync(skillPath, 'utf8'), result);

  if (result.verdict === 'pass' || result.verdict === 'warn') {
    writeFileSync(skillPath, stamped, 'utf8');
    // If previously quarantined and now passes, leave in place (re-eval of active only)
    return { action: 'stamped', verdict: result.verdict };
  }

  // quarantine / reject
  if (purge && result.verdict === 'reject') {
    // Keep a copy under evaluation archive then delete
    const archive = join(baseDir, EVAL_DIR_NAME, 'purged', result.slug);
    ensureDir(dirname(archive));
    if (existsSync(archive)) rmSync(archive, { recursive: true, force: true });
    cpSync(skillDir, archive, { recursive: true });
    writeFileSync(join(archive, 'SKILL.md'), stamped, 'utf8');
    rmSync(skillDir, { recursive: true, force: true });
    return { action: 'purged', verdict: result.verdict };
  }

  ensureDir(quarantineRoot);
  const dest = join(quarantineRoot, result.slug);
  writeFileSync(skillPath, stamped, 'utf8');
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
  }
  renameSync(skillDir, dest);
  return { action: 'quarantined', verdict: result.verdict, dest };
}

/**
 * Evaluate all skills under dir. Used by CLI and learn-pipeline.
 */
export async function evaluateSkills(options = {}) {
  const opts = {
    dryRun: true,
    apply: false,
    purge: false,
    dir: DEFAULT_DIR,
    slug: null,
    json: false,
    ...options,
  };

  const skills = listSkillDirs(opts.dir, opts.slug);
  const results = [];

  for (const s of skills) {
    const text = readFileSync(s.path, 'utf8');
    const evaluation = evaluateSkillContent({
      slug: s.slug,
      text,
      path: s.path,
    });
    results.push(evaluation);
  }

  const summary = {
    total: results.length,
    pass: results.filter((r) => r.verdict === 'pass').length,
    warn: results.filter((r) => r.verdict === 'warn').length,
    quarantine: results.filter((r) => r.verdict === 'quarantine').length,
    reject: results.filter((r) => r.verdict === 'reject').length,
  };

  const evalDir = join(opts.dir, EVAL_DIR_NAME);
  const reportPath = writeReport(evalDir, results);

  const actions = [];
  if (opts.apply && !opts.dryRun) {
    for (const r of results) {
      const act = applyVerdict(opts.dir, r, { purge: opts.purge });
      actions.push({ slug: r.slug, ...act, score: r.score });
    }
    // Refresh report after moves (paths change)
    writeReport(evalDir, results);
  }

  return {
    ok: true,
    dry_run: !opts.apply || opts.dryRun,
    applied: Boolean(opts.apply && !opts.dryRun),
    summary,
    report: reportPath,
    results,
    actions,
  };
}

/**
 * Quick gate for a skill about to be written (codify path).
 * Returns { ok, evaluation } — ok false means do not write as active skill.
 */
export function shouldPublishSkill({ slug, title, description, body }) {
  const text = `---
name: ${slug}
description: ${JSON.stringify(description || title || slug)}
---

# ${title || slug}

${body || ''}
`;
  const evaluation = evaluateSkillContent({ slug, text });
  const ok = evaluation.verdict === 'pass' || evaluation.verdict === 'warn';
  return { ok, evaluation };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const result = await evaluateSkills(opts);

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          summary: result.summary,
          report: result.report,
          applied: result.applied,
          results: result.results.map((r) => ({
            slug: r.slug,
            score: r.score,
            verdict: r.verdict,
            hard_fails: r.hard_fails,
            reasons: r.reasons.slice(0, 5),
          })),
          actions: result.actions,
        },
        null,
        2
      )
    );
    return;
  }

  console.log('[evaluate-skills] summary:', result.summary);
  console.log('[evaluate-skills] report:', result.report);
  if (result.applied) {
    console.log('[evaluate-skills] actions:', result.actions.length);
    for (const a of result.actions.filter((x) => x.action !== 'stamped')) {
      console.log(`  ${a.action}: ${a.slug} (${a.verdict}, score=${a.score})`);
    }
  } else {
    console.log('[evaluate-skills] dry-run — pass --apply to stamp + quarantine garbage');
    const bad = result.results
      .filter((r) => r.verdict === 'quarantine' || r.verdict === 'reject')
      .sort((a, b) => a.score - b.score);
    for (const r of bad.slice(0, 20)) {
      console.log(
        `  ${r.verdict.padEnd(11)} ${String(r.score).padStart(3)}  ${r.slug}`
      );
      if (r.hard_fails[0]) console.log(`             ↳ ${r.hard_fails[0]}`);
    }
  }
}

if (process.argv[1]?.includes('evaluate-skills')) {
  main().catch((err) => {
    console.error('[evaluate-skills]', err);
    process.exit(1);
  });
}
