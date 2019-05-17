import cron from 'cron';
import { log } from 'common/log';

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
  require('./read-temp')(setupJob);
  require('./front-grass-often')(setupJob);
  require('./grass-sprinklers')(setupJob);
};
