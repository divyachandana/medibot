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
