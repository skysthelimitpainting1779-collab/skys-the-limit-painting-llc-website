import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || 'postgres://postgres.ouykfhoxlrkjgscdjjqg:g8980kbnFTwODn5f@aws-1-us-east-1.pooler.supabase.com:5432/postgres').split('?')[0];

async function runMigrations() {
  console.log('Connecting to database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected successfully!');

  try {
    // 1. Ensure migrations schema/table exists (standard Supabase format)
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS supabase_migrations;
      CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
        version character varying PRIMARY KEY,
        statements text[],
        name character varying,
        created_by character varying,
        idempotency_key character varying,
        rollback text[]
      );
    `);

    // 2. Fetch already applied migration versions
    const res = await client.query('SELECT version FROM supabase_migrations.schema_migrations');
    const appliedVersions = new Set(res.rows.map(row => row.version));
    console.log(`Found ${appliedVersions.size} already applied migrations in the database.`);

    // 3. Read migration files from the migrations folder
    const migrationsDir = path.resolve('supabase/migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.warn('No migrations directory found. Skipping.');
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort chronologically by name prefix

    console.log(`Found ${files.length} migration files locally.`);

    for (const file of files) {
      const match = file.match(/^(\d+)_(.+)\.sql$/);
      if (!match) {
        console.warn(`Skipping invalid migration filename: ${file}`);
        continue;
      }

      const version = match[1];
      const name = match[2];

      if (appliedVersions.has(version)) {
        console.log(`[SKIP] Migration ${version}_${name} is already applied.`);
        continue;
      }

      console.log(`\n========================================`);
      console.log(`Applying migration: ${version}_${name}...`);
      console.log(`========================================`);

      const filepath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filepath, 'utf8');

      // Begin transaction
      await client.query('BEGIN');

      try {
        // Execute migration SQL content
        // Note: we can split by semicolon or run the whole block.
        // Running the whole block is preferred for multi-statement files.
        await client.query(sqlContent);

        // Record the migration in schema_migrations
        await client.query(
          `INSERT INTO supabase_migrations.schema_migrations (version, name, statements) 
           VALUES ($1, $2, $3)`,
          [version, name, [sqlContent]]
        );

        await client.query('COMMIT');
        console.log(`[PASS] Migration ${version}_${name} applied successfully!`);
      } catch (migrationError) {
        await client.query('ROLLBACK');
        console.error(`[FAIL] Migration ${version}_${name} failed! Rolling back.`);
        throw migrationError;
      }
    }

    console.log('\nAll migrations are up-to-date!');

  } catch (error) {
    console.error('Migration runner failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
