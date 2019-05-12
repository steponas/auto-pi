const { toggleRelay } = require('../../raspberry/i2c');
const { log } = require('../../common/log');
const { FRONT_LAWN } = require('../../config/relay-names');
const { waitFor } = require('../../common/helpers');
const { MINUTES } = require('../../common/time');

const jobName = 'FrontLawnOften';

// TODO we need a locking/error mechanism so that no more than
// one sprinkler is on. Other relays might be on, but only one
// of the sprinklers can be on due to water pressure issues.
const waterFrontLawn = async () => {
  log(jobName, 'starting sprintlers');
  await toggleRelay(FRONT_LAWN, true);
  await waitFor(10 * MINUTES);
  await toggleRelay(FRONT_LAWN, false);
  log(jobName, 'turning sprinklers off');
};

module.exports = (setupJob) => {
  setupJob(jobName, '0 0 8,11,14,17 * * *', waterFrontLawn);
};
