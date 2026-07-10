/**
 * Turso schema for continuous Agent OS learning.
 *
 * Design goal: every CI run / Entire sync / failure becomes queryable memory
 * that *improves* future agents (not a dump of JSON).
 *
 * Mental model:
 *   Episode  = one unit of work (CI run, commit, Entire session)
 *   Lesson   = deduped reusable knowledge (fingerprint)
 *   Outcome  = pass/fail signal (CI, Vercel)
 *   Skill    = path to a skill file agents can load
 *   Pattern  = aggregated recommendation (weight rises with evidence)
 *
 * Improvement loop:
 *   fail → episode + lesson.times_seen++
 *   fix+pass → lesson.times_helped++  skill.success_count++
 *   query → top lessons by (times_seen - times_helped) and weight
 */

export const LEARNING_SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS learn_episodes (
    id TEXT PRIMARY KEY NOT NULL,
    source TEXT NOT NULL,
    kind TEXT,
    sha TEXT,
    branch TEXT,
    title TEXT,
    summary TEXT,
    outcome TEXT,
    metadata TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_learn_episodes_sha ON learn_episodes(sha)`,
  `CREATE INDEX IF NOT EXISTS idx_learn_episodes_outcome ON learn_episodes(outcome)`,
  `CREATE INDEX IF NOT EXISTS idx_learn_episodes_created ON learn_episodes(created_at)`,

  `CREATE TABLE IF NOT EXISTS learn_lessons (
    fingerprint TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    prevention TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    healable INTEGER DEFAULT 0,
    times_seen INTEGER DEFAULT 1,
    times_helped INTEGER DEFAULT 0,
    last_seen_at TEXT,
    first_seen_at TEXT,
    skill_path TEXT,
    workflow_path TEXT,
    status TEXT DEFAULT 'active',
    evidence TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_learn_lessons_category ON learn_lessons(category)`,
  `CREATE INDEX IF NOT EXISTS idx_learn_lessons_status ON learn_lessons(status)`,

  `CREATE TABLE IF NOT EXISTS learn_lesson_episodes (
    fingerprint TEXT NOT NULL,
    episode_id TEXT NOT NULL,
    role TEXT DEFAULT 'mentioned',
    PRIMARY KEY (fingerprint, episode_id)
  )`,

  `CREATE TABLE IF NOT EXISTS learn_outcomes (
    id TEXT PRIMARY KEY NOT NULL,
    sha TEXT NOT NULL,
    branch TEXT,
    pipeline TEXT NOT NULL,
    job TEXT,
    conclusion TEXT NOT NULL,
    duration_ms INTEGER,
    log_excerpt TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_learn_outcomes_sha ON learn_outcomes(sha)`,
  `CREATE INDEX IF NOT EXISTS idx_learn_outcomes_conclusion ON learn_outcomes(conclusion)`,

  `CREATE TABLE IF NOT EXISTS learn_skills (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT,
    source TEXT,
    fingerprint TEXT,
    use_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    last_used_at TEXT,
    created_at TEXT,
    updated_at TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_learn_skills_slug ON learn_skills(slug)`,

  `CREATE TABLE IF NOT EXISTS learn_patterns (
    id TEXT PRIMARY KEY NOT NULL,
    pattern_key TEXT NOT NULL UNIQUE,
    category TEXT,
    signal TEXT,
    weight REAL DEFAULT 1.0,
    sample_count INTEGER DEFAULT 1,
    recommendation TEXT,
    updated_at TEXT
  )`,

  // Keep hub docs table for control-plane snapshots
  `CREATE TABLE IF NOT EXISTS agent_os_docs (
    id TEXT PRIMARY KEY NOT NULL,
    kind TEXT NOT NULL DEFAULT 'hub',
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS agent_os_meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  )`,

  // Domain agents — isolated state + errors + successes (synced from .agents/domains/*)
  `CREATE TABLE IF NOT EXISTS domain_agent_state (
    domain_id TEXT PRIMARY KEY NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'idle',
    last_task TEXT,
    last_error_at TEXT,
    last_success_at TEXT,
    error_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    payload TEXT,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS domain_events (
    id TEXT PRIMARY KEY NOT NULL,
    domain_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT,
    command TEXT,
    times_seen INTEGER DEFAULT 1,
    first_seen_at TEXT,
    last_seen_at TEXT,
    metadata TEXT,
    UNIQUE(domain_id, kind, fingerprint)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_domain_events_domain ON domain_events(domain_id)`,
  `CREATE INDEX IF NOT EXISTS idx_domain_events_kind ON domain_events(kind)`,
  `CREATE INDEX IF NOT EXISTS idx_domain_events_domain_kind ON domain_events(domain_id, kind)`,
];

/**
 * Apply learning schema to a libsql client.
 * @param {import('@libsql/client').Client} client
 */
export async function applyLearningSchema(client) {
  for (const sql of LEARNING_SCHEMA_SQL) {
    await client.execute(sql);
  }
  await client.execute({
    sql: `INSERT INTO agent_os_meta (key, value) VALUES ('learning_schema_version', ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: ['2'],
  });
  return { version: 2, tables: LEARNING_SCHEMA_SQL.length };
}

/**
 * Score how much a lesson still "needs attention".
 * Higher = more failures without proven fixes → prioritize for agents.
 */
export function lessonPriorityScore(lesson) {
  const seen = Number(lesson.times_seen) || 1;
  const helped = Number(lesson.times_helped) || 0;
  const unresolved = Math.max(0, seen - helped);
  const severityBoost =
    lesson.severity === 'high' ? 2 : lesson.severity === 'low' ? 0.5 : 1;
  return unresolved * severityBoost + seen * 0.1;
}
