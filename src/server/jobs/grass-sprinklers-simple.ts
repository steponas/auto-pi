import { log } from 'common/log';
import {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2,
} from '../../config/relay-names';
import { waitFor } from 'common/helpers';
import { MINUTES, SECONDS } from 'common/time';
import {RelayStateStore} from "server/store/relay";

const jobName = 'Grass Sprinklers';

export default (setupJob, relayStore: RelayStateStore): void => {
  const waterLawn = async (): Promise<void> => {
    log(jobName, 'starting');

    const list = [FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2];
    for (const sprinkler of list) {
      await relayStore.toggleRelay(sprinkler, true, null);
      await waitFor(45 * MINUTES);
      await relayStore.toggleRelay(sprinkler, false, null);
      await waitFor(5 * SECONDS);
    }

    log(jobName, 'done');
  };

  setupJob(jobName, '0 0 3 * * 2,6', waterLawn, false);
};
