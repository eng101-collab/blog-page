#!/usr/bin/env node

/**
 * This script helps verify the environment setup for the blog application
 * It checks if the required environment variables are set and tests the database connection
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

console.log('\n=== Blog Application Environment Setup ===\n');

if (envExists) {
  console.log('✅ .env file found');
  
  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for required variables
  const hasNeonDbUrl = envContent.includes('NEON_DATABASE_URL=') && 
                      !envContent.includes('NEON_DATABASE_URL=your_neon_database_connection_string');
  
  if (hasNeonDbUrl) {
    console.log('✅ NEON_DATABASE_URL is configured');
  } else {
    console.log('❌ NEON_DATABASE_URL is not properly configured');
    console.log('   Please update your .env file with a valid Neon database URL');
    console.log('   Sign up at https://neon.tech/ to get a free PostgreSQL database');
  }
  
  // Check for NODE_ENV
  const hasNodeEnv = envContent.includes('NODE_ENV=');
  if (hasNodeEnv) {
    console.log('✅ NODE_ENV is configured');
  } else {
    console.log('⚠️ NODE_ENV is not set, will default to development');
  }
  
  // Test database connection if URL is configured
  if (hasNeonDbUrl) {
    console.log('\nTesting database connection...');
    try {
      // Try to run the database initialization script
      console.log('This may take a moment...');
      execSync('node scripts/init-db.ts', { stdio: 'inherit' });
      console.log('\n✅ Database connection successful!');
    } catch (error) {
      console.log('\n❌ Database connection failed');
      console.log('   Please check your NEON_DATABASE_URL in the .env file');
    }
  }
} else {
  console.log('❌ .env file not found');
  console.log('   Please create a .env file in the project root with the following content:');
  console.log(`
# Database Configuration
# Required: Neon PostgreSQL database connection string
# Format: postgresql://username:password@hostname:port/database
NEON_DATABASE_URL=your_neon_database_connection_string

# This variable is also referenced in db.ts, adding for consistency
# Both variables should have the same value
NEON_NEON_DATABASE_URL=your_neon_database_connection_string

# Node Environment
# Options: development, production, test
NODE_ENV=development
  `);
}

console.log('\n=== Setup Check Complete ===\n');