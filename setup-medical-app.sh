#!/bin/bash

echo "🏥 Setting up Medical App in Daytona Sandbox"
echo "============================================"

# Install Node.js if not available
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Create project directory
mkdir -p /home/daytona/medical-app
cd /home/daytona/medical-app

# Create package.json
cat > package.json << 'EOF'
{
  "name": "daytona-medical-app",
  "version": "1.0.0",
  "description": "Medical app with patient database and MCP server for Daytona",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "init-db": "node src/database/init.js",
    "seed-db": "node src/database/seed.js",
    "mcp": "node src/mcp/start.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.1",
    "@modelcontextprotocol/sdk": "^0.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

# Install dependencies
npm install

# Create directory structure
mkdir -p src/database src/mcp

# Create database schema
cat > src/database/schema.sql << 'EOF'
-- Medical App Database Schema
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conditions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    condition_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    condition_name VARCHAR(200) NOT NULL,
    condition_type VARCHAR(50),
    diagnosis_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    severity VARCHAR(20),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE IF NOT EXISTS diagnoses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    diagnosis_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    condition_id VARCHAR(50),
    diagnosis_code VARCHAR(20),
    diagnosis_name VARCHAR(200) NOT NULL,
    diagnosis_date DATE NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    doctor_specialty VARCHAR(100),
    notes TEXT,
    treatment_plan TEXT,
    follow_up_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (condition_id) REFERENCES conditions(condition_id)
);

CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    doctor_specialty VARCHAR(100),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'scheduled',
    reason_for_visit TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medication_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    prescribed_by VARCHAR(100),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
EOF

# Create database init script
cat > src/database/init.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../medical_app.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
});

db.exec(schema, (err) => {
    if (err) {
        console.error('Error creating tables:', err.message);
    } else {
        console.log('Database schema initialized successfully');
    }
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed');
    }
});
EOF

# Create seed script
cat > src/database/seed.js << 'EOF'
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const dbPath = path.join(__dirname, '../../medical_app.db');
const db = new sqlite3.Database(dbPath);

const patients = [
    {
        patient_id: 'P001',
        first_name: 'John',
        last_name: 'Smith',
        date_of_birth: '1985-03-15',
        gender: 'Male',
        phone: '555-0101',
        email: 'john.smith@email.com',
        address: '123 Main St, Anytown, ST 12345',
        emergency_contact_name: 'Jane Smith',
        emergency_contact_phone: '555-0102',
        insurance_provider: 'HealthPlus Insurance',
        insurance_number: 'HP123456789'
    },
    {
        patient_id: 'P002',
        first_name: 'Sarah',
        last_name: 'Johnson',
        date_of_birth: '1990-07-22',
        gender: 'Female',
        phone: '555-0201',
        email: 'sarah.johnson@email.com',
        address: '456 Oak Ave, Anytown, ST 12345',
        emergency_contact_name: 'Mike Johnson',
        emergency_contact_phone: '555-0202',
        insurance_provider: 'MediCare Plus',
        insurance_number: 'MP987654321'
    }
];

function insertData(tableName, data) {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(data[0]).join(', ');
        const placeholders = Object.keys(data[0]).map(() => '?').join(', ');
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        
        const stmt = db.prepare(query);
        
        db.serialize(() => {
            data.forEach((row) => {
                const values = Object.values(row);
                stmt.run(values, (err) => {
                    if (err) {
                        console.error(`Error inserting into ${tableName}:`, err.message);
                    }
                });
            });
            stmt.finalize((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Inserted ${data.length} records into ${tableName}`);
                    resolve();
                }
            });
        });
    });
}

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        await insertData('patients', patients);
        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

seedDatabase();
EOF

# Create server
cat > src/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'medical_app.db');
const db = new sqlite3.Database(dbPath);

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Medical App API Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});
EOF

# Create MCP server
cat > src/mcp/server.js << 'EOF'
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class MedicalAppMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'medical-app-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.dbPath = path.join(__dirname, '../../medical_app.db');
    this.db = null;
    this.setupToolHandlers();
  }

  async connectDatabase() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to medical database');
          resolve();
        }
      });
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_patient',
            description: 'Get patient information by patient ID',
            inputSchema: {
              type: 'object',
              properties: {
                patient_id: {
                  type: 'string',
                  description: 'The patient ID to retrieve information for',
                },
              },
              required: ['patient_id'],
            },
          },
          {
            name: 'get_patients',
            description: 'Get all patients or search patients by name',
            inputSchema: {
              type: 'object',
              properties: {
                search: {
                  type: 'string',
                  description: 'Optional search term for patient name',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of patients to return (default: 50)',
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_patient':
            return await this.getPatient(args.patient_id);
          case 'get_patients':
            return await this.getPatients(args.search, args.limit);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async getPatient(patientId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM patients WHERE patient_id = ?';
      this.db.get(query, [patientId], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve({
            content: [
              {
                type: 'text',
                text: `Patient with ID ${patientId} not found`,
              },
            ],
          });
        } else {
          resolve({
            content: [
              {
                type: 'text',
                text: JSON.stringify(row, null, 2),
              },
            ],
          });
        }
      });
    });
  }

  async getPatients(search, limit = 50) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM patients';
      let params = [];

      if (search) {
        query += ' WHERE first_name LIKE ? OR last_name LIKE ?';
        params = [`%${search}%`, `%${search}%`];
      }

      query += ' LIMIT ?';
      params.push(limit);

      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            content: [
              {
                type: 'text',
                text: JSON.stringify(rows, null, 2),
              },
            ],
          });
        }
      });
    });
  }

  async start() {
    await this.connectDatabase();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Medical App MCP Server started');
  }
}

if (require.main === module) {
  const server = new MedicalAppMCPServer();
  server.start().catch(console.error);
}

module.exports = MedicalAppMCPServer;
EOF

# Create MCP start script
cat > src/mcp/start.js << 'EOF'
#!/usr/bin/env node

const MedicalAppMCPServer = require('./server.js');

const server = new MedicalAppMCPServer();
server.start().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
EOF

chmod +x src/mcp/start.js

# Initialize database
echo "🗄️ Initializing database..."
npm run init-db

# Seed database
echo "🌱 Seeding database..."
npm run seed-db

# Start the application
echo "🚀 Starting medical app..."
npm start &

echo "✅ Medical app setup complete!"
echo "🌐 API available at: http://localhost:3000"
echo "🤖 MCP server ready with: npm run mcp"
