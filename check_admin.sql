-- Check for existing users and their roles
SELECT 
    u.id,
    u.username,
    u.email,
    GROUP_CONCAT(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.username, u.email;

-- Check what roles exist
SELECT * FROM roles;
