import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.resolve(
    'C:\\Users\\Johnny Cage\\DEV\\skysthelimit-collab\\.env.local'
  ),
});

const { Client } = pg;

const rawConnectionString =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!rawConnectionString) {
  console.error('Error: Database connection string missing in environment.');
  process.exit(1);
}

// Strip query parameters to prevent overriding ssl config
const connectionString = rawConnectionString.split('?')[0];

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const migrationSql = `
-- Add photos_url to public.leads table if not already present
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS photos_url TEXT;

-- Create storage bucket for lead photos if not already present
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-photos', 'lead-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist to prevent errors
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;

-- Create policies for public access on lead-photos bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lead-photos');

CREATE POLICY "Public Insert Access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'lead-photos');
`;

async function run() {
  await client.connect();
  try {
    console.log('Connected to Supabase database. Running migrations...');
    await client.query(migrationSql);
    console.log('Migrations ran successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
