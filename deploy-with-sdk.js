#!/usr/bin/env node

const { Daytona } = require('@daytonaio/sdk');
const fs = require('fs');
const path = require('path');

async function deployMedicalApp() {
    console.log('🚀 Deploying Medical App to Daytona using SDK');
    console.log('==============================================');

    try {
        // Initialize Daytona SDK
        const daytona = new Daytona();
        console.log('✅ Daytona SDK initialized');

        // Create a new sandbox
        console.log('📦 Creating sandbox...');
        const sandbox = await daytona.create();
        console.log(`✅ Sandbox created: ${sandbox.id}`);

        // Upload package.json
        console.log('📤 Uploading package.json...');
        const packageJson = fs.readFileSync('package.json', 'utf8');
        await sandbox.fs.uploadFile(Buffer.from(packageJson), 'package.json');

        // Upload source files
        console.log('📤 Uploading source files...');
        const uploadFiles = [
            'src/server.js',
            'src/database/schema.sql',
            'src/database/init.js',
            'src/database/seed.js',
            'src/mcp/server.js',
            'src/mcp/start.js'
        ];

        for (const file of uploadFiles) {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file);
                const remotePath = file;
                await sandbox.fs.uploadFile(content, remotePath);
                console.log(`  ✅ Uploaded: ${file}`);
            }
        }

        // Create directories
        console.log('📁 Creating directories...');
        await sandbox.fs.createFolder('src/database');
        await sandbox.fs.createFolder('src/mcp');

        // Install dependencies
        console.log('📦 Installing dependencies...');
        await sandbox.process.executeCommand('npm install');

        // Initialize database
        console.log('🗄️ Initializing database...');
        await sandbox.process.executeCommand('npm run init-db');

        // Seed database
        console.log('🌱 Seeding database...');
        await sandbox.process.executeCommand('npm run seed-db');

        // Start the application
        console.log('🚀 Starting medical app...');
        const sessionId = 'medical-app-session';
        await sandbox.process.createSession(sessionId);
        
        // Start the server in the background
        await sandbox.process.sessionExecuteCommand(sessionId, 'npm start');

        // Get preview URL
        console.log('🌐 Getting preview URL...');
        const previewUrl = await sandbox.getPreviewUrl();
        
        console.log('\n🎉 Deployment Complete!');
        console.log('======================');
        console.log(`📦 Sandbox ID: ${sandbox.id}`);
        console.log(`🌐 Preview URL: ${previewUrl}`);
        console.log(`📊 API Endpoints:`);
        console.log(`   - ${previewUrl}/api/patients`);
        console.log(`   - ${previewUrl}/api/appointments`);
        console.log(`   - ${previewUrl}/api/conditions`);
        console.log(`   - ${previewUrl}/api/diagnoses`);
        console.log(`   - ${previewUrl}/api/medications`);
        
        console.log('\n🤖 To start MCP server in another session:');
        console.log(`   daytona sandbox exec ${sandbox.id} -- "npm run mcp"`);

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Run deployment
deployMedicalApp();
