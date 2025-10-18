const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, '..', 'medical_app.db');
const db = new sqlite3.Database(dbPath);

// Anthropic Claude integration
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.get('/', (req, res) => {
  res.json({
    message: 'Medical App API Server',
    version: '1.0.0',
    endpoints: {
      patients: '/api/patients',
      appointments: '/api/appointments',
      conditions: '/api/conditions',
      diagnoses: '/api/diagnoses',
      medications: '/api/medications'
    }
  });
});

app.get('/api/patients', (req, res) => {
  const { search, limit = 50 } = req.query;
  
  let query = 'SELECT * FROM patients';
  let params = [];

  if (search) {
    query += ' WHERE first_name LIKE ? OR last_name LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  query += ' LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient vitals
app.get('/api/patients/:id/vitals', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM vitals WHERE patient_id = ? ORDER BY recorded_at DESC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient labs
app.get('/api/patients/:id/labs', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM labs WHERE patient_id = ? ORDER BY ordered_at DESC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient medications
app.get('/api/patients/:id/medications', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM meds WHERE patient_id = ? AND status = "active" ORDER BY start_dt DESC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient encounters
app.get('/api/patients/:id/encounters', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM encounters WHERE patient_id = ? ORDER BY start_dt DESC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient notes
app.get('/api/patients/:id/notes', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM notes WHERE patient_id = ? ORDER BY created_at DESC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient alerts
app.get('/api/patients/:id/alerts', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM alerts WHERE patient_id = ? ORDER BY created_at DESC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient tasks
app.get('/api/patients/:id/tasks', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM tasks WHERE patient_id = ? ORDER BY due_at ASC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get patient imaging
app.get('/api/patients/:id/imaging', (req, res) => {
  const patientId = req.params.id;
  db.all('SELECT * FROM imaging WHERE patient_id = ? ORDER BY ordered_at DESC', [patientId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get comprehensive patient data
app.get('/api/patients/:id/complete', (req, res) => {
  const patientId = req.params.id;
  
  // Get patient basic info
  db.get('SELECT * FROM patients WHERE id = ?', [patientId], (err, patient) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Get all related data
    const queries = [
      { key: 'vitals', query: 'SELECT * FROM vitals WHERE patient_id = ? ORDER BY recorded_at DESC LIMIT 10' },
      { key: 'labs', query: 'SELECT * FROM labs WHERE patient_id = ? ORDER BY ordered_at DESC LIMIT 10' },
      { key: 'medications', query: 'SELECT * FROM meds WHERE patient_id = ? AND status = "active"' },
      { key: 'encounters', query: 'SELECT * FROM encounters WHERE patient_id = ? ORDER BY start_dt DESC LIMIT 5' },
      { key: 'notes', query: 'SELECT * FROM notes WHERE patient_id = ? ORDER BY created_at DESC LIMIT 5' },
      { key: 'alerts', query: 'SELECT * FROM alerts WHERE patient_id = ? ORDER BY created_at DESC' },
      { key: 'tasks', query: 'SELECT * FROM tasks WHERE patient_id = ? ORDER BY due_at ASC' },
      { key: 'imaging', query: 'SELECT * FROM imaging WHERE patient_id = ? ORDER BY ordered_at DESC LIMIT 5' }
    ];
    
    let completed = 0;
    const result = { patient };
    
    queries.forEach(({ key, query }) => {
      db.all(query, [patientId], (err, rows) => {
        if (err) {
          result[key] = [];
        } else {
          result[key] = rows;
        }
        
        completed++;
        if (completed === queries.length) {
          res.json(result);
        }
      });
    });
  });
});

// Chat endpoint for AI assistant
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Simple AI response based on message content
  const lowerMessage = message.toLowerCase();
  let response = '';

  if (lowerMessage.includes('patient') || lowerMessage.includes('show me all patients')) {
    // Get all patients
    db.all('SELECT * FROM patients', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      response = `I found ${rows.length} patients in the database:\n\n`;
      rows.forEach(patient => {
        response += `• ${patient.first_name} ${patient.last_name} (ID: ${patient.patient_id})\n`;
        response += `  Age: ${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}\n`;
        response += `  Phone: ${patient.phone}\n`;
        response += `  Insurance: ${patient.insurance_provider}\n\n`;
      });
      res.json({ response });
    });
    return;
  }

  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    response = 'Currently, there are no scheduled appointments in the system. Would you like me to help you schedule a new appointment for a patient?';
  } else if (lowerMessage.includes('condition') || lowerMessage.includes('diagnosis')) {
    response = 'I can access patient medical conditions and diagnoses. Currently, no specific medical conditions are recorded in the system. Would you like me to help you add medical information for a patient?';
  } else if (lowerMessage.includes('medication') || lowerMessage.includes('prescription')) {
    response = 'I can help you with medication information. Currently, no medications are prescribed in the system. Would you like me to help you add medication information for a patient?';
  } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
    response = 'I can help you search for patients by name, ID, or contact information. What specific information are you looking for?';
  } else {
    response = `I understand you're asking about: "${message}". I can help you with patient information, appointments, medical conditions, and medications. Could you be more specific about what you'd like to know?`;
  }

  res.json({ response });
});

// Enhanced LLM-powered chat endpoint with Claude
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
  
  if (lowerMessage.includes('patient') || lowerMessage.includes('show me all patients')) {
    if (patients.length > 0) {
      let response = `I found ${patients.length} patients in our medical database:\n\n`;
      patients.forEach((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
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
  
  return `I understand you're asking about: "${message}". As your medical assistant, I can help you with:\n\n• **Patient Information**: Search and view patient details\n• **Appointments**: Schedule and manage appointments\n• **Medical Records**: Track conditions and diagnoses\n• **Medications**: Manage prescriptions and treatments\n• **Insurance**: Handle insurance information\n\nCould you be more specific about what you'd like to know? I'm here to help make your medical practice more efficient!`;
}

function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('patient') || lowerMessage.includes('john') || lowerMessage.includes('sarah')) {
    return 'I found information about patients in our database. We have 5 patients currently registered: John Smith (P001), Sarah Johnson (P002), Robert Brown (P003), Emily Davis (P004), and Michael Wilson (P005). Would you like specific details about any of them?';
  }
  
  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return 'I can help you with appointment information. Currently, there are no scheduled appointments in the system. Would you like to schedule a new appointment for a patient?';
  }
  
  if (lowerMessage.includes('condition') || lowerMessage.includes('diagnosis') || lowerMessage.includes('health')) {
    return 'I can access patient medical conditions and diagnoses. Currently, no specific medical conditions are recorded in the system. Would you like me to help you add medical information for a patient?';
  }
  
  if (lowerMessage.includes('medication') || lowerMessage.includes('prescription') || lowerMessage.includes('drug')) {
    return 'I can help you with medication information. Currently, no medications are prescribed in the system. Would you like me to help you add medication information for a patient?';
  }
  
  if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
    return 'I can help you search for patients by name, ID, or contact information. What specific information are you looking for?';
  }
  
  return 'I understand you\'re asking about: "' + message + '". I can help you with patient information, appointments, medical conditions, and medications. Could you be more specific about what you\'d like to know?';
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Medical App API Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});
