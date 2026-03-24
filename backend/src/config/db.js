const { Pool } = require('pg');
const mongoose = require('mongoose');
const env = require('./env');

// PostgreSQL Pool
const pgPool = new Pool({
  ...env.pg,
  ssl: { rejectUnauthorized: false }
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// MongoDB Connection
const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const connectDBs = async () => {
  // Test Postgres connection
  try {
    const client = await pgPool.connect();
    console.log('PostgreSQL Connected');
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }

  // Connect MongoDB
  await connectMongo();
};

module.exports = {
  pgPool,
  connectDBs,
};
