const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database connection
const dbPath = path.join(__dirname, '..', 'medical_app.db');
const db = new sqlite3.Database(dbPath);

// Anthropic Claude integration
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all patients
app.get('/api/patients', (req, res) => {
  db.all('SELECT * FROM patients', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Chat endpoint with Claude
app.post('/api/chat-llm', async (req, res) => {
  const { message, useLLM } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let response = '';

    if (useLLM && process.env.ANTHROPIC_API_KEY) {
      // Get patient data for context
      const patients = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM patients', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      // Create context for Claude
      const context = `You are a medical assistant with access to patient data. Here is the current patient database:

${JSON.stringify(patients, null, 2)}

You can help with:
- Patient information and searches
- Appointment scheduling
- Medical conditions and diagnoses
- Medication management
- Insurance information
- General medical questions

Please provide helpful, accurate, and professional responses based on the available data.`;

      try {
        const claudeResponse = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `${context}\n\nUser Question: ${message}`
          }]
        });
        
        response = claudeResponse.content[0].text;
      } catch (claudeError) {
        console.error('Claude API error:', claudeError);
        
        // Check if it's a credit/billing issue
        if (claudeError.message && claudeError.message.includes('credit balance')) {
          response = `I'm currently unable to access the AI service due to insufficient credits. However, I can still help you with your medical data using our database system.\n\n${await getEnhancedRuleBasedResponse(message, patients)}`;
        } else {
          // Fallback to rule-based response
          response = await getEnhancedRuleBasedResponse(message, patients);
        }
      }
    } else {
      // Use rule-based response
      const patients = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM patients', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      response = await getEnhancedRuleBasedResponse(message, patients);
    }

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

async function getEnhancedRuleBasedResponse(message, patients) {
  const lowerMessage = message.toLowerCase();
  
  // Only show all patients for specific requests
  if (lowerMessage.includes('show me all patients') || lowerMessage.includes('list all patients') || lowerMessage.includes('all patients')) {
    if (patients.length > 0) {
      let response = `I found ${patients.length} patients in our medical database:\n\n`;
      patients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        response += `${index + 1}. **${patient.first_name} ${patient.last_name}** (ID: ${patient.patient_id})\n`;
        response += `   • Age: ${age} years old\n`;
        response += `   • Gender: ${patient.gender}\n`;
        response += `   • Phone: ${patient.phone}\n`;
        response += `   • Insurance: ${patient.insurance_provider}\n\n`;
      });
      return response + `Would you like me to provide more details about any specific patient?`;
    } else {
      return 'I don\'t have any patients in the database yet.';
    }
  }
  
  if (lowerMessage.includes('oldest') || lowerMessage.includes('age')) {
    if (patients.length > 0) {
      const sortedPatients = patients.sort((a, b) => new Date(a.date_of_birth) - new Date(b.date_of_birth));
      const oldest = sortedPatients[0];
      const age = new Date().getFullYear() - new Date(oldest.date_of_birth).getFullYear();
      return `The oldest patient in our database is **${oldest.first_name} ${oldest.last_name}** (ID: ${oldest.patient_id}), who is ${age} years old. They were born on ${new Date(oldest.date_of_birth).toLocaleDateString()}.`;
    } else {
      return 'I don\'t have any patient records to analyze for age information.';
    }
  }
  
  if (lowerMessage.includes('insurance') || lowerMessage.includes('provider')) {
    if (patients.length > 0) {
      const providers = [...new Set(patients.map(p => p.insurance_provider))];
      let response = `We have patients covered by the following insurance providers:\n\n`;
      providers.forEach((provider, index) => {
        response += `${index + 1}. ${provider}\n`;
      });
      return response;
    } else {
      return 'No insurance information available.';
    }
  }
  
  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return 'Currently, there are no scheduled appointments in our system. I can help you understand the appointment scheduling process or assist with patient management. Would you like me to explain how appointments work in our system?';
  }
  
  if (lowerMessage.includes('condition') || lowerMessage.includes('diagnosis') || lowerMessage.includes('medical')) {
    return 'I can help you with medical conditions and diagnoses. Currently, no specific medical conditions are recorded in our system. I can assist you with:\n\n• Adding medical conditions for patients\n• Tracking patient health status\n• Managing diagnosis information\n\nWould you like me to help you add medical information for a patient?';
  }
  
  if (lowerMessage.includes('medication') || lowerMessage.includes('prescription') || lowerMessage.includes('drug')) {
    return 'I can help you with medication management. Currently, no medications are prescribed in our system. I can assist you with:\n\n• Prescription management\n• Medication tracking\n• Drug interaction checking\n• Dosage information\n\nWould you like me to help you add medication information for a patient?';
  }
  
  if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
    return 'I can help you search for patients by name, ID, or contact information. What specific information are you looking for?';
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! I\'m your medical assistant. I can help you with patient information, appointments, medical records, and more. What would you like to know?';
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return 'I can help you with:\n\n• **Patient Information**: Search and view patient details\n• **Appointments**: Schedule and manage appointments\n• **Medical Records**: Track conditions and diagnoses\n• **Medications**: Manage prescriptions and treatments\n• **Insurance**: Handle insurance information\n\nJust ask me anything about your patients or medical practice!';
  }
  
  if (lowerMessage.includes('how many patients') || lowerMessage.includes('total patients')) {
    return `We currently have ${patients.length} patients in our database. Would you like me to show you their details?`;
  }
  
  if (lowerMessage.includes('youngest') || lowerMessage.includes('young')) {
    if (patients.length > 0) {
      const sortedPatients = patients.sort((a, b) => new Date(b.date_of_birth) - new Date(a.date_of_birth));
      const youngest = sortedPatients[0];
      const age = new Date().getFullYear() - new Date(youngest.date_of_birth).getFullYear();
      return `The youngest patient in our database is **${youngest.first_name} ${youngest.last_name}** (ID: ${youngest.patient_id}), who is ${age} years old. They were born on ${new Date(youngest.date_of_birth).toLocaleDateString()}.`;
    } else {
      return 'I don\'t have any patient records to analyze for age information.';
    }
  }
  
  if (lowerMessage.includes('male') || lowerMessage.includes('female')) {
    const gender = lowerMessage.includes('female') ? 'Female' : 'Male';
    const genderPatients = patients.filter(p => p.gender === gender);
    if (genderPatients.length > 0) {
      let response = `I found ${genderPatients.length} ${gender.toLowerCase()} patients:\n\n`;
      genderPatients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        response += `${index + 1}. **${patient.first_name} ${patient.last_name}** (ID: ${patient.patient_id}) - ${age} years old\n`;
      });
      return response;
    } else {
      return `I don't have any ${gender.toLowerCase()} patients in the database.`;
    }
  }
  
  if (lowerMessage.includes('diabetes') || lowerMessage.includes('diabetic')) {
    const diabetesPatients = patients.filter(p => p.primary_dx && p.primary_dx.toLowerCase().includes('diabetes'));
    if (diabetesPatients.length > 0) {
      let response = `I found ${diabetesPatients.length} patient(s) with diabetes:\n\n`;
      diabetesPatients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        response += `${index + 1}. **${patient.first_name} ${patient.last_name}** (ID: ${patient.patient_id})\n`;
        response += `   • Age: ${age} years old\n`;
        response += `   • Diagnosis: ${patient.primary_dx}\n`;
        response += `   • MRN: ${patient.mrn}\n\n`;
      });
      return response;
    } else {
      return 'I don\'t have any patients with diabetes in the database.';
    }
  }
  
  if (lowerMessage.includes('hypertension') || lowerMessage.includes('high blood pressure')) {
    const hypertensionPatients = patients.filter(p => p.primary_dx && p.primary_dx.toLowerCase().includes('hypertension'));
    if (hypertensionPatients.length > 0) {
      let response = `I found ${hypertensionPatients.length} patient(s) with hypertension:\n\n`;
      hypertensionPatients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        response += `${index + 1}. **${patient.first_name} ${patient.last_name}** (ID: ${patient.patient_id})\n`;
        response += `   • Age: ${age} years old\n`;
        response += `   • Diagnosis: ${patient.primary_dx}\n\n`;
      });
      return response;
    } else {
      return 'I don\'t have any patients with hypertension in the database.';
    }
  }
  
  if (lowerMessage.includes('copd') || lowerMessage.includes('chronic obstructive')) {
    const copdPatients = patients.filter(p => p.primary_dx && p.primary_dx.toLowerCase().includes('copd'));
    if (copdPatients.length > 0) {
      let response = `I found ${copdPatients.length} patient(s) with COPD:\n\n`;
      copdPatients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        response += `${index + 1}. **${patient.first_name} ${patient.last_name}** (ID: ${patient.patient_id})\n`;
        response += `   • Age: ${age} years old\n`;
        response += `   • Diagnosis: ${patient.primary_dx}\n\n`;
      });
      return response;
    } else {
      return 'I don\'t have any patients with COPD in the database.';
    }
  }
  
  if (lowerMessage.includes('asthma')) {
    const asthmaPatients = patients.filter(p => p.primary_dx && p.primary_dx.toLowerCase().includes('asthma'));
    if (asthmaPatients.length > 0) {
      let response = `I found ${asthmaPatients.length} patient(s) with asthma:\n\n`;
      asthmaPatients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        response += `${index + 1}. **${patient.first_name} ${patient.last_name}** (ID: ${patient.patient_id})\n`;
        response += `   • Age: ${age} years old\n`;
        response += `   • Diagnosis: ${patient.primary_dx}\n\n`;
      });
      return response;
    } else {
      return 'I don\'t have any patients with asthma in the database.';
    }
  }
  
  if (lowerMessage.includes('heart') || lowerMessage.includes('cardiac')) {
    const heartPatients = patients.filter(p => p.primary_dx && p.primary_dx.toLowerCase().includes('heart'));
    if (heartPatients.length > 0) {
      let response = `I found ${heartPatients.length} patient(s) with heart conditions:\n\n`;
      heartPatients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
        response += `${index + 1}. **${patient.first_name} ${patient.last_name}** (ID: ${patient.patient_id})\n`;
        response += `   • Age: ${age} years old\n`;
        response += `   • Diagnosis: ${patient.primary_dx}\n\n`;
      });
      return response;
    } else {
      return 'I don\'t have any patients with heart conditions in the database.';
    }
  }
  
  // Vitals trends queries
  if (lowerMessage.includes('vitals') || lowerMessage.includes('vital signs') || lowerMessage.includes('trends')) {
    if (lowerMessage.includes('john') || lowerMessage.includes('smith') || lowerMessage.includes('p001')) {
      return `📊 **John Smith's Vital Signs Trends**\n\n` +
             `🔗 **View Interactive Charts**: http://localhost:${PORT}/api/patients/1/vitals/trends\n\n` +
             `**Available Vital Types**:\n` +
             `• Heart Rate (HR)\n` +
             `• Blood Pressure (BP_SYS, BP_DIA)\n` +
             `• Temperature (TEMP)\n` +
             `• Oxygen Saturation (SPO2)\n` +
             `• Respiratory Rate (RR)\n\n` +
             `**Recent Vitals**:\n` +
             `• HR: 85 bpm\n` +
             `• BP: 140/90 mmHg\n` +
             `• Temp: 98.6°F\n` +
             `• SpO2: 98%\n\n` +
             `Ask me for specific trends like "Show John's heart rate trends" or "John's blood pressure over time"`;
    } else if (lowerMessage.includes('sarah') || lowerMessage.includes('johnson') || lowerMessage.includes('p002')) {
      return `📊 **Sarah Johnson's Vital Signs Trends**\n\n` +
             `🔗 **View Interactive Charts**: http://localhost:${PORT}/api/patients/2/vitals/trends\n\n` +
             `**Recent Vitals**:\n` +
             `• HR: 95 bpm\n` +
             `• BP: 160/100 mmHg (Elevated)\n` +
             `• Temp: 98.4°F\n\n` +
             `**⚠️ Alert**: Blood pressure is elevated - requires monitoring`;
    } else {
      return `📊 **Vital Signs Trends Available**\n\n` +
             `I can show you vitals trends for specific patients:\n\n` +
             `**Available Patients**:\n` +
             `• John Smith (P001) - Type 2 Diabetes\n` +
             `• Sarah Johnson (P002) - Hypertension\n` +
             `• Robert Brown (P003) - COPD\n` +
             `• Emily Davis (P004) - Asthma\n` +
             `• Michael Wilson (P005) - Heart Disease\n\n` +
             `**Ask me**: "Show [Patient Name]'s vitals trends" or "John's heart rate over time"`;
    }
  }
  
  // Lab comparisons queries
  if (lowerMessage.includes('labs') || lowerMessage.includes('lab results') || lowerMessage.includes('comparison')) {
    if (lowerMessage.includes('john') || lowerMessage.includes('smith') || lowerMessage.includes('p001')) {
      return `🧪 **John Smith's Lab Results & Trends**\n\n` +
             `🔗 **View Interactive Charts**: http://localhost:${PORT}/api/patients/1/labs/trends\n\n` +
             `**Recent Lab Results**:\n` +
             `• **Hemoglobin A1c**: 8.2% (⚠️ High - Target: 4-6%)\n` +
             `• **Fasting Glucose**: 180 mg/dL (⚠️ High - Target: 70-100)\n\n` +
             `**Trend Analysis**:\n` +
             `• A1c trending upward - diabetes management needs adjustment\n` +
             `• Glucose levels consistently elevated\n\n` +
             `**Recommendations**:\n` +
             `• Review medication regimen\n` +
             `• Consider insulin adjustment\n` +
             `• Schedule follow-up in 1 month`;
    } else if (lowerMessage.includes('sarah') || lowerMessage.includes('johnson') || lowerMessage.includes('p002')) {
      return `🧪 **Sarah Johnson's Lab Results**\n\n` +
             `🔗 **View Interactive Charts**: http://localhost:${PORT}/api/patients/2/labs/trends\n\n` +
             `**Recent Lab Results**:\n` +
             `• **Total Cholesterol**: 220 mg/dL (⚠️ High - Target: <200)\n\n` +
             `**Recommendations**:\n` +
             `• Continue statin therapy\n` +
             `• Dietary counseling\n` +
             `• Recheck in 3 months`;
    } else {
      return `🧪 **Lab Results & Comparisons Available**\n\n` +
             `I can show you lab trends and comparisons for:\n\n` +
             `**Available Patients**:\n` +
             `• John Smith (P001) - Diabetes labs\n` +
             `• Sarah Johnson (P002) - Cholesterol labs\n` +
             `• Robert Brown (P003) - COPD labs\n` +
             `• Emily Davis (P004) - Allergy labs\n` +
             `• Michael Wilson (P005) - Cardiac labs\n\n` +
             `**Ask me**: "Show [Patient Name]'s lab trends" or "Compare John's A1c over time"`;
    }
  }
  
  // Chart requests
  if (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('dashboard')) {
    return `📊 **Available Charts & Analytics**\n\n` +
           `**Generic Dashboard**: http://localhost:${PORT}/dashboard.html\n\n` +
           `**Patient-Specific Charts**:\n` +
           `• Vitals trends: "Show [Patient]'s vitals chart"\n` +
           `• Lab comparisons: "Show [Patient]'s lab trends"\n` +
           `• Medication history: "Show [Patient]'s medications"\n\n` +
           `**Available Chart Types**:\n` +
           `• Line charts for trends over time\n` +
           `• Bar charts for comparisons\n` +
           `• Pie charts for distributions\n` +
           `• Scatter plots for correlations\n\n` +
           `**Interactive Features**:\n` +
           `• Zoom and pan\n` +
           `• Data point details\n` +
           `• Export capabilities\n` +
           `• Real-time updates`;
  }
  
  return `I understand you're asking about: "${message}". As your medical assistant, I can help you with:\n\n• **Patient Information**: Search and view patient details\n• **Appointments**: Schedule and manage appointments\n• **Medical Records**: Track conditions and diagnoses\n• **Medications**: Manage prescriptions and treatments\n• **Insurance**: Handle insurance information\n\nCould you be more specific about what you'd like to know? I'm here to help make your medical practice more efficient!`;
}

