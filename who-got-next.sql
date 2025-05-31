\echo 'Delete and recreate who_got_next db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE who_got_next;
CREATE DATABASE who_got_next;
\connect who_got_next

\i who-got-next-schema.sql
\i who-got-next-seed.sql

\echo 'Delete and recreate who-got_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE who_got_next_test;
CREATE DATABASE who_got_next_test;
\connect who_got_next_test

\i who-got-next-schema.sql