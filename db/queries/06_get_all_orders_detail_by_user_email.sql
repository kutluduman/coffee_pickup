-- Get all orders detail by user from database given user email.
SELECT users.email, orders.id as order_id, order_items.quantity, menu_items.name, coffe_sizes.size
FROM orders
JOIN users ON (orders.user_id = users.id)
JOIN order_items ON (order_items.order_id = orders.id)
JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
WHERE users.email = 'JJ_song@yaoo.com'
GROUP BY users.email, orders.id, order_items.quantity, menu_items.name, coffe_sizes.size;
