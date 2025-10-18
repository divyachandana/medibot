#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🤖 Starting MCP Server in Daytona...\n');

// Check if we're in a Daytona environment
const isDaytona = process.env.DAYTONA_SANDBOX_ID || process.env.DAYTONA_WORKSPACE_ID;

if (!isDaytona) {
  console.log('⚠️  Not running in Daytona environment');
  console.log('   This script is designed to run inside a Daytona sandbox');
  console.log('   Deploy first with: node deploy-to-daytona.js');
  process.exit(1);
}

console.log('✅ Running in Daytona environment');

// Start the MCP server
console.log('\n🚀 Starting Medical App MCP Server...');
try {
  // Start the MCP server in the background
  const mcpProcess = execSync('node src/mcp/start.js', { 
    stdio: 'inherit',
    detached: true 
  });
  
  console.log('✅ MCP Server started successfully');
  console.log('\n📋 MCP Server Features:');
  console.log('- Patient data access');
  console.log('- Appointment management');
  console.log('- Medical conditions tracking');
  console.log('- Diagnosis records');
  console.log('- Medication management');
  
  console.log('\n🔗 Available MCP Tools:');
  console.log('- get_patient: Retrieve patient information');
  console.log('- get_patients: Search and list patients');
  console.log('- get_appointments: Get appointment data');
  console.log('- get_conditions: Get medical conditions');
  console.log('- get_diagnoses: Get diagnosis records');
  console.log('- get_medications: Get medication records');
  console.log('- create_appointment: Schedule new appointments');
  console.log('- update_appointment: Update appointment status');
  
  console.log('\n🎯 Ready for AI agent integration!');
  
} catch (error) {
  console.error('❌ Failed to start MCP server:', error.message);
  process.exit(1);
}
