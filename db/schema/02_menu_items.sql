-- Drop and recreate menu_items table

DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  price INTEGER  NOT NULL DEFAULT 0,
  picture_url VARCHAR(255) NOT NULL,
  prep_time INTEGER  NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  category VARCHAR(255) NOT NULL
);
