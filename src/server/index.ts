/* eslint import/no-extraneous-dependencies:0 */
import express from 'express';
import { join } from 'path';
import { name } from '../../package.json';
import piCommands from './pi-api';
import setupJobs from './jobs';

const app = express();

// Start cron jobs
setupJobs();

// Raspberry Pi command API
app.use('/pi', piCommands);

// Static file routing
const indexHtml = join(__dirname, '../client/static/index.html');
app.get('/', (req, res): void => res.sendFile(indexHtml));

const clientJs = join(__dirname, '../../dist/client.js');
app.get('/client.js', (req, res): void => res.sendFile(clientJs));

app.listen(3000, (): void => {
  console.log(`${name} listening on port 3000`);
});
