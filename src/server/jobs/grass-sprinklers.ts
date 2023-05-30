import { log } from 'common/log';
import {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2, SLOPE,
} from '../../config/relay-names';
import { waitFor } from 'common/helpers';
import { HOURS, MINUTES, SECONDS } from 'common/time';
import {RelayStateStore} from "server/store/relay";

const jobName = 'Grass Sprinklers';

async function runFrontClose(relayStore: RelayStateStore): Promise<void> {
  await relayStore.toggleRelay(FRONT_LAWN, true, null);
  await waitFor(30 * SECONDS);

  await relayStore.toggleRelay(BACK_LAWN_1, true, null);
  await waitFor(10 * SECONDS);

  await relayStore.toggleRelay(BACK_LAWN_2, true, null);

  await waitFor(10 * MINUTES);

  const list = [FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2];
  for (const sprinkler of list) {
    await relayStore.toggleRelay(sprinkler, false, null);
    await waitFor(5 * SECONDS);
  }
}

async function runSeparate(relayStore: RelayStateStore): Promise<void> {
  const list = [BACK_LAWN_1, BACK_LAWN_2, FRONT_LAWN];
  for (const sprinkler of list) {
    await relayStore.toggleRelay(sprinkler, true, null);
    await waitFor(30 * MINUTES);
    await relayStore.toggleRelay(sprinkler, false, null);
    await waitFor(5 * SECONDS);
  }
}

async function runBackClose(relayStore: RelayStateStore): Promise<void> {
  await relayStore.toggleRelay(BACK_LAWN_1, true, null);
  await waitFor(10 * SECONDS);

  await relayStore.toggleRelay(BACK_LAWN_2, true, null);
  await waitFor(30 * MINUTES);

  const list = [BACK_LAWN_1, BACK_LAWN_2];
  for (const sprinkler of list) {
    await relayStore.toggleRelay(sprinkler, false, null);
    await waitFor(5 * SECONDS);
  }
}

async function runSlope(relayStore: RelayStateStore): Promise<void> {
  await relayStore.toggleRelay(SLOPE, true, null);
  await waitFor(3 * HOURS);

  await relayStore.toggleRelay(SLOPE, false, null);
}

export default (setupJob, relayStore: RelayStateStore): void => {
  const waterLawn = async (): Promise<void> => {
    log(jobName, 'starting');

    await runFrontClose(relayStore);
    await runSeparate(relayStore);
    await runBackClose(relayStore);
    await runSlope(relayStore);

    log(jobName, 'done');
  };

  setupJob(jobName, '0 0 3 * * 2,6', waterLawn, false);
};
