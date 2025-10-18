# 🤖 LLM Integration Guide for Medical Chatbot

## 📋 **Current Setup (No LLM Required)**

Your chatbot currently works with:
- ✅ **Rule-based responses** for common questions
- ✅ **Direct database queries** for patient data
- ✅ **Simple keyword matching** for intent recognition
- ✅ **MCP server integration** for AI agents

## 🚀 **Enhanced Setup (With LLM Integration)**

### **Option 1: Local LLM Integration**

#### **Using Ollama (Recommended for Local)**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a medical-focused model
ollama pull llama2:7b
# or
ollama pull codellama:7b

# Start Ollama service
ollama serve
```

#### **Integration Code**
```javascript
// Add to your server.js
const axios = require('axios');

async function getOllamaResponse(message, context) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2:7b',
      prompt: `You are a medical assistant. Context: ${context}. User: ${message}`,
      stream: false
    });
    return response.data.response;
  } catch (error) {
    console.error('Ollama error:', error);
    return 'I apologize, but I cannot process your request right now.';
  }
}
```

### **Option 2: Cloud LLM Integration**

#### **OpenAI Integration**
```bash
npm install openai
```

```javascript
// Add to your server.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getOpenAIResponse(message, context) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a medical assistant with access to patient data. Context: ${context}`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return 'I apologize, but I cannot process your request right now.';
  }
}
```

#### **Anthropic Claude Integration**
```bash
npm install @anthropic-ai/sdk
```

```javascript
// Add to your server.js
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function getClaudeResponse(message, context) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Context: ${context}\n\nUser: ${message}`
      }]
    });
    return response.content[0].text;
  } catch (error) {
    console.error('Claude error:', error);
    return 'I apologize, but I cannot process your request right now.';
  }
}
```

### **Option 3: Hybrid Approach (Recommended)**

```javascript
// Enhanced server.js with hybrid LLM integration
app.post('/api/chat-llm', async (req, res) => {
  const { message, useLLM } = req.body;
  
  try {
    let response = '';
    
    if (useLLM) {
      // Get patient context
      const patients = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM patients', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      
      const context = `Patient Database: ${JSON.stringify(patients, null, 2)}`;
      
      // Try LLM first, fallback to rule-based
      try {
        if (process.env.OPENAI_API_KEY) {
          response = await getOpenAIResponse(message, context);
        } else if (process.env.ANTHROPIC_API_KEY) {
          response = await getClaudeResponse(message, context);
        } else {
          // Fallback to enhanced rule-based
          response = await getEnhancedRuleBasedResponse(message, patients);
        }
      } catch (llmError) {
        console.log('LLM failed, using rule-based fallback');
        response = await getEnhancedRuleBasedResponse(message, patients);
      }
    } else {
      // Use rule-based response
      response = await getEnhancedRuleBasedResponse(message, []);
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});
```

## 🔧 **Environment Setup**

### **Create .env file**
```bash
# For OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# For Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# For local Ollama
OLLAMA_URL=http://localhost:11434
```

### **Install Dependencies**
```bash
# For OpenAI
npm install openai

# For Anthropic
npm install @anthropic-ai/sdk

# For Ollama
npm install axios
```

## 🎯 **MCP Server Integration**

Your MCP server can also integrate with LLMs:

```javascript
// In your MCP server
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');

// Add LLM-powered tools
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'ask_medical_question',
      description: 'Ask a medical question using AI',
      inputSchema: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
            description: 'The medical question to ask'
          }
        },
        required: ['question']
      }
    }
  ]
}));

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'ask_medical_question') {
    const question = request.params.arguments.question;
    const response = await getLLMResponse(question);
    return {
      content: [
        {
          type: 'text',
          text: response
        }
      ]
    };
  }
});
```

## 🚀 **Quick Start Options**

### **1. No LLM (Current Setup)**
- ✅ **Works immediately**
- ✅ **Fast responses**
- ✅ **No API costs**
- ❌ **Limited natural language understanding**

### **2. Local LLM (Ollama)**
- ✅ **Privacy-focused**
- ✅ **No API costs**
- ✅ **Good natural language understanding**
- ❌ **Requires local setup**
- ❌ **Resource intensive**

### **3. Cloud LLM (OpenAI/Anthropic)**
- ✅ **Excellent natural language understanding**
- ✅ **Easy setup**
- ✅ **No local resources needed**
- ❌ **API costs**
- ❌ **Requires internet**

## 🎉 **Recommended Approach**

For your medical chatbot, I recommend:

1. **Start with current setup** (rule-based) for immediate functionality
2. **Add Ollama for local LLM** if you want privacy and no API costs
3. **Integrate OpenAI/Anthropic** for production use with excellent AI capabilities

## 🔗 **Integration Steps**

1. **Choose your LLM option**
2. **Add environment variables**
3. **Install dependencies**
4. **Update server.js with LLM integration**
5. **Test the enhanced chatbot**

Your chatbot will work great with or without an LLM! The current setup provides excellent functionality, and adding an LLM will make it even more conversational and intelligent. 🤖✨
