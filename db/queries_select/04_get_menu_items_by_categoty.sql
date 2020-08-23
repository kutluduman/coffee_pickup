-- Get all menu_items from the database given their category.
SELECT id, name, price, picture_url, prep_time, description, in_stock, category
FROM menu_items
WHERE category = 'Coffee';
