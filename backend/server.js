const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');
const { pool, testConnection } = require('./db');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Run a query and return rows */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/** Return the primary-key column name for each table */
const PK = {
  tournaments: 'tournament_id',
  teams:       'team_id',
  players:     'player_id',
  matches:     'match_id',
  venues:      'venue_id',
  referees:    'referee_id',
  standings:   'standing_id',
  statistics:  'stat_id',
};

// ─── GENERIC CRUD FACTORY ────────────────────────────────────────────────────
function crudRouter(table) {
  const pk = PK[table];
  const router = express.Router();

  // GET all
  router.get('/', async (req, res) => {
    try {
      const rows = await query(`SELECT * FROM \`${table}\``);
      res.json({ success: true, data: rows, count: rows.length });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });

  // GET one
  router.get('/:id', async (req, res) => {
    try {
      const rows = await query(
        `SELECT * FROM \`${table}\` WHERE \`${pk}\` = ?`,
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });

  // POST create
  router.post('/', async (req, res) => {
    try {
      const body = req.body;
      if (!body || !Object.keys(body).length)
        return res.status(400).json({ success: false, error: 'No data provided' });

      const cols   = Object.keys(body).map(c => `\`${c}\``).join(', ');
      const placeholders = Object.keys(body).map(() => '?').join(', ');
      const vals   = Object.values(body);

      const [result] = await pool.execute(
        `INSERT INTO \`${table}\` (${cols}) VALUES (${placeholders})`,
        vals
      );
      // Fetch the inserted row
      const idVal = body[pk] || result.insertId;
      const rows = await query(`SELECT * FROM \`${table}\` WHERE \`${pk}\` = ?`, [idVal]);
      res.status(201).json({ success: true, data: rows[0] || { insertId: result.insertId } });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });

  // PUT update
  router.put('/:id', async (req, res) => {
    try {
      const body = req.body;
      if (!body || !Object.keys(body).length)
        return res.status(400).json({ success: false, error: 'No data provided' });

      const setClause = Object.keys(body).map(c => `\`${c}\` = ?`).join(', ');
      const vals = [...Object.values(body), req.params.id];

      const [result] = await pool.execute(
        `UPDATE \`${table}\` SET ${setClause} WHERE \`${pk}\` = ?`,
        vals
      );
      if (!result.affectedRows)
        return res.status(404).json({ success: false, error: 'Not found' });

      const rows = await query(`SELECT * FROM \`${table}\` WHERE \`${pk}\` = ?`, [req.params.id]);
      res.json({ success: true, data: rows[0] });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });

  // DELETE
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.execute(
        `DELETE FROM \`${table}\` WHERE \`${pk}\` = ?`,
        [req.params.id]
      );
      if (!result.affectedRows)
        return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });

  return router;
}

// ─── MOUNT ROUTES ────────────────────────────────────────────────────────────
app.use('/api/tournaments', crudRouter('tournaments'));
app.use('/api/teams',       crudRouter('teams'));
app.use('/api/players',     crudRouter('players'));
app.use('/api/matches',     crudRouter('matches'));
app.use('/api/venues',      crudRouter('venues'));
app.use('/api/referees',    crudRouter('referees'));
app.use('/api/standings',   crudRouter('standings'));
app.use('/api/statistics',  crudRouter('statistics'));

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [
      [{ total: tournaments }],
      [{ total: teams }],
      [{ total: players }],
      [{ total: matches }],
      [{ total: venues }],
      [{ total: referees }],
      [{ total: standings }],
      [{ total: statistics }],
      completedMatches,
      upcomingMatches,
      ongoingTourneys,
    ] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM tournaments'),
      query('SELECT COUNT(*) AS total FROM teams'),
      query('SELECT COUNT(*) AS total FROM players'),
      query('SELECT COUNT(*) AS total FROM matches'),
      query('SELECT COUNT(*) AS total FROM venues'),
      query('SELECT COUNT(*) AS total FROM referees'),
      query('SELECT COUNT(*) AS total FROM standings'),
      query('SELECT COUNT(*) AS total FROM statistics'),
      query("SELECT COUNT(*) AS cnt FROM matches WHERE status = 'Completed'"),
      query("SELECT COUNT(*) AS cnt FROM matches WHERE status = 'Upcoming'"),
      query("SELECT COUNT(*) AS cnt FROM tournaments WHERE status = 'Ongoing'"),
    ]);

    res.json({
      success: true,
      data: {
        totals: { tournaments, teams, players, matches, venues, referees, standings, statistics },
        highlights: {
          completed_matches:    completedMatches[0].cnt,
          upcoming_matches:     upcomingMatches[0].cnt,
          ongoing_tournaments:  ongoingTourneys[0].cnt,
        },
      },
    });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── SEARCH ──────────────────────────────────────────────────────────────────
app.get('/api/search', async (req, res) => {
  const q = `%${(req.query.q || '').trim()}%`;
  if (q === '%%') return res.json({ success: true, data: [] });

  try {
    const [tournaments, teams, players, venues] = await Promise.all([
      query('SELECT *, "tournament" AS _type FROM tournaments WHERE name LIKE ?', [q]),
      query('SELECT *, "team"       AS _type FROM teams       WHERE name LIKE ?', [q]),
      query('SELECT *, "player"     AS _type FROM players     WHERE name LIKE ?', [q]),
      query('SELECT *, "venue"      AS _type FROM venues      WHERE name LIKE ?', [q]),
    ]);
    const results = [...tournaments, ...teams, ...players, ...venues].slice(0, 20);
    res.json({ success: true, data: results });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── DB HEALTH CHECK ────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ success: true, db: 'tournamentdb', host: 'metro.proxy.rlwy.net', status: 'connected' });
  } catch (e) {
    res.status(503).json({ success: false, error: e.message });
  }
});

// ─── SPA FALLBACK ────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// ─── BOOT ────────────────────────────────────────────────────────────────────
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🏆 TournamentDB running at http://localhost:${PORT}`);
  });
});
