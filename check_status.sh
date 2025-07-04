#!/bin/bash

echo "=== Current Application Status ==="
echo ""

echo "🔧 Backend Status:"
BACKEND_STATUS=$(curl -s http://localhost:5001/api/products 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Backend is running on port 5001"
    echo "   Products available: $(echo $BACKEND_STATUS | jq '.count' 2>/dev/null || echo 'Unable to parse')"
else
    echo "❌ Backend is not responding"
fi

echo ""
echo "🔧 Frontend Status:"
FRONTEND_STATUS=$(curl -s http://localhost:3000 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🧪 Quick API Tests:"
echo ""
echo "1. Products API:"
curl -s http://localhost:5001/api/products | jq '.success, .count' 2>/dev/null || echo "Failed"

echo ""
echo "2. Featured Products API:"
curl -s http://localhost:5001/api/products/featured | jq '.success, .count' 2>/dev/null || echo "Failed"

echo ""
echo "3. Test User Login:"
LOGIN_RESULT=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' 2>/dev/null)

if echo "$LOGIN_RESULT" | jq '.success' 2>/dev/null | grep -q true; then
    echo "✅ User login API working"
    echo "   Role: $(echo $LOGIN_RESULT | jq -r '.user.role')"
else
    echo "❌ User login API failed"
fi

echo ""
echo "4. Test Admin Login:"
ADMIN_LOGIN_RESULT=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}' 2>/dev/null)

if echo "$ADMIN_LOGIN_RESULT" | jq '.success' 2>/dev/null | grep -q true; then
    echo "✅ Admin login API working"
    echo "   Role: $(echo $ADMIN_LOGIN_RESULT | jq -r '.user.role')"
else
    echo "❌ Admin login API failed"
fi

echo ""
echo "📝 Known Issues to Check:"
echo "1. Login redirects - users/admins redirect back to login"
echo "2. Products not showing - empty product lists"
echo ""
echo "🔍 Debugging Steps:"
echo "1. Check browser console at: http://localhost:3000/debug"
echo "2. Test login at: http://localhost:3000/login"
echo "3. Check products at: http://localhost:3000/products"
echo "4. Check home page: http://localhost:3000"
