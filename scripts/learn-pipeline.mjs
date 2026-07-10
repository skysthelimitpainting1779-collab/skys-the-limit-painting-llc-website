#!/usr/bin/env node
/**
 * Learning pipeline — coordinates Entire summarization + Turso memory + Agent OS.
 *
 * Flow:
 *   1) Capture episode (CI outcome / git / Entire)
 *   2) Codify Entire → skills/workflows/rules (entire-to-agentos)
 *   3) Upsert lessons + skills + outcomes into Turso (structured schema)
 *   4) Recompute patterns that improve future agent guidance
 *   5) Write local mirror of recommendations for cold-start
 *
 * Usage:
 *   node scripts/learn-pipeline.mjs
 *   node scripts/learn-pipeline.mjs --conclusion success --pipeline ci --job quality
 *   node scripts/learn-pipeline.mjs --query
 *   node scripts/learn-pipeline.mjs --recommend ci
 *
 * Env:
 *   TURSO_DATABASE_URL   (default file:./.agents/agent-os.db)
 *   TURSO_AUTH_TOKEN
 *   GITHUB_SHA, GITHUB_REF_NAME, GITHUB_HEAD_REF
 *   LEARN_PIPELINE_SKIP_ENTIRE=1
 */

import { createClient } from '@libsql/client';
import { config as loadDotenv } from 'dotenv';
import { createHash, randomBytes } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';
import { applyLearningSchema, lessonPriorityScore } from './turso-learning-schema.mjs';
import { syncEntireToAgentOs } from './entire-to-agentos.mjs';
import { recordFailure, rebuildMarkdownViews } from './learning-loop.mjs';
import { evolveSkills } from './evolve-skills.mjs';
import { evaluateSkills } from './evaluate-skills.mjs';

const ROOT = process.cwd();

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    if (existsSync(join(ROOT, f))) loadDotenv({ path: join(ROOT, f), override: false });
  }
}

function parseArgs(argv) {
  const out = {
    conclusion: process.env.LEARN_CONCLUSION || process.env.CI_CONCLUSION || 'unknown',
    pipeline: process.env.LEARN_PIPELINE || 'ci',
    job: process.env.LEARN_JOB || 'quality',
    query: false,
    recommend: null,
    skipEntire: process.env.LEARN_PIPELINE_SKIP_ENTIRE === '1',
    durationMs: Number(process.env.LEARN_DURATION_MS || 0) || null,
    logExcerpt: process.env.LEARN_LOG_EXCERPT || '',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--conclusion') out.conclusion = argv[++i] || out.conclusion;
    else if (a === '--pipeline') out.pipeline = argv[++i] || out.pipeline;
    else if (a === '--job') out.job = argv[++i] || out.job;
    else if (a === '--query') out.query = true;
    else if (a === '--recommend') out.recommend = argv[++i] || 'general';
    else if (a === '--skip-entire') out.skipEntire = true;
    else if (a === '--duration-ms') out.durationMs = Number(argv[++i]) || null;
  }
  // normalize conclusion
  if (['success', 'failure', 'cancelled', 'skipped', 'unknown'].includes(out.conclusion)) {
    /* ok */
  } else if (out.conclusion === 'true' || out.conclusion === '0') {
    out.conclusion = out.conclusion === 'true' || out.conclusion === '0' ? 'success' : 'failure';
  }
  return out;
}

function id(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
}

function fp(text) {
  return createHash('sha256').update(String(text)).digest('hex').slice(0, 16);
}

