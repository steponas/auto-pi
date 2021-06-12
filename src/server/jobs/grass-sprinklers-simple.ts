import { toggleRelay } from 'raspberry/i2c';
import { log } from 'common/log';  
import {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2,
} from '../../config/relay-names';
import { waitFor } from 'common/helpers';
import { MINUTES, SECONDS } from 'common/time';

const jobName = 'Grass Sprinklers';

const waterLawn = async (): Promise<void> => {
  log(jobName, 'starting');

  const list = [FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2];
  for (let sprinkler of list) {
    await toggleRelay(sprinkler, true);
    await waitFor(30 * MINUTES);
    await toggleRelay(sprinkler, false);
    await waitFor(5 * SECONDS);
  }

  log(jobName, 'done');
};

export default (setupJob): void => {
  setupJob(jobName, '0 0 3 * * 2,6', waterLawn, false);
};
