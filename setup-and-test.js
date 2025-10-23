/**
 * Setup and Test Script for RBAC Project
 * This script helps you set up and test the complete RBAC functionality
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupAndTest() {
  console.log('🚀 RBAC Project Setup and Test\n');
  
  try {
    // Step 1: Check if .env file exists
    console.log('1️⃣ Checking environment setup...');
    try {
      const envCheck = await execAsync('ls .env 2>/dev/null || echo "not found"');
      if (envCheck.stdout.includes('not found')) {
        console.log('⚠️ .env file not found. Please create it with the following content:');
        console.log(`
PORT=5000
MONGO_URI=mongodb://localhost:27017/rbac
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here
REFRESH_TOKEN_EXPIRY=7d
CORS_URL=http://localhost:3000
        `);
        return;
      } else {
        console.log('✅ .env file found');
      }
    } catch (error) {
      console.log('⚠️ Could not check .env file');
    }
    
    // Step 2: Check if node_modules exists
    console.log('\n2️⃣ Checking dependencies...');
    try {
      const depsCheck = await execAsync('ls node_modules 2>/dev/null || echo "not found"');
      if (depsCheck.stdout.includes('not found')) {
        console.log('📦 Installing dependencies...');
        await execAsync('npm install');
        console.log('✅ Dependencies installed');
      } else {
        console.log('✅ Dependencies already installed');
      }
    } catch (error) {
      console.log('❌ Error checking dependencies:', error.message);
    }
    
    // Step 3: Check MongoDB connection
    console.log('\n3️⃣ Checking MongoDB connection...');
    try {
      await execAsync('mongosh --eval "db.runCommand({ping: 1})" --quiet');
      console.log('✅ MongoDB is running');
    } catch (error) {
      console.log('❌ MongoDB connection failed');
      console.log('💡 Please start MongoDB: mongod');
      return;
    }
    
    // Step 4: Seed the database
    console.log('\n4️⃣ Seeding database...');
    try {
      await execAsync('node src/seed/seedRoles.js');
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.log('❌ Database seeding failed:', error.message);
      return;
    }
    
    // Step 5: Start the server
    console.log('\n5️⃣ Starting the server...');
    console.log('🚀 Run this command in a new terminal: npm run dev');
    console.log('⏳ Wait for "Server is running at port : 5000" message');
    console.log('🧪 Then run: node test-api.js');
    
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Open a new terminal');
    console.log('2. Run: npm run dev');
    console.log('3. Wait for server to start');
    console.log('4. Run: node test-api.js');
    console.log('5. Check all tests pass');
    
    console.log('\n🔗 API Endpoints to test manually:');
    console.log('• Health: GET http://localhost:5000/');
    console.log('• Register: POST http://localhost:5000/api/auth/register');
    console.log('• Login: POST http://localhost:5000/api/auth/login');
    console.log('• Refresh: POST http://localhost:5000/api/auth/refresh');
    console.log('• Logout: POST http://localhost:5000/api/auth/logout');
    console.log('• Protected: GET http://localhost:5000/api/rbac-test/user-only');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupAndTest();
