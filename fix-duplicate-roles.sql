-- Fix Duplicate Roles in Database
-- Run this in MySQL Workbench

USE testdb_spring;

-- First, check for duplicates
SELECT name, COUNT(*) as count FROM roles GROUP BY name HAVING count > 1;

-- Delete ALL roles (we'll re-insert them correctly)
DELETE FROM roles;

-- Reset auto-increment
ALTER TABLE roles AUTO_INCREMENT = 1;

-- Insert roles with proper handling of duplicates
INSERT INTO roles (name) VALUES ('ROLE_USER')
ON DUPLICATE KEY UPDATE name = 'ROLE_USER';

INSERT INTO roles (name) VALUES ('ROLE_MODERATOR')
ON DUPLICATE KEY UPDATE name = 'ROLE_MODERATOR';

INSERT INTO roles (name) VALUES ('ROLE_ADMIN')
ON DUPLICATE KEY UPDATE name = 'ROLE_ADMIN';

-- Verify the result
SELECT * FROM roles;

-- Expected output:
-- +----+----------------+
-- | id | name           |
-- +----+----------------+
-- |  1 | ROLE_USER      |
-- |  2 | ROLE_MODERATOR |
-- |  3 | ROLE_ADMIN     |
-- +----+----------------+
