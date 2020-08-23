-- Get the phone number of the users of all orders ready for pickup.
SELECT orders.id as order_id, users.phone
FROM orders
JOIN users ON (orders.user_id = users.id)
WHERE orders.in_progress = FALSE AND orders.pickup_ready = TRUE
GROUP BY orders.id, users.phone;
