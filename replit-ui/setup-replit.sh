#!/bin/bash

echo "🏥 Setting up Medical Bot for Replit"
echo "===================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if database exists
if [ ! -f "../medical_app.db" ]; then
    echo "🗄️ Initializing database..."
    cd ..
    npm run init-db
    npm run seed-db
    cd replit-ui
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the server:"
echo "   npm start"
echo ""
echo "🌐 Access the UI at: http://localhost:3000"
echo ""
echo "🤖 Features:"
echo "   - Beautiful medical bot UI"
echo "   - Patient search and management"
echo "   - AI-powered chat with Claude"
echo "   - MCP server integration"
echo "   - Real-time patient data"
