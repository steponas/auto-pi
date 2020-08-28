import { toggleRelay } from 'raspberry/i2c';
import { log } from 'common/log';  
import {GREENHOUSE, SLOPE} from '../../config/relay-names';
import { waitFor } from 'common/helpers';
import { HOURS } from 'common/time';

const jobName = 'Greenhouse and slope';

async function run(): Promise<void> {
  log(jobName, 'starting');

  await toggleRelay(GREENHOUSE, true);
  await toggleRelay(SLOPE, true);
  await waitFor(4 * HOURS);
  await toggleRelay(GREENHOUSE, false);
  await toggleRelay(SLOPE, false);

  log(jobName, 'done');
}

export default (setupJob): void => {
  setupJob(jobName, '0 0 8 * * 4', run, false);
};
