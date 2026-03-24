const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:qOcewAJqFmGyICfPxcayjBftgytWVJan@centerbeam.proxy.rlwy.net:46774/railway',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    console.log('Connecting to Railway DB...');
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('employer', 'candidate')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Successfully initialized users table in Railway DB!');
  } catch (err) {
    console.error('Error initializing tables:', err);
  } finally {
    process.exit(0);
  }
}

run();
