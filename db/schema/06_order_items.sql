-- Drop and recreate order_items table

DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity SMALLINT NOT NULL DEFAULT 0,
  price INTEGER  NOT NULL DEFAULT 0,
  size_id INTEGER REFERENCES coffe_sizes(id) ON DELETE CASCADE,
);
