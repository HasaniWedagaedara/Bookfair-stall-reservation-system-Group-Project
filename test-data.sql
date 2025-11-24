-- SQL Script to add test data to Bookfair database
-- Run this in pgAdmin or psql

-- Insert test user
INSERT INTO users (id, email, name, password, role, "businessName", "mobileNumber", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'testuser@example.com',
  'Test User',
  '$2b$10$YIjlrWxWsvxQXjVu5.5fB.5t8kPq8J8k8k8k8k8k8k8k8k8k8k8k',  -- bcrypt hash of "Password123!"
  'user',
  'Test Business',
  '+1234567890',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Verify user was inserted
SELECT id, email, name FROM users WHERE email = 'testuser@example.com';

-- Insert test stall
INSERT INTO stalls (id, name, size, location, dimensions, price, "idealFor", features, status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Test Stall Premium',
  'Large',
  'Section A - Premium',
  '10m x 15m',
  5000,
  'Publishers & Distributors',
  'Premium location, High foot traffic, Multiple entry points',
  'AVAILABLE',
  NOW(),
  NOW()
) ON CONFLICT (name) DO NOTHING;

-- Verify stall was inserted
SELECT id, name, size, price FROM stalls WHERE name = 'Test Stall Premium' LIMIT 1;

-- Now you can create a reservation using the test data:
-- 1. Get user ID: SELECT id FROM users WHERE email = 'testuser@example.com';
-- 2. Get stall ID: SELECT id FROM stalls WHERE name = 'Test Stall Premium';
-- 3. Insert reservation with those IDs
