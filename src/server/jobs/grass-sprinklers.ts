import { toggleRelay } from 'raspberry/i2c';
import { log } from 'common/log';
import {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2, SLOPE,
} from 'src/config/relay-names';
import { waitFor }from 'common/helpers';
import { MINUTES, HOURS } from 'common/time';

const jobName = 'Grass Sprinklers';

const config = [
  { sprinkler: FRONT_LAWN, time: 10 * MINUTES },
  { sprinkler: BACK_LAWN_1, time: 10 * MINUTES },
  { sprinkler: BACK_LAWN_2, time: 10 * MINUTES },
  { sprinkler: SLOPE, time: 3 * HOURS },
];

// TODO we need a locking/error mechanism so that no more than
// one sprinkler is on. Other relays might be on, but only one
// of the sprinklers can be on due to water pressure issues.
const waterFrontLawn = async (): Promise<void> => {
  log(jobName, 'starting sprinklers');

  for (let i = 0; i < config.length; i += 1) {
    const { sprinkler, time } = config[i];
    log(jobName, `sprinkler ${sprinkler} on`);
    await toggleRelay(sprinkler, true);
    await waitFor(time);
    await toggleRelay(sprinkler, false);
    log(jobName, `sprinkler ${sprinkler} off`);
  }

  log(jobName, 'turning sprinklers off');
};

module.exports = (setupJob): void => {
  setupJob(jobName, '0 0 4 * * 1,4', waterFrontLawn, false);
};
