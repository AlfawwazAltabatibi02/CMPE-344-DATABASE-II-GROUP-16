/* ═══════════════════════════════════════════════════
   TournamentDB — Frontend Application (MySQL Edition)
   ═══════════════════════════════════════════════════ */

const API = '/api';

// ─── PK MAP ──────────────────────────────────────────────────────────────────
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

// ─── TABLE SCHEMAS ───────────────────────────────────────────────────────────
const SCHEMAS = {
  tournaments: {
    label: 'Tournaments',
    icon: '🏆',
    fields: [
      { key: 'tournament_id', label: 'ID',           type: 'text' },
      { key: 'name',          label: 'Name',         type: 'text',   required: true },
      { key: 'start_date',    label: 'Start Date',   type: 'date' },
      { key: 'end_date',      label: 'End Date',     type: 'date' },
      { key: 'venue_id',      label: 'Venue ID',     type: 'text' },
      { key: 'status',        label: 'Status',       type: 'select', options: ['Upcoming','Ongoing','Completed'] },
      { key: 'prize_pool',    label: 'Prize Pool ($)',type: 'number' },
    ],
    cols: ['tournament_id','name','start_date','end_date','status','prize_pool'],
    colLabels: ['ID','Name','Start','End','Status','Prize Pool'],
  },
  teams: {
    label: 'Teams',
    icon: '🛡',
    fields: [
      { key: 'team_id',       label: 'ID',           type: 'text' },
      { key: 'name',          label: 'Team Name',    type: 'text', required: true },
      { key: 'tournament_id', label: 'Tournament ID',type: 'text' },
      { key: 'coach',         label: 'Head Coach',   type: 'text' },
      { key: 'country',       label: 'Country',      type: 'text' },
      { key: 'wins',          label: 'Wins',         type: 'number' },
      { key: 'losses',        label: 'Losses',       type: 'number' },
      { key: 'draws',         label: 'Draws',        type: 'number' },
    ],
    cols: ['team_id','name','country','coach','wins','losses','draws'],
    colLabels: ['ID','Team','Country','Coach','W','L','D'],
  },
  players: {
    label: 'Players',
    icon: '👤',
    fields: [
      { key: 'player_id',   label: 'ID',          type: 'text' },
      { key: 'name',        label: 'Full Name',   type: 'text', required: true },
      { key: 'team_id',     label: 'Team ID',     type: 'text' },
      { key: 'position',    label: 'Position',    type: 'select', options: ['Forward','Midfielder','Defender','Goalkeeper','Guard','Center'] },
      { key: 'nationality', label: 'Nationality', type: 'text' },
      { key: 'age',         label: 'Age',         type: 'number' },
      { key: 'jersey',      label: 'Jersey #',    type: 'number' },
      { key: 'goals',       label: 'Goals',       type: 'number' },
      { key: 'assists',     label: 'Assists',     type: 'number' },
      { key: 'status',      label: 'Status',      type: 'select', options: ['Active','Injured','Suspended','Retired'] },
    ],
    cols: ['player_id','name','position','nationality','age','jersey','goals','assists','status'],
    colLabels: ['ID','Name','Position','Nationality','Age','#','Goals','Assists','Status'],
  },
  matches: {
    label: 'Matches',
    icon: '⚡',
    fields: [
      { key: 'match_id',      label: 'ID',            type: 'text' },
      { key: 'tournament_id', label: 'Tournament ID', type: 'text' },
      { key: 'home_team_id',  label: 'Home Team ID',  type: 'text' },
      { key: 'away_team_id',  label: 'Away Team ID',  type: 'text' },
      { key: 'venue_id',      label: 'Venue ID',      type: 'text' },
      { key: 'referee_id',    label: 'Referee ID',    type: 'text' },
      { key: 'match_date',    label: 'Match Date',    type: 'date' },
      { key: 'stage',         label: 'Stage',         type: 'select', options: ['Group Stage','Round of 16','Quarter-Final','Semi-Final','Final','Play-off'] },
      { key: 'home_score',    label: 'Home Score',    type: 'number' },
      { key: 'away_score',    label: 'Away Score',    type: 'number' },
      { key: 'status',        label: 'Status',        type: 'select', options: ['Upcoming','Live','Completed','Postponed'] },
    ],
    cols: ['match_id','match_date','stage','home_team_id','away_team_id','home_score','away_score','status'],
    colLabels: ['ID','Date','Stage','Home','Away','H','A','Status'],
  },
  venues: {
    label: 'Venues',
    icon: '🏟',
    fields: [
      { key: 'venue_id', label: 'ID',          type: 'text' },
      { key: 'name',     label: 'Venue Name',  type: 'text', required: true },
      { key: 'city',     label: 'City',        type: 'text' },
      { key: 'country',  label: 'Country',     type: 'text' },
      { key: 'capacity', label: 'Capacity',    type: 'number' },
      { key: 'surface',  label: 'Surface',     type: 'select', options: ['Grass','Artificial Turf','Hardwood','Clay','Concrete','Sand'] },
    ],
    cols: ['venue_id','name','city','country','capacity','surface'],
    colLabels: ['ID','Name','City','Country','Capacity','Surface'],
  },
  referees: {
    label: 'Referees',
    icon: '🟨',
    fields: [
      { key: 'referee_id',          label: 'ID',                  type: 'text' },
      { key: 'name',                label: 'Full Name',           type: 'text', required: true },
      { key: 'nationality',         label: 'Nationality',         type: 'text' },
      { key: 'experience_yrs',      label: 'Experience (yrs)',    type: 'number' },
      { key: 'matches_officiated',  label: 'Matches Officiated',  type: 'number' },
    ],
    cols: ['referee_id','name','nationality','experience_yrs','matches_officiated'],
    colLabels: ['ID','Name','Nationality','Experience','Matches'],
  },
  standings: {
    label: 'Standings',
    icon: '📊',
    fields: [
      { key: 'standing_id',   label: 'ID',           type: 'text' },
      { key: 'tournament_id', label: 'Tournament ID',type: 'text' },
      { key: 'team_id',       label: 'Team ID',      type: 'text' },
      { key: 'position',      label: 'Position',     type: 'number' },
      { key: 'played',        label: 'Played',       type: 'number' },
      { key: 'won',           label: 'Won',          type: 'number' },
      { key: 'drawn',         label: 'Drawn',        type: 'number' },
      { key: 'lost',          label: 'Lost',         type: 'number' },
      { key: 'goals_for',     label: 'Goals For',    type: 'number' },
      { key: 'goals_against', label: 'Goals Against',type: 'number' },
      { key: 'points',        label: 'Points',       type: 'number' },
    ],
    cols: ['standing_id','tournament_id','team_id','position','played','won','drawn','lost','goals_for','goals_against','points'],
    colLabels: ['ID','Tournament','Team','Pos','P','W','D','L','GF','GA','Pts'],
  },
  statistics: {
    label: 'Statistics',
    icon: '📈',
    fields: [
      { key: 'stat_id',       label: 'ID',             type: 'text' },
      { key: 'match_id',      label: 'Match ID',       type: 'text' },
      { key: 'player_id',     label: 'Player ID',      type: 'text' },
      { key: 'goals',         label: 'Goals',          type: 'number' },
      { key: 'assists',       label: 'Assists',        type: 'number' },
      { key: 'minutes_played',label: 'Minutes Played', type: 'number' },
    ],
    cols: ['stat_id','match_id','player_id','goals','assists','minutes_played'],
    colLabels: ['ID','Match','Player','Goals','Assists','Minutes'],
  },
};

