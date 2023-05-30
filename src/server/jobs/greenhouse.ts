import { log } from 'common/log';
import {GREENHOUSE, SLOPE} from '../../config/relay-names';
import { waitFor } from 'common/helpers';
import { HOURS } from 'common/time';
import {RelayStateStore} from "server/store/relay";

const jobName = 'Greenhouse and slope';

export default (setupJob, relayStore: RelayStateStore): void => {
  async function run(): Promise<void> {
    log(jobName, 'starting');

    await relayStore.toggleRelay(GREENHOUSE, true, null);
    await relayStore.toggleRelay(SLOPE, true, null);
    await waitFor(4 * HOURS);
    await relayStore.toggleRelay(GREENHOUSE, false, null);
    await relayStore.toggleRelay(SLOPE, false, null);

    log(jobName, 'done');
  }

  setupJob(jobName, '0 0 10 * * 2,6', run, false);
};