function git(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      cwd: ROOT,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

function getSha() {
  return process.env.GITHUB_SHA || git(['rev-parse', 'HEAD']) || 'unknown';
}

function getBranch() {
  return (
    process.env.GITHUB_HEAD_REF ||
    process.env.GITHUB_REF_NAME ||
    git(['rev-parse', '--abbrev-ref', 'HEAD']) ||
    'unknown'
  );
}

async function connect() {
  loadEnv();
  let url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || '';
  if (!url) {
    url = 'file:./.agents/agent-os.db';
    console.warn(`[learn-pipeline] No TURSO_DATABASE_URL — using ${url}`);
  }
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
  const isFile = String(url).startsWith('file:');
  const client = createClient({
    url,
    ...(authToken && !isFile ? { authToken } : {}),
  });
  await applyLearningSchema(client);
  return { client, url, isFile };
}

function classifyTitle(title) {
  const t = String(title || '').toLowerCase();
  if (/typescript|tsc|type error|ts\d/.test(t)) return 'typescript';
  if (/next|ssr|turbopack|build/.test(t)) return 'nextjs';
  if (/knip|unused/.test(t)) return 'knip';
  if (/markdown|md\d/.test(t)) return 'markdown';
  if (/vercel|deploy|preview/.test(t)) return 'vercel';
  if (/test|assert|failing test/.test(t)) return 'test';
  if (/ci|workflow|github actions/.test(t)) return 'ci';
  if (/lint|eslint/.test(t)) return 'lint';
  if (/entire|checkpoint|session/.test(t)) return 'entire';
  if (/powershell|shell|cmd/.test(t)) return 'shell';
  return 'general';
}

function scanFromEntireSkills() {
  const dir = join(ROOT, '.agents', 'skills', 'from-entire');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const slug of readdirSync(dir)) {
    // Skip meta dirs and quarantined garbage
    if (slug.startsWith('_')) continue;
    const skillPath = join(dir, slug, 'SKILL.md');
    if (!existsSync(skillPath)) continue;
    const text = readFileSync(skillPath, 'utf8');
    const verdict = text.match(/quality_verdict:\s*(\S+)/)?.[1];
    const status = text.match(/^status:\s*(\S+)/m)?.[1];
    if (verdict === 'reject' || verdict === 'quarantine') continue;
    if (status === 'quarantined' || status === 'rejected') continue;
    const title =
      text.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
      text.match(/description:\s*"?([^"\n]+)/)?.[1]?.trim() ||
      slug;
    const entireId = text.match(/entire_id:\s*(\S+)/)?.[1] || null;
    out.push({
      slug,
      path: `.agents/skills/from-entire/${slug}/SKILL.md`,
      title,
      entireId,
      fingerprint: fp(`skill:${slug}:${title}`),
      category: classifyTitle(title),
      body: text.slice(0, 2000),
    });
  }
  return out;
}

function scanWorkflows() {
  const dir = join(ROOT, '.agents', 'workflows', 'from-entire');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const path = join(dir, f);
      const text = readFileSync(path, 'utf8');
      const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() || f;
      return {
        slug: f.replace(/\.md$/, ''),
        path: `.agents/workflows/from-entire/${f}`,
        title,
        fingerprint: fp(`workflow:${f}`),
        category: classifyTitle(title),
      };
    });
}

function lessonsFromLearningIndex() {
  const p = join(ROOT, '.learnings', 'index.json');
  if (!existsSync(p)) return [];
  try {
    const idx = JSON.parse(readFileSync(p, 'utf8'));
    return Object.values(idx.incidents || {})
      .filter((i) => {
        const t = String(i.title || '');
        // Drop synthetic test noise and pure wiki OKF spam from Turso recommendations
        if (/Synthetic failure dedupe-test/i.test(t)) return false;
        if (/OKF validator failed on auto-compiled wiki/i.test(t)) return false;
        return true;
      })
      .map((i) => ({
        fingerprint: i.fingerprint || fp(i.title + i.category),
        category: i.category || classifyTitle(i.title),
        title: i.title,
        prevention: i.prevention || 'See skill/workflow for this failure class.',
        severity: i.severity || 'medium',
        healable: i.healable ? 1 : 0,
        times_seen: i.count || 1,
        status: i.status === 'open' ? 'active' : i.status || 'active',
        skill_path: null,
        workflow_path: null,
      }));
  } catch {
    return [];
  }
}