const TABLE_ORDER = ['tournaments','teams','players','matches','venues','referees','standings','statistics'];
const STAT_META = [
  { key:'tournaments', icon:'🏆', label:'Tournaments', cls:'c0' },
  { key:'teams',       icon:'🛡', label:'Teams',       cls:'c1' },
  { key:'players',     icon:'👤', label:'Players',     cls:'c2' },
  { key:'matches',     icon:'⚡', label:'Matches',     cls:'c3' },
  { key:'venues',      icon:'🏟', label:'Venues',      cls:'c4' },
  { key:'referees',    icon:'🟨', label:'Referees',    cls:'c5' },
  { key:'standings',   icon:'📊', label:'Standings',   cls:'c6' },
  { key:'statistics',  icon:'📈', label:'Statistics',  cls:'c7' },
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let currentView = 'dashboard';
let currentTable = null;
let tableData = {};
let filteredData = {};
let sortState = {};
let pendingDeleteId = null;
let pendingDeleteTable = null;
let editingId = null;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  return res.json();
}

function getRowId(table, row) {
  return row[PK[table]];
}

function fmt(val, key) {
  if (val === null || val === undefined || val === '') return '<span style="color:var(--text-muted)">—</span>';
  if (['prize_pool','value'].includes(key)) {
    return `<span class="money">$${Number(val).toLocaleString()}</span>`;
  }
  if (key === 'capacity') return Number(val).toLocaleString();
  if (key === 'status') return statusBadge(val);
  return val;
}

