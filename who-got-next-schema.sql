
CREATE TABLE players (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  photo_url TEXT
);

CREATE TABLE leagues (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT
);

CREATE TABLE teams (
  league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT
);

CREATE TABLE games (
  league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY,
  date DATE,
  team_home_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  team_away_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  final_score_home INTEGER,
  final_score_away INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE player_league (
  player_username VARCHAR(25) REFERENCES players(username) ON DELETE CASCADE,
  league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
  PRIMARY KEY (player_username, league_id),
  player_jersey_number INTEGER,
  player_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  player_is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  player_username VARCHAR(25) REFERENCES players(username) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  minutes_played INTEGER,
  points INTEGER,
  rebounds INTEGER,
  assists INTEGER,
  steals INTEGER,
  blocks INTEGER,
  turnovers INTEGER,
  fouls INTEGER,
  field_goals_made INTEGER,
  field_goals_attempted INTEGER,
  three_point_made INTEGER,
  three_point_attempted INTEGER,
  free_throws_made INTEGER,
  free_throws_attempted INTEGER,
  plus_minus INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CREATE TABLE games (
--   id SERIAL PRIMARY KEY,
--   league_id INTEGER
--     REFERENCES leagues,
--   salary INTEGER CHECK (salary >= 0),
--   equity NUMERIC CHECK (equity <= 1.0),
--   company_handle VARCHAR(25) NOT NULL
--     REFERENCES companies ON DELETE CASCADE
-- );

-- CREATE TABLE stats (
--   player_username VARCHAR(25),
--     REFERENCES users ON DELETE CASCADE,
--   game_id INTEGER
--     REFERENCES jobs ON DELETE CASCADE,
--   PRIMARY KEY (username, job_id)
-- );
