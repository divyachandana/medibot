#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Medical App to Daytona...\n');

// Check if Daytona CLI is installed
try {
  execSync('daytona --version', { stdio: 'pipe' });
  console.log('✅ Daytona CLI found');
} catch (error) {
  console.error('❌ Daytona CLI not found. Please install it first:');
  console.error('   curl -fsSL https://download.daytona.io/daytona/install.sh | sh');
  process.exit(1);
}

// Check for API key
const envPath = path.join(__dirname, '.env');
let apiKey = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/DAYTONA_API_KEY=(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey || apiKey === 'your_daytona_api_key_here') {
  console.error('❌ Please set your DAYTONA_API_KEY in .env file');
  console.error('   Get your API key from: https://app.daytona.io/dashboard/keys');
  process.exit(1);
}

console.log('✅ Daytona API key found');

// Create sandbox
console.log('\n📦 Creating Daytona sandbox...');
try {
  const createCommand = `daytona sandbox create medical-app --template node`;
  console.log(`Running: ${createCommand}`);
  execSync(createCommand, { stdio: 'inherit' });
  console.log('✅ Sandbox created successfully');
} catch (error) {
  console.error('❌ Failed to create sandbox:', error.message);
  process.exit(1);
}

// Upload files
console.log('\n📤 Uploading application files...');
try {
  const uploadCommand = `daytona sandbox upload medical-app .`;
  console.log(`Running: ${uploadCommand}`);
  execSync(uploadCommand, { stdio: 'inherit' });
  console.log('✅ Files uploaded successfully');
} catch (error) {
  console.error('❌ Failed to upload files:', error.message);
  process.exit(1);
}

// Start the application
console.log('\n🚀 Starting the medical app...');
try {
  const startCommand = `daytona sandbox exec medical-app -- "cd /workspace && npm install && npm run init-db && npm run seed-db && npm start"`;
  console.log(`Running: ${startCommand}`);
  execSync(startCommand, { stdio: 'inherit' });
  console.log('✅ Medical app started successfully');
} catch (error) {
  console.error('❌ Failed to start application:', error.message);
  process.exit(1);
}

// Get preview URL
console.log('\n🌐 Getting preview URL...');
try {
  const previewCommand = `daytona sandbox preview medical-app`;
  const previewUrl = execSync(previewCommand, { encoding: 'utf8' }).trim();
  console.log(`✅ Medical app is available at: ${previewUrl}`);
} catch (error) {
  console.error('❌ Failed to get preview URL:', error.message);
}

console.log('\n🎉 Deployment complete!');
console.log('\nYour medical app is now running on Daytona with:');
console.log('- REST API server on port 3000');
console.log('- MCP server ready for AI agents');
console.log('- Sample patient database');
console.log('\nTo stop the sandbox: daytona sandbox stop medical-app');
console.log('To delete the sandbox: daytona sandbox delete medical-app');