function statusBadge(s) {
  const map = {
    'Completed': 'badge-green', 'Active': 'badge-green',
    'Ongoing':   'badge-yellow', 'Live': 'badge-yellow', 'Upcoming': 'badge-blue',
    'Cancelled': 'badge-red',   'Suspended': 'badge-red', 'Injured': 'badge-red',
    'Postponed': 'badge-gray',  'Retired': 'badge-gray',
  };
  return `<span class="badge ${map[s] || 'badge-gray'}">${s}</span>`;
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = 'toast hidden', 3000);
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function setView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const viewEl = document.getElementById(`view-${view}`);
  if (viewEl) viewEl.classList.add('active');

  const navEl = document.querySelector(`[data-view="${view}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = { dashboard: 'Dashboard', ...Object.fromEntries(TABLE_ORDER.map(t => [t, SCHEMAS[t].label])) };
  document.getElementById('pageTitle').textContent = titles[view] || view;

  const addBtn = document.getElementById('addRecordBtn');
  if (TABLE_ORDER.includes(view)) {
    currentTable = view;
    addBtn.style.display = '';
    loadTable(view);
  } else {
    currentTable = null;
    addBtn.style.display = 'none';
    if (view === 'dashboard') loadDashboard();
  }
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
async function loadDashboard() {
  const res = await apiFetch(`${API}/stats`);
  if (!res.success) {
    document.getElementById('statsGrid').innerHTML = '<p style="color:var(--text-dim);padding:1rem">Failed to load stats. Is the server running?</p>';
    return;
  }
  const { totals, highlights } = res.data;

  const grid = document.getElementById('statsGrid');
  grid.innerHTML = STAT_META.map(m => `
    <div class="stat-card ${m.cls}">
      <span class="stat-icon">${m.icon}</span>
      <div class="stat-val">${totals[m.key] ?? 0}</div>
      <div class="stat-label">${m.label}</div>
    </div>
  `).join('') + `
    <div class="stat-card c3">
      <span class="stat-icon">✅</span>
      <div class="stat-val">${highlights.completed_matches}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat-card c1">
      <span class="stat-icon">🔴</span>
      <div class="stat-val">${highlights.ongoing_tournaments}</div>
      <div class="stat-label">Ongoing</div>
    </div>
  `;

  // Recent matches
  const matchRes = await apiFetch(`${API}/matches`);
  const matches  = (matchRes.data || []).slice(-5).reverse();
  document.getElementById('recentMatches').innerHTML = matches.length
    ? matches.map(m => `
      <div class="panel-row">
        <div>
          <div class="pr-name">${m.stage || 'Match'}</div>
          <div class="pr-meta">${m.match_date || '—'} · ${m.home_score ?? '?'} – ${m.away_score ?? '?'}</div>
        </div>
        ${statusBadge(m.status || 'Unknown')}
      </div>`).join('')
    : '<div class="empty-state"><p>No matches yet</p></div>';

  // Active tournaments
  const tRes = await apiFetch(`${API}/tournaments`);
  const tours = (tRes.data || []).filter(t => t.status !== 'Completed');
  document.getElementById('activeTournaments').innerHTML = tours.length
    ? tours.map(t => `
      <div class="panel-row">
        <div>
          <div class="pr-name">${t.name}</div>
          <div class="pr-meta">${t.start_date || '—'} → ${t.end_date || '—'}</div>
        </div>
        ${statusBadge(t.status)}
      </div>`).join('')
    : '<div class="empty-state"><p>No active tournaments</p></div>';
}

// ─── TABLE VIEW ──────────────────────────────────────────────────────────────
async function loadTable(table) {
  const schema = SCHEMAS[table];
  const container = document.getElementById(`view-${table}`);
  container.innerHTML = `
    <div class="table-toolbar">
      <input class="table-search" id="search-${table}" placeholder="Filter ${schema.label.toLowerCase()}…" type="text"/>
      <span class="row-count" id="rowCount-${table}">Loading…</span>
    </div>
    <div class="table-wrap">
      <table class="data-table" id="tbl-${table}">
        <thead>
          <tr>
            <th style="width:36px">#</th>
            ${schema.cols.map((c,i) => `<th data-col="${c}" data-table="${table}">${schema.colLabels[i]}</th>`).join('')}
            <th style="width:90px">Actions</th>
          </tr>
        </thead>
        <tbody id="tbody-${table}"></tbody>
      </table>
    </div>
  `;

  document.getElementById(`search-${table}`).addEventListener('input', e => {
    filterTable(table, e.target.value);
  });

  container.querySelectorAll('th[data-col]').forEach(th => {
    th.addEventListener('click', () => sortTable(table, th.dataset.col));
  });

  const res = await apiFetch(`${API}/${table}`);
  tableData[table] = res.data || [];
  filteredData[table] = [...tableData[table]];
  renderTableBody(table);
}

function renderTableBody(table) {
  const schema = SCHEMAS[table];
  const rows   = filteredData[table] || [];
  const tbody  = document.getElementById(`tbody-${table}`);
  const count  = document.getElementById(`rowCount-${table}`);
  if (count) count.textContent = `${rows.length} record${rows.length !== 1 ? 's' : ''}`;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${schema.cols.length + 2}" style="text-align:center;padding:48px 0">
      <div class="empty-state"><div class="empty-icon">🗄️</div><p>No records found</p></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((row, i) => {
    const rowId = getRowId(table, row);
    return `
    <tr>
      <td class="id-cell">${i + 1}</td>
      ${schema.cols.map(c => `<td title="${row[c] ?? ''}">${fmt(row[c], c)}</td>`).join('')}
      <td>
        <div class="actions-cell">
          <button class="btn-icon" onclick="openEditModal('${table}','${rowId}')">✏️</button>
          <button class="btn-icon del" onclick="openDeleteConfirm('${table}','${rowId}')">🗑</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterTable(table, q) {
  const lower = q.toLowerCase();
  filteredData[table] = tableData[table].filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(lower))
  );
  renderTableBody(table);
}

