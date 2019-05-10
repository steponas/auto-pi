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

  log('CRON', `Added cronjob ${name} run ? ${runOnInit}`);
};

// Start jobs
require('./read-temp')(setupJob);
