-- orders table seeds here
INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES (2, FALSE, NOW()::timestamp, FALSE);
INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES (3, FALSE, NOW()::timestamp, FALSE);
INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES (1, TRUE, NOW()::timestamp, FALSE);
INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES (4, TRUE, NOW()::timestamp, FALSE);
INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES (2, FALSE, NOW()::timestamp, TRUE);
INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES (3, FALSE, NOW()::timestamp, FALSE);
INSERT INTO orders (user_id, in_progress, time_ordered, pickup_ready) VALUES (3, FALSE, NOW()::timestamp, FALSE);
