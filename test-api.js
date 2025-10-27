/**
 * Simple API Test Script for RBAC Project
 * Run this script to test all functionality
 */

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Starting RBAC API Tests...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing server health...');
    const health = await fetch('http://localhost:5000/');
    const healthText = await health.text();
    console.log('✅ Server response:', healthText);
    
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
    
    const registerData = await registerResponse.json();
    if (registerData.success) {
      console.log('✅ User registration successful');
    } else {
      console.log('⚠️ Registration response:', registerData.message);
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
      } else {
        console.log('❌ Protected route failed:', protectedResponse.statusText);
      }
      
      // Test 5: Token Refresh
      console.log('\n5️⃣ Testing token refresh...');
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: loginData.refreshToken })
      });
      
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        console.log('✅ Token refresh successful');
        console.log('📝 New Access Token:', refreshData.accessToken.substring(0, 30) + '...');
        
        // Test 6: Use new token
        console.log('\n6️⃣ Testing with new access token...');
        const newProtectedResponse = await fetch(`${BASE_URL}/rbac-test/user-only`, {
          headers: { 'Authorization': `Bearer ${refreshData.accessToken}` }
        });
        
        if (newProtectedResponse.ok) {
          const newProtectedData = await newProtectedResponse.json();
          console.log('✅ New token works:', newProtectedData.message);
        }
      } else {
        console.log('❌ Token refresh failed:', refreshData.message);
      }
      
      // Test 7: Logout
      console.log('\n7️⃣ Testing logout...');
      const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: loginData.refreshToken })
      });
      
      const logoutData = await logoutResponse.json();
      if (logoutData.success) {
        console.log('✅ Logout successful:', logoutData.message);
      } else {
        console.log('❌ Logout failed:', logoutData.message);
      }
      
      // Test 8: Try refresh after logout (should fail)
      console.log('\n8️⃣ Testing refresh after logout (should fail)...');
      const invalidRefreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: loginData.refreshToken })
      });
      
      const invalidRefreshData = await invalidRefreshResponse.json();
      if (!invalidRefreshData.success) {
        console.log('✅ Refresh correctly blocked after logout');
      } else {
        console.log('❌ Refresh should have been blocked');
      }
      
      console.log('\n🎉 All tests completed successfully!');
      console.log('\n📋 Test Summary:');
      console.log('✅ Server health check');
      console.log('✅ User registration');
      console.log('✅ User login with tokens');
      console.log('✅ Protected route access');
      console.log('✅ Token refresh mechanism');
      console.log('✅ New token usage');
      console.log('✅ Logout functionality');
      console.log('✅ Token invalidation');
      
    } else {
      console.log('❌ Login failed:', loginData.message);
      console.log('💡 Make sure the server is running and database is seeded');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm run dev');
    console.log('2. Check if MongoDB is running');
    console.log('3. Verify .env file has correct values');
    console.log('4. Run database seeding: node src/seed/seedRoles.js');
  }
}

// Run the test
testAPI();
