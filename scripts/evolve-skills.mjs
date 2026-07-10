#!/usr/bin/env node
/**
 * Self-evolving skills — rewrite SKILL.md content from Turso learning outcomes.
 *
 * What "self-evolving" means here (deterministic, no LLM required):
 *   - Skills are not static dumps of one commit message
 *   - Each learn-pipeline run can *mutate* skill files using measured signals:
 *       times_seen, times_helped, CI outcomes, linked lessons
 *   - Evolution is versioned (frontmatter + .agents/skills/from-entire/_evolution/)
 *   - Low-value skills get demoted; proven skills get reinforced procedures
 *
 * Usage:
 *   node scripts/evolve-skills.mjs
 *   node scripts/evolve-skills.mjs --dry-run
 *   node scripts/evolve-skills.mjs --slug chore-entire-fully-enable-entire-for-antigravity-and-grok
 *
 * Env: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN (same as learn-pipeline)
 */

import { createClient } from '@libsql/client';
import { config as loadDotenv } from 'dotenv';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { applyLearningSchema, lessonPriorityScore } from './turso-learning-schema.mjs';

const ROOT = process.cwd();
const SKILLS_DIR = join(ROOT, '.agents', 'skills', 'from-entire');
const EVOLVE_DIR = join(SKILLS_DIR, '_evolution');

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    if (existsSync(join(ROOT, f))) loadDotenv({ path: join(ROOT, f), override: false });
  }
}

function parseArgs(argv) {
  const out = { dryRun: false, slug: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') out.dryRun = true;
    else if (argv[i] === '--slug') out.slug = argv[++i] || null;
  }
  return out;
}

async function connect() {
  loadEnv();
  let url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL || 'file:./.agents/agent-os.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
  const isFile = String(url).startsWith('file:');
  const client = createClient({
    url,
    ...(authToken && !isFile ? { authToken } : {}),
  });
  await applyLearningSchema(client);
  // evolution audit table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS learn_skill_evolutions (
      id TEXT PRIMARY KEY NOT NULL,
      skill_id TEXT NOT NULL,
      slug TEXT NOT NULL,
      version INTEGER NOT NULL,
      reason TEXT,
      changes TEXT,
      score_before REAL,
      score_after REAL,
      created_at TEXT NOT NULL
    )
  `);
  return client;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: text, rawFm: '' };
  const rawFm = m[1];
  const fm = {};
  for (const line of rawFm.split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    fm[k] = v;
  }
  return { fm, body: m[2], rawFm };
}

function stringifyFm(fm) {
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
    'category',
    'tags',
  ];
  const keys = [...order.filter((k) => fm[k] !== undefined), ...Object.keys(fm).filter((k) => !order.includes(k))];
  const lines = keys.map((k) => {
    const v = fm[k];
    if (v === undefined || v === null) return null;
    if (typeof v === 'string' && (v.includes(':') || v.includes('"') || v.includes('\n'))) {
      return `${k}: ${JSON.stringify(v)}`;
    }
    return `${k}: ${v}`;
  });
  return lines.filter(Boolean).join('\n');
}

function listSkillSlugs() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== '_evolution')
    .map((d) => d.name);
}

function extractSection(body, heading) {
  const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const m = body.match(re);
  return m ? m[1].trim() : '';
}

function replaceOrAppendSection(body, heading, content) {
  const re = new RegExp(`## ${heading}\\s*\\n[\\s\\S]*?(?=\\n## |$)`, 'i');
  const block = `## ${heading}\n\n${content.trim()}\n\n`;
  if (re.test(body)) return body.replace(re, block);
  return `${body.trim()}\n\n${block}`;
}

/**
 * Decide evolution actions from Turso signals.
 */
function planEvolution(skillRow, lessonRows, outcomeSummary) {
  const changes = [];
  const seen = Number(skillRow?.times_seen ?? lessonRows.reduce((s, l) => s + Number(l.times_seen || 0), 0)) || 0;
  const helped = Number(skillRow?.times_helped ?? lessonRows.reduce((s, l) => s + Number(l.times_helped || 0), 0)) || 0;
  const score = lessonPriorityScore({
    times_seen: Math.max(seen, 1),
    times_helped: helped,
    severity: lessonRows[0]?.severity || 'medium',
  });

  const failRate =
    outcomeSummary.fail + outcomeSummary.pass > 0
      ? outcomeSummary.fail / (outcomeSummary.fail + outcomeSummary.pass)
      : 0;

  // Status
  let status = 'active';
  if (seen >= 3 && helped === 0 && score >= 3) {
    status = 'needs_hardening';
    changes.push('status→needs_hardening (repeated failures, no proven fixes)');
  }
  if (helped >= 2 && seen > 0 && helped / seen >= 0.5) {
    status = 'proven';
    changes.push('status→proven (helped ≥50% of observations)');
  }
  if (seen >= 5 && helped === 0 && score >= 5) {
    status = 'demoted';
    changes.push('status→demoted (high noise, never helped)');
  }

  // Reinforcement content
  const preventions = [
    ...new Set(
      lessonRows
        .map((l) => String(l.prevention || '').trim())
        .filter((p) => p.length > 20)
    ),
  ].slice(0, 8);

  const guardrails = [];
  if (failRate > 0.25) {
    guardrails.push('Run `npm run lint:ci && npm test` before pushing — CI failure rate elevated for this category.');
  }
  if (status === 'needs_hardening') {
    guardrails.push('Do not skip verification. Add a regression test when this class of failure reappears.');
  }
  if (status === 'proven') {
    guardrails.push('Prefer this skill early; it has a measured success history in Turso.');
  }
  if (preventions.length) {
    changes.push(`refresh prevention bullets (${preventions.length})`);
  }
  if (guardrails.length) {
    changes.push(`update guardrails (${guardrails.length})`);
  }

  // Always bump version when we have any signal
  if (!changes.length && (seen > 0 || helped > 0)) {
    changes.push('sync stats frontmatter');
  }

  return {
    status,
    score,
    seen,
    helped,
    preventions,
    guardrails,
    changes,
    failRate,
    shouldWrite: changes.length > 0,
  };
}

