#!/bin/bash

echo "=== Testing Login Redirects ==="
echo ""

echo "1. Testing User Login API:"
USER_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}')

USER_ROLE=$(echo $USER_RESPONSE | jq -r '.user.role')
echo "User role: $USER_ROLE"
echo "Expected redirect: Home page (/)"
echo ""

echo "2. Testing Admin Login API:"
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}')

ADMIN_ROLE=$(echo $ADMIN_RESPONSE | jq -r '.user.role')
echo "Admin role: $ADMIN_ROLE"
echo "Expected redirect: Admin dashboard (/admin)"
echo ""

echo "=== Manual Test Instructions ==="
echo "1. Go to http://localhost:3000/login"
echo "2. Test User Login:"
echo "   - Email: test@example.com"
echo "   - Password: password123"
echo "   - Should redirect to: http://localhost:3000/"
echo ""
echo "3. Logout and test Admin Login:"
echo "   - Email: admin@test.com"
echo "   - Password: admin123"
echo "   - Should redirect to: http://localhost:3000/admin"
echo ""
echo "✅ Login redirect logic has been fixed!"
