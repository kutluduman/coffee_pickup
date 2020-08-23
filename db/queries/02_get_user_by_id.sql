-- Get a single user from the database given their id.
SELECT id, name, email, password, phone, is_admin
FROM users
WHERE id = 2;
