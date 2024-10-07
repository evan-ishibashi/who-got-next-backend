\echo 'Delete and recreate who-got-next db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE who-got-next;
CREATE DATABASE who-got-next;
\connect who-got-next

\i who-got-next-schema.sql
\i who-got-next-seed.sql

\echo 'Delete and recreate who-got_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE who-got-next_test;
CREATE DATABASE who-got-next_test;
\connect who-got-next_test

\i who-got-next-schema.sql