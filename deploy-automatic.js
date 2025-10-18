#!/usr/bin/env node

const { Daytona } = require('@daytonaio/sdk');
const fs = require('fs');
const path = require('path');

async function deployMedicalApp() {
    console.log('🚀 Deploying Medical App to Daytona (Automatic)');
    console.log('==============================================');

    try {
        // Initialize Daytona SDK
        const daytona = new Daytona();
        console.log('✅ Daytona SDK initialized');

        // Create a new sandbox with Node.js
        console.log('📦 Creating sandbox...');
        const sandbox = await daytona.create({ 
            language: 'node',
            name: 'medical-app-sandbox'
        });
        console.log(`✅ Sandbox created: ${sandbox.id}`);

        // Upload all necessary files
        console.log('📤 Uploading files...');
        
        // Upload package.json
        const packageJson = fs.readFileSync('package.json', 'utf8');
        await sandbox.fs.uploadFile(Buffer.from(packageJson), 'package.json');

        // Upload source files
        const filesToUpload = [
            'src/server.js',
            'src/database/schema.sql',
            'src/database/init.js',
            'src/database/seed.js',
            'src/mcp/server.js',
            'src/mcp/start.js'
        ];

        for (const file of filesToUpload) {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file);
                await sandbox.fs.uploadFile(content, file);
                console.log(`  ✅ Uploaded: ${file}`);
            }
        }

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
        await sandbox.process.sessionExecuteCommand(sessionId, 'npm start');

        // Get preview URL
        console.log('🌐 Getting preview URL...');
        const previewInfo = await sandbox.getPreviewUrl(3000);
        
        console.log('\n🎉 Deployment Complete!');
        console.log('======================');
        console.log(`📦 Sandbox ID: ${sandbox.id}`);
        console.log(`🌐 Preview URL: ${previewInfo.url}`);
        console.log(`🔑 Auth Token: ${previewInfo.token}`);
        console.log(`📊 API Endpoints:`);
        console.log(`   - ${previewInfo.url}/api/patients`);
        console.log(`   - ${previewInfo.url}/api/appointments`);
        console.log(`   - ${previewInfo.url}/api/conditions`);
        console.log(`   - ${previewInfo.url}/api/diagnoses`);
        console.log(`   - ${previewInfo.url}/api/medications`);
        
        console.log('\n🤖 To start MCP server:');
        console.log(`   daytona sandbox exec ${sandbox.id} -- "npm run mcp"`);

        return {
            sandboxId: sandbox.id,
            previewUrl: previewInfo.url,
            authToken: previewInfo.token
        };

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        throw error;
    }
}

// Run deployment
if (require.main === module) {
    deployMedicalApp()
        .then((result) => {
            console.log('\n✅ Medical app is now running in Daytona!');
            console.log(`🌐 Access it at: ${result.previewUrl}`);
        })
        .catch((error) => {
            console.error('❌ Deployment failed:', error);
            process.exit(1);
        });
}

module.exports = { deployMedicalApp };
