const cron = require('cron');
const { log } = require('../../common/log');

const jobs = {};
const TIMEZONE = 'Europe/Vilnius';

const setupJob = (name, cronTime, jobFn, runOnInit = true) => {
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
require('./read-temp')(setupJob);
require('./front-grass-often')(setupJob);
