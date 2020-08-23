-- Get a single user from the database given their email.
SELECT id, name, email, password, phone, is_admin
FROM users
WHERE email = 'lera_hahn@dickens.org';
