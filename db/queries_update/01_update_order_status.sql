-- update order in_progress from FALSE to TRUE
UPDATE orders
SET in_progress = TRUE
WHERE orders.id = 6
RETURNING *;

-- update order in_progress from TRUE to FALSE, and pickup_ready to TRUE
UPDATE orders
SET in_progress = FALSE,
    pickup_ready = TRUE
WHERE orders.id = 6
RETURNING *;

-- update order pickup_ready from TRUE to FALSE
UPDATE orders
SET pickup_ready = FALSE
WHERE orders.id = 6
RETURNING *;
