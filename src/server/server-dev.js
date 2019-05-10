/* eslint import/no-extraneous-dependencies:0 */
const express = require('express');
const { join } = require('path');
const { name } = require('../../package.json');

const app = express();

// Static file routing
app.get('/', (req, res) => res.sendFile(join(__dirname, '../../dist/index.html')));
app.get('/main.js', (req, res) => res.sendFile(join(__dirname, '../../dist/main.js')));

// Serve the files on port 3000.
app.listen(3000, () => {
  console.log(`${name} listening on port 3000!`);
});
