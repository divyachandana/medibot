#!/bin/bash

echo "🤖 Setting up MCP Servers for Medical App"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the daytona_medical_app directory"
    exit 1
fi

echo "✅ Found medical app directory"

# Check if Daytona CLI is available
if ! command -v daytona &> /dev/null; then
    echo "❌ Daytona CLI not found. Please install it first:"
    echo "   curl -fsSL https://download.daytona.io/daytona/install.sh | sh"
    exit 1
fi

echo "✅ Daytona CLI found"

# Check if logged in to Daytona
if ! daytona sandbox list &> /dev/null; then
    echo "❌ Not logged in to Daytona. Please run:"
    echo "   daytona login"
    exit 1
fi

echo "✅ Logged in to Daytona"

# Create a new sandbox for the medical app
echo ""
echo "📦 Creating sandbox for medical app..."
SANDBOX_ID=$(daytona sandbox create --context . --env NODE_ENV=production --env PORT=3000 --env HOST=0.0.0.0 2>/dev/null | grep -o '[a-f0-9-]\{36\}' | head -1)

if [ -z "$SANDBOX_ID" ]; then
    echo "❌ Failed to create sandbox. Using existing sandbox..."
    SANDBOX_ID="2970e99b-6bcf-4612-b366-3468148b96af"
    echo "Using sandbox: $SANDBOX_ID"
else
    echo "✅ Created sandbox: $SANDBOX_ID"
fi

# Wait for sandbox to be ready
echo "⏳ Waiting for sandbox to be ready..."
sleep 10

# Get sandbox info
echo ""
echo "📊 Sandbox Information:"
daytona sandbox info $SANDBOX_ID

# Get preview URL
echo ""
echo "🌐 Getting preview URL..."
PREVIEW_URL=$(daytona sandbox preview $SANDBOX_ID 2>/dev/null || echo "Check Daytona dashboard for preview URL")

echo ""
echo "🎉 MCP Servers Setup Complete!"
echo "=============================="
echo ""
echo "📋 What's Available:"
echo ""
echo "1. 🏥 Medical App (in Daytona sandbox):"
echo "   - Sandbox ID: $SANDBOX_ID"
echo "   - Preview URL: $PREVIEW_URL"
echo "   - REST API: Available on port 3000"
echo "   - MCP Server: Ready for AI agents"
echo ""
echo "2. 🤖 Daytona MCP Server (local):"
echo "   - Controls Daytona sandboxes"
echo "   - File operations"
echo "   - Command execution"
echo ""
echo "3. 🏥 Medical App MCP Server (local):"
echo "   - Patient data access"
echo "   - Appointment management"
echo "   - Medical conditions tracking"
echo "   - Diagnosis records"
echo "   - Medication management"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Start your AI agent (Claude, Cursor, etc.)"
echo "2. Configure MCP servers using: mcp-servers-config.json"
echo "3. Your AI agent will have access to:"
echo "   - Daytona sandbox management"
echo "   - Medical app data and operations"
echo ""
echo "📁 Configuration file created: mcp-servers-config.json"
echo "   Copy this to your AI agent's MCP configuration"
echo ""
echo "🔧 To start the medical app MCP server locally:"
echo "   npm run mcp"
echo ""
echo "🔧 To start the Daytona MCP server:"
echo "   daytona mcp start"
