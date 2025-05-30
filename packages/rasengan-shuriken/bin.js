#!/usr/bin/env node

// Import `process` explicitly if needed (e.g., in certain runtime environments).
import process from 'process';

// If not already set, default `NODE_ENV=development`
process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';

// Import and execute the CLI script
import('./dist/cli.js').catch((err) => {
  console.error('Failed to start the Rasengan CLI:', err);
  process.exit(1);
});
