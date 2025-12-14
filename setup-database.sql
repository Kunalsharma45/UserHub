-- Database Setup Script for User Management System
-- Run this in MySQL Workbench or your MySQL client

-- Create database
CREATE DATABASE IF NOT EXISTS testdb_spring;

-- Use the database
USE testdb_spring;

-- Insert default roles (REQUIRED for the application to work)
-- These will be automatically linked to an 'id' starting from 1
INSERT INTO roles(name) VALUES('ROLE_USER') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles(name) VALUES('ROLE_MODERATOR') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON DUPLICATE KEY UPDATE name=name;

-- Verify roles are inserted
SELECT * FROM roles;

-- Show all tables
SHOW TABLES;

-- Optional: View the schema
-- DESCRIBE users;
-- DESCRIBE roles;
-- DESCRIBE user_roles;