function renderEvolvedSkill({ slug, fm, body, plan, category }) {
  const version = Number(fm.evolution_version || 0) + (plan.shouldWrite ? 1 : 0);
  const nextFm = {
    ...fm,
    name: fm.name || `entire-${slug}`,
    description:
      fm.description ||
      `Evolving skill ${slug} (score=${plan.score.toFixed(1)}, status=${plan.status})`,
    source: fm.source || 'entire+turso',
    evolved: 'true',
    evolution_version: String(version),
    evolution_score: plan.score.toFixed(2),
    times_seen: String(plan.seen),
    times_helped: String(plan.helped),
    status: plan.status,
    category: category || fm.category || 'general',
  };

  let nextBody = body;

  // Provenance footer section
  const evolutionLog = [
    `- **Version:** ${version}`,
    `- **Status:** \`${plan.status}\``,
    `- **Score:** ${plan.score.toFixed(2)} (seen=${plan.seen}, helped=${plan.helped})`,
    `- **CI fail rate (category window):** ${(plan.failRate * 100).toFixed(0)}%`,
    `- **Last evolved:** ${new Date().toISOString()}`,
    `- **Changes:** ${plan.changes.join('; ') || 'stats sync'}`,
  ].join('\n');

  nextBody = replaceOrAppendSection(nextBody, 'Evolution', evolutionLog);

  // Learned prevention (from Turso lessons)
  if (plan.preventions.length) {
    const prev = plan.preventions.map((p) => `- ${p}`).join('\n');
    nextBody = replaceOrAppendSection(
      nextBody,
      'Learned prevention (Turso)',
      `${prev}\n\n_These bullets are rewritten by \`evolve-skills\` when new outcomes land._`
    );
  }

  if (plan.guardrails.length) {
    nextBody = replaceOrAppendSection(
      nextBody,
      'Adaptive guardrails',
      plan.guardrails.map((g) => `- ${g}`).join('\n')
    );
  }

  // Strengthen procedure for proven skills
  if (plan.status === 'proven') {
    const proc = extractSection(nextBody, 'Procedure');
    if (proc && !/PROVEN PATH/i.test(proc)) {
      nextBody = replaceOrAppendSection(
        nextBody,
        'Procedure',
        `> **PROVEN PATH** — Turso marks this skill as successful (helped/seen ≥ 50%).\n\n${proc}`
      );
    }
  }

  if (plan.status === 'demoted') {
    nextBody = replaceOrAppendSection(
      nextBody,
      'Demotion notice',
      'This skill is **demoted**: high observation count with zero measured helps. Prefer `learn:recommend` alternatives or write a better skill after the next real fix.'
    );
  }

  return {
    text: `---\n${stringifyFm(nextFm)}\n---\n\n${nextBody.trim()}\n`,
    version,
    fm: nextFm,
  };
}

