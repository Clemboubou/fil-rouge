-- QuizMaster Database Initialization Script
-- This script sets up the initial database structure and basic configuration

-- Ensure we're using the correct database
USE quizmaster_db;

-- Set charset and collation for better Unicode support
ALTER DATABASE quizmaster_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create initial admin user (will be handled by seed script instead)
-- This file serves as a placeholder for any initial SQL setup if needed

-- Log initialization
SELECT 'QuizMaster database initialized successfully' as message;