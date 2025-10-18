#!/usr/bin/env node

const MedicalAppMCPServer = require('./server.js');

const server = new MedicalAppMCPServer();
server.start().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
