-- Get all options from the database given a menu_items id.
SELECT id, name, menu_item_id, price
FROM options
WHERE menu_item_id = 1;
