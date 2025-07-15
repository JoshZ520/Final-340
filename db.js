const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g. postgres://user:password@localhost:5432/dbname
  // Or use user, host, database, password, port separately
});

module.exports = pool; 