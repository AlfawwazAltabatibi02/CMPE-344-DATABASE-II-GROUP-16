#  TournamentDB — Sports Tournament Database Management System

A full-stack web application to manage sports tournaments, teams, players, matches, venues, referees, standings, and awards.

## Stack
- **Frontend**: Vanilla HTML + CSS + JS (industrial dark UI)
- **Backend**: Node.js + Express REST API
- **Database**: NeDB (embedded in-memory/file database)

## 8 Database Tables
| Table | Description |
|-------|-------------|
| Tournaments | Sports tournaments with sport type, dates, prize pools |
| Teams | Participating teams with coaches, W/L/D records |
| Players | Individual athletes with positions, stats, status |
| Matches | Game fixtures with scores, stages, referee assignments |
| Venues | Stadiums and arenas with capacity and surface info |
| Referees | Officials with certifications and match counts |
| Standings | Points tables per tournament |
| Awards | Tournament awards like Golden Boot, MVP |

## Features
-  Full CRUD on all 8 tables (Add, Edit, Delete)
-  Global search across tournaments, teams, players, and venues
-  Column sorting on all tables
-  Live-filter search per table
-  Dashboard with stats overview + live panels
-  REST API with proper JSON responses

## Run It
```bash
npm install
npm start
# Open http://localhost:3000
```
