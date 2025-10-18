# 🤖 Medibot - Medical AI Assistant

A comprehensive medical application with patient database, MCP server, and intelligent chatbot built for the Daytona platform.

## 🚀 Features

### 📊 **Analytics Dashboard**
![Medical Dashboard](./screenshots/dashboard.png)
- **Generic Charts**: Patient demographics, medical conditions, vital signs trends
- **Lab Analysis**: Normal vs abnormal lab results distribution
- **Alert Management**: Severity-based alert categorization
- **Medication Tracking**: Top prescribed medications
- **Real-time Stats**: Live patient counts, alerts, tasks, and lab results

### 🤖 **Intelligent Chatbot**
![Medical Chatbot](./screenshots/chatbot.png)
- **Patient Queries**: Search patients by name, ID, or medical conditions
- **Medical Conditions**: "Who has diabetes?", "Show hypertension patients"
- **Vitals Trends**: "Show John's vitals trends", "Sarah's blood pressure over time"
- **Lab Comparisons**: "Show John's lab results", "Compare A1c trends"
- **Interactive Charts**: Direct links to patient-specific analytics

### 🗄️ **Comprehensive Database**
- **Patients**: Complete patient records with demographics
- **Vitals**: Heart rate, blood pressure, temperature, oxygen saturation
- **Labs**: Lab results with abnormal flags and reference ranges
- **Medications**: Active medication lists with dosages
- **Encounters**: Patient visit records
- **Notes**: Clinical notes and progress reports
- **Tasks**: Care management tasks and follow-ups
- **Alerts**: Medical alerts with severity levels
- **Imaging**: Radiology and diagnostic imaging records

## 🛠️ **Technology Stack**

- **Backend**: Node.js, Express.js
- **Database**: SQLite with comprehensive medical schema
- **MCP Server**: Model Context Protocol for AI agent integration
- **Frontend**: HTML5, Tailwind CSS, Chart.js
- **AI Integration**: Anthropic Claude API
- **Deployment**: Daytona platform

## 📁 **Project Structure**

```
medibot/
├── src/                          # Main application source
│   ├── database/                 # Database initialization and seeding
│   │   ├── init.js              # Database schema creation
│   │   ├── seed.js              # Sample data population
│   │   └── schema.sql           # Database schema definition
│   ├── mcp/                     # MCP server implementation
│   │   ├── server.js            # MCP server logic
│   │   └── start.js             # MCP server startup
│   └── server.js                # Main API server
├── replit-ui/                   # Web interface
│   ├── index.html              # Chat interface
│   ├── dashboard.html           # Analytics dashboard
│   ├── server.js               # UI server with chatbot
│   └── package.json            # UI dependencies
├── medical-ui/                  # React UI (alternative)
├── .gitignore                   # Git ignore rules
└── package.json                 # Main dependencies
```

## 🚀 **Quick Start**

### 1. **Install Dependencies**
```bash
npm install
cd replit-ui && npm install
```

### 2. **Initialize Database**
```bash
npm run init-db
npm run seed-db
```

### 3. **Start Services**
```bash
# Start main API server (port 3000)
npm start

# Start UI server (port 3002)
cd replit-ui && node server.js
```

### 4. **Access Applications**
- **Chat Interface**: http://localhost:3002
- **Analytics Dashboard**: http://localhost:3002/dashboard.html
- **API Endpoints**: http://localhost:3000/api

## 🔧 **Environment Setup**

