-- Get total prep_time of the orders in progress from database.
SELECT SUM(t.sub_prep_time)
FROM (SELECT orders.id as order_id, order_items.quantity, menu_items.name, menu_items.prep_time, menu_items.prep_time * order_items.quantity as sub_prep_time
      FROM orders
      JOIN users ON (orders.user_id = users.id)
      JOIN order_items ON (order_items.order_id = orders.id)
      JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
      WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
      GROUP BY orders.id, order_items.quantity, menu_items.name, menu_items.prep_time) as t;

--Get prep_time for each item and each orders in progress
SELECT orders.id as order_id, order_items.quantity, menu_items.name, menu_items.prep_time, menu_items.prep_time * order_items.quantity as sub_prep_time
FROM orders
JOIN users ON (orders.user_id = users.id)
JOIN order_items ON (order_items.order_id = orders.id)
JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
GROUP BY orders.id, order_items.quantity, menu_items.name, menu_items.prep_time;
