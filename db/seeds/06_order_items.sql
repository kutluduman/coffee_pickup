-- order_items table seeds here

-- Is the price in this table like a subtotal?
-- The way it calculates the price base on the size introduce a decimal digit.
--Is it ok to to eliminate it with js?

-- Qty 2 Americano small
INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (1, 1, 2, 352, 1);
-- Qty 1 Americano small
INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (2, 1, 1, 176, 1);
-- qty 1 Plain donut
INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (2, 4, 1, 567, 1);
-- qty 1 Cappuccino medium
INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 2, 1, 461, 2);
-- Qty 1 Espresso large
INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 3, 1, 460, 3);
-- Qty 1 Chocolate muffin
INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (4, 5, 1, 741, 1);
-- Qty 2 Plain donut
INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (4, 4, 2, 1152, 1);
