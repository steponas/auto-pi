/* eslint import/no-extraneous-dependencies:0 */
import * as express from 'express';
import { join } from 'path';
import { name } from '../../package.json';
import piCommands from './pi-api';
import setupJobs from './jobs';

const app = express();
app.use(express.json())

// Start cron jobs
setupJobs();

// Raspberry Pi command API
app.use('/pi', piCommands);

// Static file routing. All paths are relative to dist folder.
const indexHtml = join(__dirname, '../src/client/static/index.html');
app.get('/', (req, res): void => res.sendFile(indexHtml));

const clientJs = join(__dirname, './client.js');
app.get('/client.js', (req, res): void => res.sendFile(clientJs));

app.listen(3000, (): void => {
  console.log(`${name} listening on port 3000`);
});
