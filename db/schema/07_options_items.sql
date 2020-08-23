-- Drop and recreate options_items table

DROP TABLE IF EXISTS options_items CASCADE;

CREATE TABLE options_items (
  id SERIAL PRIMARY KEY NOT NULL,
  option_id INTEGER REFERENCES options(id) ON DELETE CASCADE,
  order_item_id INTEGER REFERENCES order_items(id) ON DELETE CASCADE,
  price INTEGER  NOT NULL DEFAULT 0
);
