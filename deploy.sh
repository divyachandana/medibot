#!/bin/bash

echo "🚀 Deploying Medical App to Daytona"
echo "=================================="

# Check if Daytona CLI is available
if ! command -v daytona &> /dev/null; then
    echo "❌ Daytona CLI not found. Please install it first:"
    echo "   curl -fsSL https://download.daytona.io/daytona/install.sh | sh"
    exit 1
fi

echo "✅ Daytona CLI found"

# Check if logged in
if ! daytona sandbox list &> /dev/null; then
    echo "❌ Not logged in to Daytona. Please run:"
    echo "   daytona login"
    exit 1
fi

echo "✅ Logged in to Daytona"

# Show available sandboxes
echo ""
echo "📦 Available sandboxes:"
daytona sandbox list

echo ""
echo "🎯 To deploy your medical app:"
echo ""
echo "1. Go to https://app.daytona.io/dashboard"
echo "2. Open your sandbox (ID: 2970e99b-6bcf-4612-b366-3468148b96af)"
echo "3. Upload all files from this directory"
echo "4. Run these commands in the sandbox terminal:"
echo ""
echo "   npm install"
echo "   npm run init-db"
echo "   npm run seed-db"
echo "   npm start"
echo ""
echo "5. In another terminal, start the MCP server:"
echo "   npm run mcp"
echo ""
echo "🎉 Your medical app will be running with:"
echo "   - REST API server on port 3000"
echo "   - MCP server for AI agents"
echo "   - Sample patient database"
echo ""
echo "📊 API endpoints will be available at:"
echo "   - /api/patients"
echo "   - /api/appointments"
echo "   - /api/conditions"
echo "   - /api/diagnoses"
echo "   - /api/medications"
