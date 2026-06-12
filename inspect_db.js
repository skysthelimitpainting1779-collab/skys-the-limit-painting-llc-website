import pg from 'pg';
const { Client } = pg;

async function main() {
  const client = new Client({ 
    host: 'aws-1-us-east-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.ouykfhoxlrkjgscdjjqg',
    password: 'g8980kbnFTwODn5f',
    ssl: {
      rejectUnauthorized: false
    }
  });
  await client.connect();

  console.log("=== DB CONNECTION SUCCESSFUL ===\n");

  // Query schemas
  const columnsRes = await client.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `);
  
  console.log("Public Schema Table Columns:");
  console.log(JSON.stringify(columnsRes.rows, null, 2));

  // Query policies
  const policiesRes = await client.query(`
    SELECT 
      schemaname,
      tablename,
      policyname,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies 
    WHERE schemaname = 'public';
  `);
  
  console.log("\nDatabase Policies:");
  console.log(JSON.stringify(policiesRes.rows, null, 2));

  await client.end();
}

main().catch(err => console.error("Error connecting to database:", err));