async function upsertLesson(client, lesson, episodeId, role = 'mentioned') {
  const now = new Date().toISOString();
  const existing = await client.execute({
    sql: 'SELECT * FROM learn_lessons WHERE fingerprint = ?',
    args: [lesson.fingerprint],
  });

  if (existing.rows.length === 0) {
    await client.execute({
      sql: `INSERT INTO learn_lessons
        (fingerprint, category, title, prevention, severity, healable, times_seen, times_helped,
         last_seen_at, first_seen_at, skill_path, workflow_path, status, evidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
      args: [
        lesson.fingerprint,
        lesson.category,
        lesson.title,
        lesson.prevention,
        lesson.severity || 'medium',
        lesson.healable || 0,
        lesson.times_seen || 1,
        now,
        now,
        lesson.skill_path || null,
        lesson.workflow_path || null,
        lesson.status || 'active',
        JSON.stringify([episodeId]),
      ],
    });
  } else {
    const row = existing.rows[0];
    let evidence = [];
    try {
      evidence = JSON.parse(row.evidence || '[]');
    } catch {
      evidence = [];
    }
    if (!evidence.includes(episodeId)) evidence.push(episodeId);
    evidence = evidence.slice(-50);

    // times_seen always +1 on re-observe; times_helped when linked as fixed
    const timesHelped = Number(row.times_helped || 0) + (role === 'fixed' ? 1 : 0);

    await client.execute({
      sql: `UPDATE learn_lessons SET
        times_seen = times_seen + 1,
        times_helped = ?,
        last_seen_at = ?,
        prevention = COALESCE(?, prevention),
        skill_path = COALESCE(?, skill_path),
        workflow_path = COALESCE(?, workflow_path),
        status = ?,
        evidence = ?
       WHERE fingerprint = ?`,
      args: [
        timesHelped,
        now,
        lesson.prevention || null,
        lesson.skill_path || null,
        lesson.workflow_path || null,
        lesson.status || row.status || 'active',
        JSON.stringify(evidence),
        lesson.fingerprint,
      ],
    });
  }

  await client.execute({
    sql: `INSERT INTO learn_lesson_episodes (fingerprint, episode_id, role)
          VALUES (?, ?, ?)
          ON CONFLICT(fingerprint, episode_id) DO UPDATE SET role = excluded.role`,
    args: [lesson.fingerprint, episodeId, role],
  });
}

async function recomputePatterns(client) {
  const lessons = await client.execute(
    `SELECT fingerprint, category, title, prevention, times_seen, times_helped, severity, status
     FROM learn_lessons WHERE status = 'active'`
  );
  const now = new Date().toISOString();

  // Per-category patterns
  const byCat = new Map();
  for (const row of lessons.rows) {
    const cat = row.category || 'general';
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(row);
  }

  for (const [category, rows] of byCat) {
    const sorted = [...rows].sort(
      (a, b) => lessonPriorityScore(b) - lessonPriorityScore(a)
    );
    const top = sorted[0];
    if (!top) continue;
    const weight = sorted.reduce((s, r) => s + lessonPriorityScore(r), 0);
    const key = `category:${category}`;
    const recommendation = `When working on ${category}: apply lesson "${top.title}" — ${String(top.prevention).slice(0, 200)}`;
    await client.execute({
      sql: `INSERT INTO learn_patterns (id, pattern_key, category, signal, weight, sample_count, recommendation, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(pattern_key) DO UPDATE SET
              weight = excluded.weight,
              sample_count = excluded.sample_count,
              recommendation = excluded.recommendation,
              updated_at = excluded.updated_at,
              signal = excluded.signal`,
      args: [
        fp(key),
        key,
        category,
        `top=${top.fingerprint}`,
        weight,
        rows.length,
        recommendation,
        now,
      ],
    });
  }

  // CI failure pattern
  const fails = await client.execute({
    sql: `SELECT COUNT(*) AS n FROM learn_outcomes WHERE conclusion = 'failure'`,
  });
  const passes = await client.execute({
    sql: `SELECT COUNT(*) AS n FROM learn_outcomes WHERE conclusion = 'success'`,
  });
  const failN = Number(fails.rows[0]?.n || 0);
  const passN = Number(passes.rows[0]?.n || 0);
  const rate = failN + passN > 0 ? failN / (failN + passN) : 0;
  await client.execute({
    sql: `INSERT INTO learn_patterns (id, pattern_key, category, signal, weight, sample_count, recommendation, updated_at)
          VALUES (?, 'ci:failure_rate', 'ci', ?, ?, ?, ?, ?)
          ON CONFLICT(pattern_key) DO UPDATE SET
            weight = excluded.weight,
            sample_count = excluded.sample_count,
            recommendation = excluded.recommendation,
            signal = excluded.signal,
            updated_at = excluded.updated_at`,
    args: [
      fp('ci:failure_rate'),
      `fail=${failN};pass=${passN};rate=${rate.toFixed(3)}`,
      rate,
      failN + passN,
      rate > 0.3
        ? 'CI failure rate high — prioritize fix lessons and run lint:ci before push.'
        : 'CI healthy — keep pre-push lint:ci discipline.',
      now,
    ],
  });
}

function writeLocalRecommendations(rows) {
  const dir = join(ROOT, '.learnings');
  mkdirSync(dir, { recursive: true });
  const md = [
    '---',
    'type: ledger',
    'title: Learning Recommendations (from Turso)',
    'description: Cold-start guidance produced by learn-pipeline for agents.',
    'tags: [learning, turso, recommendations]',
    '---',
    '',
    '# Learning recommendations',
    '',
    `> Updated: ${new Date().toISOString()}`,
    '',
    '## Top lessons (need attention)',
    '',
  ];
  if (!rows.length) {
    md.push('_No lessons yet. Run CI or `npm run learn:pipeline`._', '');
  } else {
    md.push('| Score | Category | Title | Prevention |', '|------:|----------|-------|------------|');
    for (const r of rows.slice(0, 15)) {
      const score = lessonPriorityScore(r).toFixed(1);
      md.push(
        `| ${score} | ${r.category} | ${String(r.title).replace(/\|/g, '/').slice(0, 60)} | ${String(r.prevention).replace(/\|/g, '/').slice(0, 80)} |`
      );
    }
    md.push('');
  }
  writeFileSync(join(dir, 'RECOMMENDATIONS.md'), md.join('\n'), 'utf8');
}

export async function runLearnPipeline(opts = {}) {
  const options = { ...parseArgs([]), ...opts };
  const { client, url, isFile } = await connect();
  const sha = getSha();
  const branch = getBranch();
  const now = new Date().toISOString();
  const episodeId = id('ep');

  // 1) Entire codify (skills/workflows/rules) — skip in pure query mode
  let entireResult = { skipped: true };
  if (!options.query && !options.recommend && !options.skipEntire) {
    try {
      entireResult = await syncEntireToAgentOs({
        commit: false,
        since: '14d',
      });
    } catch (err) {
      entireResult = { ok: false, error: err.message };
      console.warn('[learn-pipeline] entire-to-agentos:', err.message);
    }
  }

  // 2) Episode
  const episode = {
    id: episodeId,
    source: options.pipeline === 'ci' ? 'ci' : options.pipeline || 'agent-os',
    kind:
      options.conclusion === 'failure'
        ? 'quality_fail'
        : options.conclusion === 'success'
          ? 'quality_pass'
          : 'sync',
    sha,
    branch,
    title: `${options.pipeline}/${options.job}: ${options.conclusion}`,
    summary: `Learning pipeline run for ${options.pipeline} job=${options.job} outcome=${options.conclusion}`,
    outcome: options.conclusion,
    metadata: JSON.stringify({
      entire: entireResult,
      node: process.version,
      job: options.job,
    }),
    created_at: now,
  };

  await client.execute({
    sql: `INSERT INTO learn_episodes
      (id, source, kind, sha, branch, title, summary, outcome, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      episode.id,
      episode.source,
      episode.kind,
      episode.sha,
      episode.branch,
      episode.title,
      episode.summary,
      episode.outcome,
      episode.metadata,
      episode.created_at,
    ],
  });

  // 3) Outcome row
  const outcomeId = id('out');
  await client.execute({
    sql: `INSERT INTO learn_outcomes
      (id, sha, branch, pipeline, job, conclusion, duration_ms, log_excerpt, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      outcomeId,
      sha,
      branch,
      options.pipeline,
      options.job,
      options.conclusion,
      options.durationMs,
      String(options.logExcerpt || '').slice(0, 4000),
      now,
    ],
  });

  // 4) Lessons from learning-loop index + skills
  const lessons = lessonsFromLearningIndex();
  const skills = scanFromEntireSkills();
  const workflows = scanWorkflows();

  // Link skills to lessons by category fuzzy match
  for (const skill of skills) {
    const role =
      options.conclusion === 'success' ? 'fixed' : options.conclusion === 'failure' ? 'caused' : 'mentioned';
    await upsertLesson(
      client,
      {
        fingerprint: skill.fingerprint,
        category: skill.category,
        title: skill.title,
        prevention: `Load skill ${skill.path} before repeating this class of work.`,
        severity: 'medium',
        healable: 0,
        skill_path: skill.path,
        workflow_path: null,
        status: 'active',
      },
      episodeId,
      options.conclusion === 'failure' ? 'caused' : 'mentioned'
    );

    await client.execute({
      sql: `INSERT INTO learn_skills
        (id, slug, path, title, source, fingerprint, use_count, success_count, last_used_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'entire', ?, 0, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         path = excluded.path,
         fingerprint = excluded.fingerprint,
         success_count = learn_skills.success_count + excluded.success_count,
         updated_at = excluded.updated_at`,
      args: [
        fp(`skill-id:${skill.slug}`),
        skill.slug,
        skill.path,
        skill.title,
        skill.fingerprint,
        options.conclusion === 'success' ? 1 : 0,
        now,
        now,
        now,
      ],
    });
  }

  for (const lesson of lessons) {
    // Attach skill/workflow paths when category matches
    const skill = skills.find((s) => s.category === lesson.category);
    const wf = workflows.find((w) => w.category === lesson.category);
    await upsertLesson(
      client,
      {
        ...lesson,
        skill_path: skill?.path || lesson.skill_path,
        workflow_path: wf?.path || lesson.workflow_path,
      },
      episodeId,
      options.conclusion === 'failure' ? 'caused' : options.conclusion === 'success' ? 'fixed' : 'mentioned'
    );
  }

  // On CI failure with log excerpt, create a lesson from it
  if (options.conclusion === 'failure' && options.logExcerpt) {
    const title = `CI ${options.job} failure on ${branch}`;
    await upsertLesson(
      client,
      {
        fingerprint: fp(`ci-fail:${options.job}:${options.logExcerpt.slice(0, 200)}`),
        category: classifyTitle(options.logExcerpt) || 'ci',
        title,
        prevention:
          'Reproduce with npm run lint:ci && npm test && npm run build. Fix root cause; do not skip hooks.',
        severity: 'high',
        healable: 0,
        status: 'active',
      },
      episodeId,
      'caused'
    );
    try {
      recordFailure({
        title,
        error: options.logExcerpt.slice(0, 2000),
        command: `ci/${options.job}`,
        area: 'ci',
        step: options.job,
      });
    } catch {
      /* non-fatal */
    }
  }

  // 5) Patterns
  await recomputePatterns(client);

  // 5b) Self-evolve skills from Turso outcomes (rewrite SKILL.md procedures/guardrails)
  let evolution = { skipped: true };
  try {
    evolution = await evolveSkills({ dryRun: false });
    console.log(
      `[learn-pipeline] evolved ${evolution.evolved_count || 0} skill(s)`
    );
  } catch (err) {
    evolution = { ok: false, error: err.message };
    console.warn('[learn-pipeline] evolve-skills:', err.message);
  }

  // 5c) Quality-evaluate skills — quarantine template/one-off garbage
  let skillEval = { skipped: true };
  try {
    skillEval = await evaluateSkills({ apply: true, dryRun: false });
    console.log(
      `[learn-pipeline] skill-eval pass=${skillEval.summary?.pass || 0} warn=${skillEval.summary?.warn || 0} quarantine=${skillEval.summary?.quarantine || 0} reject=${skillEval.summary?.reject || 0}`
    );
  } catch (err) {
    skillEval = { ok: false, error: err.message };
    console.warn('[learn-pipeline] evaluate-skills:', err.message);
  }

  // 5d) Domain agents → Turso (state + errors + successes)
  let domainSync = { skipped: true };
  try {
    const r = spawnSync(
      process.execPath,
      [join(ROOT, 'scripts/domain-agent.mjs'), 'sync', 'all'],
      { cwd: ROOT, encoding: 'utf8', windowsHide: true, timeout: 120000 }
    );
    if (r.stdout) {
      try {
        domainSync = JSON.parse(r.stdout);
      } catch {
        domainSync = { ok: r.status === 0, raw: r.stdout.slice(0, 500) };
      }
    } else {
      domainSync = { ok: false, error: r.stderr?.slice(0, 300) };
    }
    console.log(
      `[learn-pipeline] domain-sync agents=${domainSync.results?.length ?? '?'}`
    );
  } catch (err) {
    domainSync = { ok: false, error: err.message };
    console.warn('[learn-pipeline] domain-sync:', err.message);
  }

  // 6) Snapshot summary doc for cold-start agents
  const top = await client.execute(
    `SELECT * FROM learn_lessons WHERE status = 'active' ORDER BY (times_seen - times_helped) DESC, times_seen DESC LIMIT 20`
  );
  writeLocalRecommendations(top.rows);

  const patterns = await client.execute(
    `SELECT * FROM learn_patterns ORDER BY weight DESC LIMIT 20`
  );

  // Write summary into agent_os_docs
  const summary = {
    type: 'learning_snapshot',
    at: now,
    sha,
    branch,
    conclusion: options.conclusion,
    pipeline: options.pipeline,
    job: options.job,
    episode_id: episodeId,
    top_lessons: top.rows.map((r) => ({
      fingerprint: r.fingerprint,
      category: r.category,
      title: r.title,
      score: lessonPriorityScore(r),
      prevention: r.prevention,
      skill_path: r.skill_path,
      times_seen: r.times_seen,
      times_helped: r.times_helped,
    })),
    patterns: patterns.rows.map((p) => ({
      key: p.pattern_key,
      category: p.category,
      weight: p.weight,
      recommendation: p.recommendation,
    })),
    entire: entireResult,
    skill_evolution: evolution,
    skill_evaluation: {
      summary: skillEval.summary || null,
      report: skillEval.report || null,
      applied: skillEval.applied || false,
      error: skillEval.error || null,
    },
    domain_sync: domainSync,
  };

  await client.execute({
    sql: `INSERT INTO agent_os_docs (id, kind, payload, updated_at)
          VALUES ('learning_snapshot', 'learning', ?, ?)
          ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
    args: [JSON.stringify(summary), now],
  });

  await client.execute({
    sql: `INSERT INTO agent_os_meta (key, value) VALUES ('last_learn_pipeline_at', ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [now],
  });

  try {
    rebuildMarkdownViews();
  } catch {
    /* ignore */
  }

  // Local mirror of snapshot
  mkdirSync(join(ROOT, '.learnings'), { recursive: true });
  writeFileSync(
    join(ROOT, '.learnings', 'LEARNING_SNAPSHOT.json'),
    JSON.stringify(summary, null, 2),
    'utf8'
  );

  return {
    ok: true,
    turso: { url: isFile ? url : String(url).slice(0, 48), is_file: isFile },
    episode_id: episodeId,
    outcome_id: outcomeId,
    lessons_upserted: lessons.length + skills.length,
    skills_registered: skills.length,
    top_lessons: summary.top_lessons.slice(0, 5),
    patterns: summary.patterns.slice(0, 5),
    entire: entireResult,
    skill_evolution: evolution,
    skill_evaluation: skillEval.summary
      ? { summary: skillEval.summary, report: skillEval.report }
      : skillEval,
    domain_sync: domainSync,
    recommendations_path: '.learnings/RECOMMENDATIONS.md',
    snapshot_path: '.learnings/LEARNING_SNAPSHOT.json',
    evolution_catalog: '.agents/skills/from-entire/_evolution/CATALOG.md',
    evaluation_report: '.agents/skills/from-entire/_evaluation/REPORT.md',
  };
}

export async function recommend(category = 'general', limit = 5) {
  const { client } = await connect();
  const q =
    category && category !== 'general'
      ? await client.execute({
          sql: `SELECT * FROM learn_lessons WHERE status = 'active' AND category = ?
                ORDER BY (times_seen - times_helped) DESC, times_seen DESC LIMIT ?`,
          args: [category, limit],
        })
      : await client.execute({
          sql: `SELECT * FROM learn_lessons WHERE status = 'active'
                ORDER BY (times_seen - times_helped) DESC, times_seen DESC LIMIT ?`,
          args: [limit],
        });
  return q.rows.map((r) => ({
    ...r,
    score: lessonPriorityScore(r),
  }));
}

export async function queryLearningStats() {
  const { client, url, isFile } = await connect();
  const episodes = await client.execute(`SELECT COUNT(*) AS n FROM learn_episodes`);
  const lessons = await client.execute(`SELECT COUNT(*) AS n FROM learn_lessons`);
  const outcomes = await client.execute(
    `SELECT conclusion, COUNT(*) AS n FROM learn_outcomes GROUP BY conclusion`
  );
  const skills = await client.execute(`SELECT COUNT(*) AS n FROM learn_skills`);
  const patterns = await client.execute(`SELECT * FROM learn_patterns ORDER BY weight DESC LIMIT 10`);
  return {
    turso: { url: isFile ? url : String(url).slice(0, 48), is_file: isFile },
    episodes: Number(episodes.rows[0]?.n || 0),
    lessons: Number(lessons.rows[0]?.n || 0),
    skills: Number(skills.rows[0]?.n || 0),
    outcomes: Object.fromEntries(outcomes.rows.map((r) => [r.conclusion, Number(r.n)])),
    patterns: patterns.rows,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.query) {
    const stats = await queryLearningStats();
    console.log(JSON.stringify(stats, null, 2));
    return;
  }
  if (opts.recommend) {
    const rows = await recommend(opts.recommend, 10);
    console.log(JSON.stringify({ category: opts.recommend, recommendations: rows }, null, 2));
    return;
  }

  const result = await runLearnPipeline(opts);
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && process.argv[1].includes('learn-pipeline')) {
  main().catch((err) => {
    console.error('[learn-pipeline] failed:', err);
    process.exit(1);
  });
}
