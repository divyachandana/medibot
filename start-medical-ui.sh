#!/bin/bash

echo "🏥 Starting Medical Bot UI"
echo "========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the daytona_medical_app directory"
    exit 1
fi

echo "✅ Found medical app directory"

# Navigate to UI directory
cd medical-ui

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if medical app API is running
echo "🔍 Checking if medical app API is running..."
if curl -s http://localhost:3000/api/patients > /dev/null; then
    echo "✅ Medical app API is running on port 3000"
else
    echo "⚠️  Medical app API not running on port 3000"
    echo "   Starting API server in background..."
    cd ..
    npm start &
    sleep 5
    cd medical-ui
fi

# Start the React development server
echo "🚀 Starting React development server..."
echo "   UI will be available at: http://localhost:3001"
echo "   API is available at: http://localhost:3000"
echo ""
echo "🎉 Medical Bot UI is starting!"
echo "   - Beautiful animations with Framer Motion"
echo "   - Patient search and management"
echo "   - Real-time data from MCP server"
echo "   - Responsive design for all devices"
echo ""

npm start
