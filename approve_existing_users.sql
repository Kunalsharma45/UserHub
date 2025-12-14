-- User Approval Feature - Database Update Script
-- Run this ONCE after implementing the approval feature

-- Step 1: Check current users (before update)
SELECT id, username, email, approved 
FROM users;

-- Step 2: Approve ALL existing users (recommended)
UPDATE users 
SET approved = true;

-- Alternative: Approve only admin users
-- UPDATE users u
-- INNER JOIN user_roles ur ON u.id = ur.user_id
-- INNER JOIN roles r ON ur.role_id = r.id
-- SET u.approved = true
-- WHERE r.name = 'ROLE_ADMIN';

-- Step 3: Verify the update
SELECT id, username, email, approved 
FROM users;

-- Expected result: All users should have approved = 1 (true)