export async function evolveSkills(options = {}) {
  const opts = { dryRun: false, slug: null, ...options };
  const client = await connect();

  // Category outcome window (recent)
  const outcomes = await client.execute(
    `SELECT conclusion, COUNT(*) AS n FROM learn_outcomes GROUP BY conclusion`
  );
  const outcomeSummary = { pass: 0, fail: 0 };
  for (const r of outcomes.rows) {
    if (r.conclusion === 'success') outcomeSummary.pass = Number(r.n);
    if (r.conclusion === 'failure') outcomeSummary.fail = Number(r.n);
  }

  const slugs = opts.slug ? [opts.slug] : listSkillSlugs();
  const evolved = [];
  const now = new Date().toISOString();

  for (const slug of slugs) {
    const skillPath = join(SKILLS_DIR, slug, 'SKILL.md');
    if (!existsSync(skillPath)) continue;

    const raw = readFileSync(skillPath, 'utf8');
    const { fm, body } = parseFrontmatter(raw);
    const skillId = createHash('sha256').update(`skill-id:${slug}`).digest('hex').slice(0, 16);

    // Lessons linked by skill path or category
    const byPath = await client.execute({
      sql: `SELECT * FROM learn_lessons WHERE skill_path LIKE ? OR fingerprint = ?`,
      args: [`%${slug}%`, skillId],
    });
    const category = fm.category || 'general';
    const byCat = await client.execute({
      sql: `SELECT * FROM learn_lessons WHERE category = ? AND status = 'active' LIMIT 10`,
      args: [category],
    });
    const lessonRows = [...byPath.rows, ...byCat.rows].filter(
      (v, i, a) => a.findIndex((x) => x.fingerprint === v.fingerprint) === i
    );

    // Skill registry row
    const skillReg = await client.execute({
      sql: `SELECT * FROM learn_skills WHERE slug = ?`,
      args: [slug],
    });
    const skillRow = skillReg.rows[0]
      ? {
          times_seen: Number(skillReg.rows[0].use_count || 0),
          times_helped: Number(skillReg.rows[0].success_count || 0),
        }
      : {
          times_seen: lessonRows.reduce((s, l) => s + Number(l.times_seen || 0), 0),
          times_helped: lessonRows.reduce((s, l) => s + Number(l.times_helped || 0), 0),
        };

    const plan = planEvolution(skillRow, lessonRows, outcomeSummary);
    if (!plan.shouldWrite) continue;

    const rendered = renderEvolvedSkill({
      slug,
      fm,
      body,
      plan,
      category,
    });

    const beforeScore = Number(fm.evolution_score || 0);
    evolved.push({
      slug,
      version: rendered.version,
      status: plan.status,
      score: plan.score,
      changes: plan.changes,
    });

    if (!opts.dryRun) {
      writeFileSync(skillPath, rendered.text, 'utf8');

      // Audit trail
      mkdirSync(EVOLVE_DIR, { recursive: true });
      const auditPath = join(EVOLVE_DIR, `${slug}.v${rendered.version}.md`);
      writeFileSync(
        auditPath,
        `# Evolution ${slug} v${rendered.version}\n\n${plan.changes.map((c) => `- ${c}`).join('\n')}\n`,
        'utf8'
      );

      await client.execute({
        sql: `INSERT INTO learn_skill_evolutions
          (id, skill_id, slug, version, reason, changes, score_before, score_after, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          createHash('sha256').update(`${slug}:${rendered.version}:${now}`).digest('hex').slice(0, 16),
          skillId,
          slug,
          rendered.version,
          plan.status,
          JSON.stringify(plan.changes),
          beforeScore,
          plan.score,
          now,
        ],
      });

      // Keep registry in sync
      await client.execute({
        sql: `INSERT INTO learn_skills
          (id, slug, path, title, source, fingerprint, use_count, success_count, last_used_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'entire+evolved', ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           use_count = excluded.use_count,
           success_count = excluded.success_count,
           updated_at = excluded.updated_at,
           source = 'entire+evolved'`,
        args: [
          skillId,
          slug,
          `.agents/skills/from-entire/${slug}/SKILL.md`,
          rendered.fm.description || slug,
          skillId,
          plan.seen,
          plan.helped,
          now,
          now,
          now,
        ],
      });
    }
  }

  // Write catalog of evolving skills for agents
  if (!opts.dryRun) {
    const catalog = [
      '---',
      'type: catalog',
      'title: Self-evolving skills catalog',
      'tags: [skills, evolution, turso]',
      '---',
      '',
      '# Self-evolving skills',
      '',
      `Updated: ${now}`,
      '',
      '| Slug | Status | Score | Version |',
      '|------|--------|------:|--------:|',
      ...evolved.map(
        (e) =>
          `| ${e.slug.slice(0, 48)} | ${e.status} | ${e.score.toFixed(1)} | ${e.version} |`
      ),
      '',
      'Skills evolve when `learn-pipeline` runs (after CI). Status meanings:',
      '',
      '- **active** — normal',
      '- **proven** — helped ≥ 50% of observations',
      '- **needs_hardening** — repeated failures, no helps yet',
      '- **demoted** — noisy; prefer alternatives from `learn:recommend`',
      '',
    ];
    mkdirSync(EVOLVE_DIR, { recursive: true });
    writeFileSync(join(EVOLVE_DIR, 'CATALOG.md'), catalog.join('\n'), 'utf8');
  }

  return {
    ok: true,
    dryRun: opts.dryRun,
    evolved_count: evolved.length,
    evolved,
    catalog: '.agents/skills/from-entire/_evolution/CATALOG.md',
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const result = await evolveSkills(opts);
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1]?.includes('evolve-skills')) {
  main().catch((err) => {
    console.error('[evolve-skills]', err);
    process.exit(1);
  });
}
