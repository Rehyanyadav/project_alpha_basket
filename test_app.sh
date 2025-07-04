#!/bin/bash

echo "=== Testing E-commerce Backend & Frontend ==="
echo ""

# Test backend endpoints
echo "1. Testing Backend Endpoints..."
echo ""

# Test products
echo "Testing /api/products:"
curl -s http://localhost:5001/api/products | jq '.success, .count, .data[0].name' 2>/dev/null || echo "❌ Products endpoint failed"
echo ""

# Test featured products
echo "Testing /api/products/featured:"
curl -s http://localhost:5001/api/products/featured | jq '.success, .count, .data[0].name' 2>/dev/null || echo "❌ Featured products endpoint failed"
echo ""

# Test categories
echo "Testing /api/categories:"
curl -s http://localhost:5001/api/categories | jq '.success, .count, .data[0].name' 2>/dev/null || echo "❌ Categories endpoint failed"
echo ""

# Test user login
echo "Testing user login:"
curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' | jq '.success, .user.email' 2>/dev/null || echo "❌ User login failed"
echo ""

# Test admin login
echo "Testing admin login:"
curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}' | jq '.success, .user.email, .user.role' 2>/dev/null || echo "❌ Admin login failed"
echo ""

echo "=== Backend Tests Complete ==="
echo ""

echo "2. Frontend should be running on http://localhost:3000"
echo "3. Admin login: admin@test.com / admin123"
echo "4. User login: test@example.com / password123" 
echo ""

echo "=== Manual Tests to Perform ==="
echo "- Visit http://localhost:3000 (should show home page with featured products)"
echo "- Visit http://localhost:3000/products (should show products list)"
echo "- Visit http://localhost:3000/login (test user and admin login)"
echo "- Visit http://localhost:3000/admin/products (after admin login)"
echo "- Visit http://localhost:3000/debug (for debugging)"
echo ""
