-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  in_progress BOOLEAN NOT NULL DEFAULT FALSE,
  time_ordered TIMESTAMP,
  pickup_ready BOOLEAN NOT NULL DEFAULT FALSE
);
