--Get sub_total for each item of a specific orders.id !!
SELECT order_items.id as order_items_id, order_items.order_id, order_items.quantity, menu_items.name, menu_items.price, coffe_sizes.size, TRUNC(menu_items.price * order_items.quantity * coffe_sizes.price_modifier) as sub_item_price
FROM orders
JOIN users ON (orders.user_id = users.id)
JOIN order_items ON (order_items.order_id = orders.id)
JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
WHERE orders.id = 3
GROUP BY order_items.id, orders.id, order_items.quantity, menu_items.name, menu_items.price, coffe_sizes.size, coffe_sizes.price_modifier, order_items.order_id;

-- Get table with all options price for a specific orders.id !!
SELECT order_items.id as order_items_id, orders.id as order_id, options.name as option_name, options.price as option_price
FROM options
JOIN options_items ON (options_items.option_id = options.id)
JOIN order_items ON (order_items.id = options_items.order_item_id)
JOIN orders ON (orders.id = order_items.order_id)
WHERE orders.id = 3
GROUP BY options.id, options.menu_item_id, options.price, options.name, options_items.id, options_items.order_item_id, order_items.id, orders.id;

-- union the two table above by UNION https://www.postgresqltutorial.com/postgresql-grouping-sets/ not DONE YET
SELECT order_items.id as order_items_id, order_items.order_id, order_items.quantity, menu_items.name, menu_items.price, coffe_sizes.size, TRUNC(menu_items.price * order_items.quantity * coffe_sizes.price_modifier) as sub_item_price
FROM orders
JOIN users ON (orders.user_id = users.id)
JOIN order_items ON (order_items.order_id = orders.id)
JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
WHERE orders.id = 3
GROUP BY order_items.id, orders.id, order_items.quantity, menu_items.name, menu_items.price, coffe_sizes.size, coffe_sizes.price_modifier, order_items.order_id





-- Be low Commands used for test purpose only
-- Qty 1 Espresso large
-- INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 3, 1, 0, 1);
-- INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 3, 1, 0, 1);
-- INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 3, 2, 0, 2);
-- INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 4, 2, 0, 2);
-- INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 4, 2, 0, 2);
-- INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES (3, 5, 2, 0, 1);
-- INSERT INTO options_items (option_id, order_item_id, price) VALUES (5, 10, 33);

-- DELETE FROM options_items
-- WHERE id = 3
-- RETURNING *;
