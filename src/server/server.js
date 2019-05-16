/* eslint import/no-extraneous-dependencies:0 */
const express = require('express');
const { join } = require('path');
const { name } = require('../../package.json');
const piCommands = require('./pi-api');

const app = express();

// Start cron jobs
require('./jobs');

// Raspberry Pi command API
app.use('/pi', piCommands);

// Static file routing
app.get('/', (req, res) => res.sendFile(join(__dirname, '../client/static/index.html')));
app.get('/main.js', (req, res) => res.sendFile(join(__dirname, '../../dist/main.js')));

app.listen(3000, () => {
  console.log(`${name} listening on port 3000`);
});
