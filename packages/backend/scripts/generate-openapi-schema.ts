#!/usr/bin/env tsx

const fs = require('fs');
const path = require('path');

async function generateSchema() {
  // Dynamic import since we're using CommonJS
  const { specs } = await import('../src/docs/swagger');
  
  const outputPath = path.join(__dirname, '../openapi.json');
  
  // Write the OpenAPI spec to a JSON file
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  
  console.log(`OpenAPI schema generated at: ${outputPath}`);
}

generateSchema().catch(console.error);
