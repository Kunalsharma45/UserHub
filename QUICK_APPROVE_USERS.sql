-- QUICK START: Run this in MySQL Workbench or command line

USE testdb_spring;

-- Approve all existing users
UPDATE users SET approved = true;

-- Verify
SELECT id, username, email, approved FROM users;
