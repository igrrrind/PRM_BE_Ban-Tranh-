// This file is required for Vercel's Node.js runtime to detect the entrypoint.
// It simply re-exports your Express app.
const app = require('../src/server');
module.exports = app;
