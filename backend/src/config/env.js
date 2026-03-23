const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'PORT',
  'PG_USER',
  'PG_HOST',
  'PG_DATABASE',
  'PG_PASSWORD',
  'PG_PORT',
  'MONGO_URI',
  'JWT_SECRET',
];

const checkEnv = () => {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

checkEnv();

module.exports = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  pg: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT, 10),
  },
  mongoUri: process.env.MONGO_URI,
};
