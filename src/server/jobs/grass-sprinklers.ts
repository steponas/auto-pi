import { toggleRelay } from 'raspberry/i2c';
import { log } from 'common/log';  
import {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2, SLOPE,
} from '../../config/relay-names';
import { waitFor } from 'common/helpers';
import { HOURS, MINUTES, SECONDS } from 'common/time';

const jobName = 'Grass Sprinklers';

async function runFrontClose(): Promise<void> {
  await toggleRelay(FRONT_LAWN, true);
  await waitFor(30 * SECONDS);

  await toggleRelay(BACK_LAWN_1, true);
  await waitFor(10 * SECONDS);

  await toggleRelay(BACK_LAWN_2, true);

  await waitFor(10 * MINUTES);

  const list = [FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2];
  for (let sprinkler of list) {
    await toggleRelay(sprinkler, false);
    await waitFor(5 * SECONDS);
  }
}

async function runSeparate(): Promise<void> {
  const list = [BACK_LAWN_1, BACK_LAWN_2, FRONT_LAWN];
  for (let sprinkler of list) {
    await toggleRelay(sprinkler, true);
    await waitFor(30 * MINUTES);
    await toggleRelay(sprinkler, false);
    await waitFor(5 * SECONDS);
  }
}

async function runBackClose(): Promise<void> {
  await toggleRelay(BACK_LAWN_1, true);
  await waitFor(10 * SECONDS);

  await toggleRelay(BACK_LAWN_2, true);
  await waitFor(30 * MINUTES);

  const list = [BACK_LAWN_1, BACK_LAWN_2];
  for (let sprinkler of list) {
    await toggleRelay(sprinkler, false);
    await waitFor(5 * SECONDS);
  }
}

async function runSlope(): Promise<void> {
  await toggleRelay(SLOPE, true);
  await waitFor(3 * HOURS);

  await toggleRelay(SLOPE, false);
}

const waterLawn = async (): Promise<void> => {
  log(jobName, 'starting');

  await runFrontClose();
  await runSeparate();
  await runBackClose();
  await runSlope();

  log(jobName, 'done');
};

export default (setupJob): void => {
  setupJob(jobName, '0 0 3 * * 2,6', waterLawn, false);
};
