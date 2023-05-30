import express from 'express';
import { join } from 'path';
import * as expressStaticGzip from 'express-static-gzip';
import { name } from '../../package.json';
import { getPiApiRouter } from './pi-api';
import setupJobs from './jobs';
import { readJsonSync } from 'server/common/read-json';
import { generateTemplate } from './templates/index.html';
import {SerialRelay} from "raspberry/serial";
import {createRelayStore} from "server/store/relay";

const setupHttp = async () => {
  const app = express();
  app.use(express.json());

  const serial = new SerialRelay();
  const relayState = await createRelayStore(serial);
  // Turn off relays after the server starts, for a clean state.
  try {
    await relayState.turnOffAllRelays();
  } catch (e) {
    console.error('Initial relay turning off failed: ' + e.message);
  }

  // Start cron jobs
  setupJobs(relayState);

  // Raspberry Pi command API
  app.use(
    '/pi',
    (req, res, next) => {
      res.setHeader('Cache-Control', 'public, max-age=0');
      next();
    },
    getPiApiRouter(relayState),
  );

  const assetManifest = readJsonSync(join(__dirname, 'client/assets-manifest.json'));
  const clientJs = assetManifest['client.js'];
  const clientJsPath = `/static/${clientJs}`;
  const indexHtml = generateTemplate({
    clientJs: clientJsPath,
  });

  // Index page html content
  app.get('/', (req, res) => {
    res.end(indexHtml);
  });

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
};

setupHttp();
