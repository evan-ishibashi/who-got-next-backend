-- CREATE TABLE leagues (
--   id SERIAL PRIMARY KEY,
--   name TEXT UNIQUE NOT NULL,
--   players INTEGER CHECK (num_employees >= 0),
--   description TEXT NOT NULL,
--   logo_url TEXT,
--   owner VARCHAR(25) NOT NULL
--     REFERENCES players ON DELETE CASCADE
-- );

CREATE TABLE players (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  photo_url TEXT,
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