function sortTable(table, col) {
  const st = sortState[table] || { col: null, dir: 1 };
  const dir = st.col === col ? -st.dir : 1;
  sortState[table] = { col, dir };
  filteredData[table].sort((a, b) => {
    const av = a[col] ?? '', bv = b[col] ?? '';
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
  renderTableBody(table);

  document.querySelectorAll(`#tbl-${table} th`).forEach(th => th.classList.remove('sorted'));
  const th = document.querySelector(`#tbl-${table} th[data-col="${col}"]`);
  if (th) th.classList.add('sorted');
}

// ─── MODALS ──────────────────────────────────────────────────────────────────
function openAddModal(table) {
  table = table || currentTable;
  if (!table) return;
  editingId = null;
  const schema = SCHEMAS[table];
  document.getElementById('modalTitle').textContent = `Add ${schema.label.replace(/s$/, '')}`;
  buildForm(table, null);
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function openEditModal(table, id) {
  const pk = PK[table];
  const row = (tableData[table] || []).find(r => String(r[pk]) === String(id));
  if (!row) return;
  editingId = id;
  const schema = SCHEMAS[table];
  document.getElementById('modalTitle').textContent = `Edit ${schema.label.replace(/s$/, '')}`;
  buildForm(table, row);
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function buildForm(table, data) {
  const schema = SCHEMAS[table];
  const body   = document.getElementById('modalBody');
  body.innerHTML = `<div class="form-grid">${schema.fields.map(f => {
    const val = data ? (data[f.key] ?? '') : '';
    const req  = f.required ? 'required' : '';
    let input;
    if (f.type === 'select') {
      input = `<select class="form-control" id="field-${f.key}" ${req}>
        <option value="">— Select —</option>
        ${f.options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}
      </select>`;
    } else {
      input = `<input class="form-control" id="field-${f.key}" type="${f.type}" value="${val}" ${req} />`;
    }
    return `<div class="form-group">
      <label class="form-label">${f.label}</label>
      ${input}
    </div>`;
  }).join('')}</div>`;

  body.dataset.table = table;
}

async function saveModal() {
  const body  = document.getElementById('modalBody');
  const table = body.dataset.table;
  const schema = SCHEMAS[table];
  const payload = {};
  for (const f of schema.fields) {
    const el = document.getElementById(`field-${f.key}`);
    if (!el) continue;
    let val = el.value.trim();
    if (f.type === 'number' && val !== '') val = Number(val);
    if (val !== '') payload[f.key] = val;
  }

  let res;
  if (editingId) {
    res = await apiFetch(`${API}/${table}/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
  } else {
    res = await apiFetch(`${API}/${table}`, { method: 'POST', body: JSON.stringify(payload) });
  }

  if (res.success) {
    closeModal();
    showToast(editingId ? 'Record updated ✓' : 'Record created ✓');
    await loadTable(table);
  } else {
    showToast('Error: ' + res.error, 'error');
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  editingId = null;
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
function openDeleteConfirm(table, id) {
  pendingDeleteTable = table;
  pendingDeleteId    = id;
  document.getElementById('confirmOverlay').classList.remove('hidden');
}

async function confirmDelete() {
  if (!pendingDeleteId || !pendingDeleteTable) return;
  const res = await apiFetch(`${API}/${pendingDeleteTable}/${pendingDeleteId}`, { method: 'DELETE' });
  document.getElementById('confirmOverlay').classList.add('hidden');
  if (res.success) {
    showToast('Record deleted');
    await loadTable(pendingDeleteTable);
  } else {
    showToast('Delete failed: ' + res.error, 'error');
  }
  pendingDeleteId = pendingDeleteTable = null;
}

// ─── GLOBAL SEARCH ───────────────────────────────────────────────────────────
let searchTimer;
document.getElementById('globalSearch').addEventListener('input', e => {
  clearTimeout(searchTimer);
  const q = e.target.value.trim();
  const dd = document.getElementById('searchResults');
  if (!q) { dd.classList.add('hidden'); return; }
  searchTimer = setTimeout(async () => {
    const res = await apiFetch(`${API}/search?q=${encodeURIComponent(q)}`);
    const items = res.data || [];
    if (!items.length) { dd.innerHTML = '<div class="search-item"><span class="pr-meta">No results</span></div>'; }
    else {
      dd.innerHTML = items.map(r => `
        <div class="search-item" onclick="goToRecord('${r._type}','${r[PK[r._type + 's']] || ''}')">
          <span class="search-badge">${r._type}</span>
          <span>${r.name || r[PK[r._type + 's']]}</span>
        </div>`).join('');
    }
    dd.classList.remove('hidden');
  }, 300);
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) {
    document.getElementById('searchResults').classList.add('hidden');
  }
});

function goToRecord(type, id) {
  document.getElementById('globalSearch').value = '';
  document.getElementById('searchResults').classList.add('hidden');
  setView(type + 's');
}

// ─── EVENT LISTENERS ─────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    setView(item.dataset.view);
    if (window.innerWidth < 640) document.getElementById('sidebar').classList.remove('open');
  });
});

document.getElementById('addRecordBtn').addEventListener('click', () => openAddModal());
document.getElementById('modalSave').addEventListener('click', saveModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
document.getElementById('confirmClose').addEventListener('click', () => document.getElementById('confirmOverlay').classList.add('hidden'));
document.getElementById('confirmCancel').addEventListener('click', () => document.getElementById('confirmOverlay').classList.add('hidden'));
document.getElementById('confirmOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) document.getElementById('confirmOverlay').classList.add('hidden'); });

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ─── INIT ────────────────────────────────────────────────────────────────────
loadDashboard();
