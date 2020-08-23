-- Drop and recreate coffe_sizes table

DROP TABLE IF EXISTS coffe_sizes CASCADE;

CREATE TABLE coffe_sizes (
  id SERIAL PRIMARY KEY NOT NULL,
  size VARCHAR(255) NOT NULL,
  price_modifier REAL
);
