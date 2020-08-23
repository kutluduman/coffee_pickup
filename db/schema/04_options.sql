-- Drop and recreate options table

DROP TABLE IF EXISTS options CASCADE;

CREATE TABLE options (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
  price INTEGER  NOT NULL DEFAULT 0
);
