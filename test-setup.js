const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Test database connection and data
async function testDatabase() {
  console.log('Testing database setup...');
  
  const dbPath = path.join(__dirname, 'medical_app.db');
  const db = new sqlite3.Database(dbPath);

  return new Promise((resolve, reject) => {
    // Test patients table
    db.get('SELECT COUNT(*) as count FROM patients', (err, row) => {
      if (err) {
        console.error('Error querying patients:', err.message);
        reject(err);
        return;
      }
      console.log(`✓ Patients table: ${row.count} records`);

      // Test appointments table
      db.get('SELECT COUNT(*) as count FROM appointments', (err, row) => {
        if (err) {
          console.error('Error querying appointments:', err.message);
          reject(err);
          return;
        }
        console.log(`✓ Appointments table: ${row.count} records`);

        // Test conditions table
        db.get('SELECT COUNT(*) as count FROM conditions', (err, row) => {
          if (err) {
            console.error('Error querying conditions:', err.message);
            reject(err);
            return;
          }
          console.log(`✓ Conditions table: ${row.count} records`);

          // Test diagnoses table
          db.get('SELECT COUNT(*) as count FROM diagnoses', (err, row) => {
            if (err) {
              console.error('Error querying diagnoses:', err.message);
              reject(err);
              return;
            }
            console.log(`✓ Diagnoses table: ${row.count} records`);

            // Test medications table
            db.get('SELECT COUNT(*) as count FROM medications', (err, row) => {
              if (err) {
                console.error('Error querying medications:', err.message);
                reject(err);
                return;
              }
              console.log(`✓ Medications table: ${row.count} records`);

              // Test sample data
              db.get('SELECT first_name, last_name FROM patients LIMIT 1', (err, row) => {
                if (err) {
                  console.error('Error querying sample patient:', err.message);
                  reject(err);
                  return;
                }
                console.log(`✓ Sample patient: ${row.first_name} ${row.last_name}`);

                db.close((err) => {
                  if (err) {
                    console.error('Error closing database:', err.message);
                    reject(err);
                  } else {
                    console.log('✓ Database test completed successfully!');
                    resolve();
                  }
                });
              });
            });
          });
        });
      });
    });
  });
}

// Test MCP server import
async function testMCPServer() {
  console.log('\nTesting MCP server...');
  
  try {
    const MedicalAppMCPServer = require('./src/mcp/server.js');
    console.log('✓ MCP server module loaded successfully');
    
    // Test server instantiation
    const server = new MedicalAppMCPServer();
    console.log('✓ MCP server instance created');
    
    return true;
  } catch (error) {
    console.error('✗ MCP server test failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Running Medical App Setup Tests\n');
  
  try {
    await testDatabase();
    const mcpTest = await testMCPServer();
    
    console.log('\n📊 Test Summary:');
    console.log('✓ Database: Ready');
    console.log('✓ Sample Data: Loaded');
    console.log(mcpTest ? '✓ MCP Server: Ready' : '✗ MCP Server: Failed');
    
    console.log('\n🚀 Setup Complete!');
    console.log('Next steps:');
    console.log('1. Run: npm start (to start the API server)');
    console.log('2. Run: node src/mcp/start.js (to start the MCP server)');
    console.log('3. Access API at: http://localhost:3000');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Run: npm run init-db');
    console.log('2. Run: npm run seed-db');
    console.log('3. Try running this test again');
  }
}

runTests();
