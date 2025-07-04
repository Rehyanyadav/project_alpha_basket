#!/bin/bash

# Ecommerce API Test Script
echo "🚀 Testing Ecommerce Backend API"
echo "================================="

BASE_URL="http://localhost:5000/api"

# Test health endpoint
echo "1. Testing Health Endpoint..."
curl -s "${BASE_URL%/api}/health" | jq '.' || echo "Health check failed"

echo -e "\n2. Testing Categories Endpoint..."
curl -s "$BASE_URL/categories" | jq '.' || echo "Categories endpoint failed"

echo -e "\n3. Testing Products Endpoint..."
curl -s "$BASE_URL/products" | jq '.' || echo "Products endpoint failed"

echo -e "\n4. Testing User Registration..."
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "password123"
  }' | jq '.' || echo "Registration failed"

echo -e "\n✅ API tests completed!"
echo "If you see JSON responses above, the API is working correctly."
echo "Note: Some endpoints may show empty arrays since no data has been added yet."
