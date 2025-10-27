# 🧪 RBAC Project Testing Guide

This guide will help you test the complete functionality of the RBAC project, including the new refresh token mechanism.

## 📋 Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rbac
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here
   REFRESH_TOKEN_EXPIRY=7d
   CORS_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

## 🚀 Step-by-Step Testing

### Step 1: Start the Server
```bash
npm run dev
```
You should see: `Server is running at port : 5000`

### Step 2: Seed the Database
```bash
node src/seed/seedRoles.js
```
You should see:
```
Connected to MongoDB
Created permission: User Actions
Created permission: Manage Users
Created permission: Manage Roles
Created role: Admin
Created role: User
Seeding completed!
```

### Step 3: Test the API Endpoints

#### 3.1 Test Server Health
```bash
curl http://localhost:5000/
```
Expected response: `RBAC is running...`

#### 3.2 Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "fullname": "Test User",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "role": "User"
  }
}
```

#### 3.3 Test User Login (with Refresh Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "fullname": "Test User",
    "role": "User"
  }
}
```

**Save the tokens for next steps!**

#### 3.4 Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/rbac-test/user-only \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Expected response:
```json
{
  "message": "Welcome, User"
}
```

#### 3.5 Test Token Refresh
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "new_jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "fullname": "Test User",
    "role": "User"
  }
}
```

#### 3.6 Test Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 3.7 Test Refresh After Logout (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

Expected response:
```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

## 🔧 Using Postman/Insomnia

### Collection Setup
1. Create a new collection called "RBAC API"
2. Set base URL: `http://localhost:5000/api`

### Request Examples

#### 1. Register User
- **Method**: POST
- **URL**: `{{base_url}}/auth/register`
- **Body** (JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "fullname": "Test User",
  "password": "password123"
}
```

#### 2. Login User
- **Method**: POST
- **URL**: `{{base_url}}/auth/login`
- **Body** (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 3. Test Protected Route
- **Method**: GET
- **URL**: `{{base_url}}/rbac-test/user-only`
- **Headers**:
  - `Authorization`: `Bearer {{accessToken}}`

#### 4. Refresh Token
- **Method**: POST
- **URL**: `{{base_url}}/auth/refresh`
- **Body** (JSON):
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

#### 5. Logout
- **Method**: POST
- **URL**: `{{base_url}}/auth/logout`
- **Body** (JSON):
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

## 🧪 Automated Testing Script

Create a test script to verify all functionality:

```javascript
// test-api.js
const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');
  
  // Test 1: Health Check
  console.log('1️⃣ Testing server health...');
  const health = await fetch('http://localhost:5000/');
  console.log('✅ Server is running:', await health.text());
  
  // Test 2: Register User
  console.log('\n2️⃣ Testing user registration...');
  const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      fullname: 'Test User',
      password: 'password123'
    })
  });
  
  if (registerResponse.ok) {
    console.log('✅ User registration successful');
  } else {
    console.log('⚠️ User might already exist');
  }
  
  // Test 3: Login
  console.log('\n3️⃣ Testing user login...');
  const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });
  
  const loginData = await loginResponse.json();
  if (loginData.success) {
    console.log('✅ Login successful');
    console.log('📝 Access Token:', loginData.accessToken.substring(0, 30) + '...');
    console.log('🔄 Refresh Token:', loginData.refreshToken.substring(0, 30) + '...');
    
    // Test 4: Protected Route
    console.log('\n4️⃣ Testing protected route...');
    const protectedResponse = await fetch(`${BASE_URL}/rbac-test/user-only`, {
      headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
    });
    
    if (protectedResponse.ok) {
      const protectedData = await protectedResponse.json();
      console.log('✅ Protected route accessed:', protectedData.message);
    }
    
    // Test 5: Token Refresh
    console.log('\n5️⃣ Testing token refresh...');
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: loginData.refreshToken })
    });
    
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      console.log('✅ Token refresh successful');
      console.log('📝 New Access Token:', refreshData.accessToken.substring(0, 30) + '...');
    }
    
    // Test 6: Logout
    console.log('\n6️⃣ Testing logout...');
    const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: loginData.refreshToken })
    });
    
    if (logoutResponse.ok) {
      console.log('✅ Logout successful');
    }
    
    console.log('\n🎉 All tests completed successfully!');
  } else {
    console.log('❌ Login failed:', loginData.message);
  }
}

testAPI().catch(console.error);
```

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **JWT Secret Error**
   - Ensure JWT_SECRET and REFRESH_TOKEN_SECRET are set in .env

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:5000 | xargs kill -9`

4. **Token Validation Errors**
   - Check if tokens are properly formatted
   - Ensure Authorization header includes "Bearer " prefix

### Debug Mode:
Add this to your .env file for detailed logging:
```env
NODE_ENV=development
DEBUG=true
```

## 📊 Expected Results

✅ **All endpoints should return proper responses**  
✅ **Authentication flow should work seamlessly**  
✅ **Refresh token mechanism should function correctly**  
✅ **Logout should invalidate tokens**  
✅ **Protected routes should require valid tokens**  
✅ **Role-based access should work as expected**

## 🎯 Success Criteria

- [ ] Server starts without errors
- [ ] Database seeding completes successfully
- [ ] User registration works
- [ ] Login returns both access and refresh tokens
- [ ] Protected routes require authentication
- [ ] Token refresh works correctly
- [ ] Logout invalidates refresh token
- [ ] All error cases are handled properly

Happy Testing! 🚀
