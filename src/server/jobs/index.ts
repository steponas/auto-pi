import { CronJob } from 'cron';
import { log } from 'common/log';
import readTempJob from './read-temp';
// import grassSprinklersJob from './grass-sprinklers';
import xmasLights from './xmas-lights';

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
export default (): void => {
  readTempJob(setupJob);
  // No need for sprinklers during the winter.
  // grassSprinklersJob(setupJob);
  xmasLights(setupJob);
};
