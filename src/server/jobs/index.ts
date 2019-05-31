import cron from 'cron';
import { log } from 'common/log';
import readTempJob from './read-temp';
import grassSprinklersJob from './grass-sprinklers';

const jobs = {};
const TIMEZONE = 'Europe/Vilnius';

const setupJob = (name, cronTime, jobFn, runOnInit = true): void => {
  jobs[name] = new cron.CronJob({
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
  grassSprinklersJob(setupJob);
};
