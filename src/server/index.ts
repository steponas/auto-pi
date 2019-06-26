/* eslint import/no-extraneous-dependencies:0 */
import * as express from 'express';
import { join } from 'path';
import * as expressStaticGzip from 'express-static-gzip';
import { name } from '../../package.json';
import piCommands from './pi-api';
import setupJobs from './jobs';
import { readJsonSync } from 'server/common/read-json';
import { generateTemplate } from './templates/index.html';

const app = express();
app.use(express.json());

// Start cron jobs
setupJobs();

// Raspberry Pi command API
app.use('/pi', piCommands);

const assetManifest = readJsonSync(join(__dirname, 'client/manifest.json'));
const clientJs = assetManifest['client.js'];
const clientJsPath = `/static/${clientJs}`;
const indexHtml = generateTemplate({
  clientJs: clientJsPath,
});

// Index page html content
app.get('/', (req, res): void => res.end(indexHtml));

// The single static file - precompiled client.js app
app.use('/static', expressStaticGzip(join(__dirname, 'client'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: (res): void => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

app.listen(3000, (): void => {
  console.log(`${name} listening on port 3000`);
});