Create a `.env` file in the root directory:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DAYTONA_API_KEY=your_daytona_api_key_here
```

## 📊 **API Endpoints**

### **Patient Data**
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get specific patient
- `GET /api/patients/:id/complete` - Get comprehensive patient data

### **Medical Records**
- `GET /api/patients/:id/vitals` - Patient vital signs
- `GET /api/patients/:id/labs` - Lab results
- `GET /api/patients/:id/medications` - Active medications
- `GET /api/patients/:id/encounters` - Patient encounters
- `GET /api/patients/:id/notes` - Clinical notes
- `GET /api/patients/:id/alerts` - Medical alerts
- `GET /api/patients/:id/tasks` - Care tasks
- `GET /api/patients/:id/imaging` - Imaging records

### **Analytics**
- `GET /api/patients/:id/vitals/trends` - Vitals trends over time
- `GET /api/patients/:id/labs/trends` - Lab trends over time
- `GET /api/alerts` - All medical alerts
- `GET /api/tasks` - All care tasks
- `GET /api/labs` - All lab results

### **Chat & AI**
- `POST /api/chat` - Rule-based chatbot
- `POST /api/chat-llm` - AI-powered chatbot

## 💬 **Chatbot Commands**

### **Patient Queries**
- "Show me all patients"
- "Who has diabetes?"
- "Show hypertension patients"
- "Find patient by name"

### **Medical Analytics**
- "Show John's vitals trends"
- "Sarah's blood pressure over time"
- "Show John's lab results"
- "Compare A1c trends"

### **Dashboard & Charts**
- "Show dashboard"
- "Show charts"
- "Show analytics"

## 🏥 **Sample Data**

The application comes with 5 sample patients:
1. **John Smith** - Type 2 Diabetes
2. **Sarah Johnson** - Hypertension
3. **Robert Brown** - COPD
4. **Emily Davis** - Asthma
5. **Michael Wilson** - Heart Disease

Each patient includes:
- Complete demographics
- Medical history
- Vital signs records
- Lab results
- Medication lists
- Clinical notes
- Care tasks and alerts

## 🚀 **Daytona Deployment**

### **Automatic Deployment**
```bash
# Deploy to Daytona sandbox
./setup-medical-app.sh
```

### **Manual Deployment**
1. Create Daytona sandbox
2. Upload project files
3. Run setup script
4. Access via sandbox URL

## 🔒 **Security**

- All API keys stored in environment variables
- No hardcoded credentials in source code
- Comprehensive `.gitignore` for sensitive files
- Database files excluded from version control

## 📈 **Analytics Features**

### **Generic Dashboard Charts**
- Patient demographics (gender distribution)
- Medical conditions distribution
- Vital signs trends over time
- Lab results analysis (normal vs abnormal)
- Alert severity distribution
- Top prescribed medications

### **Patient-Specific Charts**
- Individual vitals trends
- Lab result comparisons
- Medication history
- Care timeline visualization

## 🤖 **AI Integration**

- **Anthropic Claude**: Advanced medical reasoning
- **Rule-based Fallback**: Reliable responses when AI unavailable
- **Context-aware**: Patient-specific medical insights
- **Natural Language**: Conversational medical queries

## 📝 **License**

ISC License - See package.json for details

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 **Support**

For issues and questions:
- Check the documentation
- Review the API endpoints
- Test with sample data
- Check server logs for errors

## 🖼️ **Screenshots**

### **Analytics Dashboard**
The dashboard provides comprehensive medical analytics with:
- **Patient Demographics**: Gender distribution with interactive pie charts
- **Medical Conditions**: Bar charts showing condition prevalence
- **Real-time Statistics**: Live patient counts, alerts, and lab results
- **Interactive Charts**: Clickable elements for detailed analysis

### **AI Chatbot Interface**
The intelligent chatbot offers:
- **Natural Language Queries**: "Who has diabetes?", "Show patient vitals"
- **Medical Insights**: Patient-specific medical data and trends
- **Interactive Responses**: Direct links to charts and detailed information
- **Context-Aware**: Understands medical terminology and patient relationships

## 💡 **Inspiration**
MediBot helps doctors query patients quickly and see live charts about patient vitals and medical data for faster clinical decision-making.

## 🎯 **What it does**
MediBot provides an intelligent medical assistant with real-time patient analytics, AI-powered chatbot for medical queries, and interactive dashboards for comprehensive patient data visualization.

## 🛠️ **How we built it**
Built using Node.js/Express backend, SQLite database with comprehensive medical schema, Anthropic Claude AI integration, Chart.js for analytics, and deployed on Daytona platform with MCP server architecture.

## 🚧 **Challenges we ran into**
Integrating multiple AI models, handling real-time data synchronization, creating intuitive medical interfaces, and ensuring HIPAA-compliant data handling while maintaining performance.

## 🏆 **Accomplishments that we're proud of**
Successfully created a comprehensive medical AI system with live patient analytics, intelligent chatbot responses, and seamless integration between database, AI, and visualization components.

## 📚 **What we learned**
Advanced medical data modeling, AI integration patterns, real-time chart rendering, medical terminology processing, and building scalable healthcare applications with proper data security.

## 🚀 **What's next for MediBot**
Implementing advanced AI diagnostics, adding telemedicine features, expanding to mobile platforms, integrating with EHR systems, and developing predictive analytics for patient outcomes.

---

**Built with ❤️ for the Daytona platform**
