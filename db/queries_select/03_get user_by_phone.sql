-- Get a single user from the database given their phone.
SELECT id, name, email, password, phone, is_admin
FROM users
WHERE phone = '4561238855';
