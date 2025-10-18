# 🚀 Daytona Deployment Guide

## Prerequisites

1. **Daytona CLI**: Install the Daytona CLI
   ```bash
   curl -fsSL https://download.daytona.io/daytona/install.sh | sh
   ```

2. **API Key**: Get your Daytona API key from [Daytona Dashboard](https://app.daytona.io/dashboard/keys)

3. **Environment Setup**: Create `.env` file with your API key:
   ```bash
   DAYTONA_API_KEY=your_actual_api_key_here
   ```

## 🚀 Deployment Options

### Option 1: Automated Deployment (Recommended)
```bash
npm run deploy
```

### Option 2: Manual Deployment
```bash
# 1. Create sandbox
daytona sandbox create medical-app --template node

# 2. Upload files
daytona sandbox upload medical-app .

# 3. Install dependencies and setup database
daytona sandbox exec medical-app -- "npm install && npm run init-db && npm run seed-db"

# 4. Start the application
daytona sandbox exec medical-app -- "npm start"
```

### Option 3: Using Daytona YAML
```bash
# Deploy using the daytona.yaml configuration
daytona sandbox create medical-app --config daytona.yaml
```

## 🤖 Starting the MCP Server in Daytona

Once deployed, start the MCP server:

```bash
# Inside the Daytona sandbox
npm run start-mcp

# Or directly
node start-mcp-daytona.js
```

## 📊 What Gets Deployed

### REST API Server
- **Port**: 3000
- **Endpoints**: All medical data APIs
- **Database**: SQLite with sample patient data
- **Features**: Full CRUD operations

### MCP Server
- **Protocol**: Model Context Protocol
- **Tools**: 8 medical data tools for AI agents
- **Integration**: Ready for Daytona AI agents

### Sample Data
- **5 Patients** with complete medical records
- **Appointments** (scheduled and completed)
- **Medical Conditions** (diabetes, asthma, etc.)
- **Diagnoses** with ICD-10 codes
- **Medications** with dosage information

## 🔧 Management Commands

### Sandbox Management
```bash
# List sandboxes
daytona sandbox list

# Get sandbox info
daytona sandbox info medical-app

# Stop sandbox
daytona sandbox stop medical-app

# Start sandbox
daytona sandbox start medical-app

# Delete sandbox
daytona sandbox delete medical-app
```

### Application Management
```bash
# View logs
daytona sandbox logs medical-app

# Execute commands
daytona sandbox exec medical-app -- "npm run seed-db"

# Get preview URL
daytona sandbox preview medical-app
```

## 🌐 Accessing Your Application

After deployment, you'll get a preview URL like:
```
https://medical-app-xyz.daytona.app
```

### API Endpoints
- **Base URL**: `https://your-sandbox-url`
- **Patients**: `/api/patients`
- **Appointments**: `/api/appointments`
- **Conditions**: `/api/conditions`
- **Diagnoses**: `/api/diagnoses`
- **Medications**: `/api/medications`

### Example API Calls
```bash
# Get all patients
curl https://your-sandbox-url/api/patients

# Get specific patient
curl https://your-sandbox-url/api/patients/P001

# Get appointments
curl "https://your-sandbox-url/api/appointments?patient_id=P001"
```

## 🤖 MCP Server Integration

The MCP server provides these tools for AI agents:

1. **get_patient** - Retrieve patient information
2. **get_patients** - Search and list patients  
3. **get_appointments** - Get appointment data
4. **get_conditions** - Get medical conditions
5. **get_diagnoses** - Get diagnosis records
6. **get_medications** - Get medication records
7. **create_appointment** - Schedule new appointments
8. **update_appointment** - Update appointment status

## 🔒 Security Notes

- The application runs in a secure Daytona sandbox
- Database is isolated to your sandbox
- API is accessible via HTTPS
- MCP server is ready for AI agent integration

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Not Set**
   ```bash
   # Check your .env file
   cat .env
   # Make sure DAYTONA_API_KEY is set correctly
   ```

2. **Sandbox Creation Failed**
   ```bash
   # Check Daytona CLI
   daytona --version
   # Login to Daytona
   daytona login
   ```

3. **Database Issues**
   ```bash
   # Reinitialize database
   daytona sandbox exec medical-app -- "npm run init-db && npm run seed-db"
   ```

4. **Port Issues**
   ```bash
   # Check if port 3000 is available
   daytona sandbox exec medical-app -- "netstat -tlnp | grep 3000"
   ```

## 📞 Support

- **Daytona Docs**: https://daytona.io/docs
- **API Reference**: https://daytona.io/docs/en/tools/api
- **MCP Integration**: https://daytona.io/docs/en/mcp

Your medical app is now ready for production use on the Daytona platform! 🎉
