import { toggleRelay } from 'raspberry/i2c';
import { log } from 'common/log';
import { FRONT_LAWN } from 'src/config/relay-names';
import { waitFor } from 'common/helpers';
import { MINUTES } from 'common/time';

const jobName = 'FrontLawnOften';

// TODO we need a locking/error mechanism so that no more than
// one sprinkler is on. Other relays might be on, but only one
// of the sprinklers can be on due to water pressure issues.
const waterFrontLawn = async (): Promise<void> => {
  log(jobName, 'starting sprinklers');
  await toggleRelay(FRONT_LAWN, true);
  await waitFor(10 * MINUTES);
  await toggleRelay(FRONT_LAWN, false);
  log(jobName, 'turning sprinklers off');
};

module.exports = (setupJob): void => {
  setupJob(jobName, '0 0 8,11,14,17 * * *', waterFrontLawn, false);
};
