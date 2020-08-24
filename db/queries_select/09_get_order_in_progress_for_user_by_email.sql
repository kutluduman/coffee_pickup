-- Get all orders in progress from database for a specific user by email.
SELECT orders.id as order_id, users.email
FROM orders
JOIN users ON (orders.user_id = users.id)
JOIN order_items ON (order_items.order_id = orders.id)
JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE AND email = 'lera_hahn@dickens.org'
GROUP BY users.email, orders.id;
