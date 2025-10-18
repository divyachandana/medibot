# 🤖 Anthropic Claude Integration Setup

## 🔑 **Step 1: Get Your Anthropic API Key**

1. **Visit**: https://console.anthropic.com/
2. **Sign up** or log in to your account
3. **Navigate** to API Keys section
4. **Create** a new API key
5. **Copy** the API key (starts with `sk-ant-...`)

## 📝 **Step 2: Add API Key to .env File**

Create a `.env` file in your project root with:

```bash
# Anthropic Claude API Key
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🚀 **Step 3: Restart the Server**

```bash
# Kill the current server
pkill -f "node src/server.js"

# Start the server with new environment
npm start
```

## ✅ **Step 4: Test the Integration**

1. **Open the UI**: http://localhost:3001
2. **Click the chat button** in bottom-right corner
3. **Toggle to "AI Mode"** in the chat interface
4. **Ask a question** like: "Show me all patients"
5. **See Claude's intelligent response!**

## 🎯 **What You'll Get:**

### **With Claude (AI Mode):**
- ✅ **Natural language understanding**
- ✅ **Intelligent responses** based on patient data
- ✅ **Contextual conversations**
- ✅ **Professional medical assistance**

### **Without Claude (Database Mode):**
- ✅ **Fast rule-based responses**
- ✅ **Direct database queries**
- ✅ **Reliable fallback system**

## 🔧 **Features:**

- **Toggle between AI and Database modes**
- **Real-time patient data access**
- **Intelligent medical assistance**
- **Fallback to rule-based responses**
- **Beautiful animated interface**

## 🎉 **Ready to Use!**

Your medical chatbot now has:
- 🤖 **Claude AI integration** for intelligent responses
- 🗄️ **Database fallback** for reliability
- 🎨 **Beautiful UI** with mode switching
- ⚡ **Fast responses** in both modes

Just add your Anthropic API key to the `.env` file and restart the server! 🚀