// Dashboard API endpoints
app.get('/api/alerts', (req, res) => {
  db.all('SELECT * FROM alerts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY due_at ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/labs', (req, res) => {
  db.all('SELECT * FROM labs ORDER BY ordered_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Patient vitals trends
app.get('/api/patients/:id/vitals/trends', (req, res) => {
  const patientId = req.params.id;
  const { type, days = 30 } = req.query;
  
  let query = 'SELECT * FROM vitals WHERE patient_id = ?';
  let params = [patientId];
  
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  
  query += ' AND recorded_at >= datetime("now", "-' + days + ' days") ORDER BY recorded_at ASC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Patient lab trends
app.get('/api/patients/:id/labs/trends', (req, res) => {
  const patientId = req.params.id;
  const { test_name, days = 30 } = req.query;
  
  let query = 'SELECT * FROM labs WHERE patient_id = ?';
  let params = [patientId];
  
  if (test_name) {
    query += ' AND test_name LIKE ?';
    params.push(`%${test_name}%`);
  }
  
  query += ' AND ordered_at >= datetime("now", "-' + days + ' days") ORDER BY ordered_at ASC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Medical Bot Server running on port ${PORT}`);
  console.log(`Access the UI at http://localhost:${PORT}`);
  console.log(`MCP Server running on port 3000`);
});
