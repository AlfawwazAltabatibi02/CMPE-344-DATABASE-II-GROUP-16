/**
 * db.js — MySQL2 connection pool for TournamentDB on Railway
 *
 * Connection:
 *   Host   : metro.proxy.rlwy.net
 *   Port   : 13110
 *   DB     : tournamentdb
 *   User   : root
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:               'metro.proxy.rlwy.net',
  port:               13110,
  user:               'root',
  password:           'WNuPZLfvQauECoVVJLtKEJDOmqaFuUEF',
  database:           'tournamentdb',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  ssl:                { rejectUnauthorized: false },
});

/**
 * Verify the connection at startup.
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to Railway MySQL (tournamentdb)');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
