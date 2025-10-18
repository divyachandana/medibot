#!/bin/bash

echo "🚀 Deploying Medical App to Daytona Sandbox"
echo "=========================================="

SANDBOX_ID="10107a5e-8bc8-452a-a082-1c5ee7c2adfc"

echo "📦 Using sandbox: $SANDBOX_ID"

# Create a deployment package
echo "📦 Creating deployment package..."
tar -czf medical-app.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=*.log \
  --exclude=medical_app.db \
  .

echo "✅ Deployment package created: medical-app.tar.gz"

# Get sandbox preview URL
echo "🌐 Getting sandbox preview URL..."
PREVIEW_URL=$(daytona sandbox preview $SANDBOX_ID 2>/dev/null || echo "Check Daytona dashboard")

echo ""
echo "🎯 Next Steps to Deploy:"
echo "========================"
echo ""
echo "1. 🌐 Go to Daytona Dashboard:"
echo "   https://app.daytona.io/dashboard"
echo ""
echo "2. 📂 Open your sandbox:"
echo "   Sandbox ID: $SANDBOX_ID"
echo "   Preview URL: $PREVIEW_URL"
echo ""
echo "3. 📤 Upload files to sandbox:"
echo "   - Upload medical-app.tar.gz"
echo "   - Or upload individual files"
echo ""
echo "4. 🔧 Run these commands in the sandbox terminal:"
echo "   tar -xzf medical-app.tar.gz"
echo "   npm install"
echo "   npm run init-db"
echo "   npm run seed-db"
echo "   npm start"
echo ""
echo "5. 🤖 Start MCP server in another terminal:"
echo "   npm run mcp"
echo ""
echo "🎉 After deployment, your medical app will be:"
echo "   - Running in Daytona sandbox"
echo "   - Accessible via preview URL"
echo "   - MCP server available for AI agents"
echo ""
echo "📊 Available endpoints:"
echo "   - /api/patients"
echo "   - /api/appointments"
echo "   - /api/conditions"
echo "   - /api/diagnoses"
echo "   - /api/medications"
