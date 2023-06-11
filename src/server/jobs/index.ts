import { CronJob } from 'cron';
import { log } from 'common/log';
import readTempJob from './read-temp';
import grassSprinklersJob from './grass-sprinklers-simple';
// import greenhouseJob from './greenhouse';
import {RelayStateStore} from "server/store/relay";
// import xmasLights from './xmas-lights';

const jobs = {};
const TIMEZONE = 'Europe/Vilnius';

const setupJob = (name, cronTime, jobFn, runOnInit = true): void => {
  jobs[name] = new CronJob({
    cronTime,
    onTick: jobFn,
    start: true,
    timeZone: TIMEZONE,
    runOnInit,
  });

  log('CRON', `added cronjob ${name}`);
};

// Start jobs
export default (relayStore: RelayStateStore): void => {
  readTempJob(setupJob);
  grassSprinklersJob(setupJob, relayStore);
  // greenhouseJob(setupJob, relayStore);
  // xmasLights(setupJob, relayStore);
};
