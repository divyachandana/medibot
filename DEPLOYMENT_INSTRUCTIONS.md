# 🚀 Daytona Deployment Instructions

## Current Status
✅ **Daytona CLI**: Installed and authenticated  
✅ **Medical App**: Ready for deployment  
✅ **MCP Server**: Configured for AI agents  

## 🎯 Deployment Options

### Option 1: Manual Upload via Daytona Dashboard

1. **Access Daytona Dashboard**
   - Go to: https://app.daytona.io/dashboard
   - Navigate to your sandbox: `2970e99b-6bcf-4612-b366-3468148b96af`

2. **Upload Files**
   - Use the file upload feature in the Daytona dashboard
   - Upload all files from your `daytona_medical_app` directory
   - Or use the web terminal to clone from a Git repository

3. **Setup Application**
   ```bash
   # In the Daytona sandbox terminal
   npm install
   npm run init-db
   npm run seed-db
   npm start
   ```

### Option 2: Git Repository Deployment

1. **Create Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Medical app with MCP server"
   git remote add origin <your-git-repo-url>
   git push -u origin main
   ```

2. **Deploy from Git**
   - Use Daytona's Git integration
   - Point to your repository
   - Daytona will automatically build and deploy

### Option 3: Direct File Transfer

1. **Use Daytona's File Manager**
   - Access your sandbox via Daytona dashboard
   - Upload files through the web interface
   - Run setup commands in the terminal

## 🤖 MCP Server Setup

Once deployed, start the MCP server:

```bash
# In the Daytona sandbox
npm run mcp
```

## 📊 What You'll Get

### REST API Server
- **Port**: 3000
- **Endpoints**: All medical data APIs
- **Database**: SQLite with 5 sample patients
- **Features**: Full CRUD operations

### MCP Server for AI Agents
- **8 Medical Tools**: Patient data, appointments, conditions, etc.
- **AI Integration**: Ready for Daytona AI agents
- **Protocol**: Model Context Protocol compliant

### Sample Medical Data
- **5 Patients** with complete records
- **Appointments** (scheduled and completed)
- **Medical Conditions** (diabetes, asthma, etc.)
- **Diagnoses** with ICD-10 codes
- **Medications** with dosage info

## 🔧 Management Commands

### Local Development
```bash
# Start API server
npm start

# Start MCP server
npm run mcp

# Test setup
node test-setup.js
```

### Daytona Sandbox
```bash
# Check sandbox status
daytona sandbox list

# Get sandbox info
daytona sandbox info 2970e99b-6bcf-4612-b366-3468148b96af

# Stop sandbox
daytona sandbox stop 2970e99b-6bcf-4612-b366-3468148b96af

# Start sandbox
daytona sandbox start 2970e99b-6bcf-4612-b366-3468148b96af
```

## 🌐 Access Your Application

After deployment, your medical app will be available at:
- **Daytona Preview URL**: Check your sandbox dashboard
- **API Endpoints**: `/api/patients`, `/api/appointments`, etc.
- **MCP Server**: Ready for AI agent integration

## 🎯 Next Steps

1. **Upload your files** to the Daytona sandbox
2. **Run setup commands** in the sandbox terminal
3. **Start the application** with `npm start`
4. **Start MCP server** with `npm run mcp`
5. **Test the API** using the preview URL

## 📞 Support

- **Daytona Docs**: https://daytona.io/docs
- **MCP Integration**: https://daytona.io/docs/en/mcp
- **API Reference**: https://daytona.io/docs/en/tools/api

Your medical app is ready for deployment! 🎉
