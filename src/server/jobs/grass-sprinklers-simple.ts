import moment from 'moment'
import {log} from 'common/log';
import {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2,
} from '../../config/relay-names';
import {waitFor} from 'common/helpers';
import {MINUTES, SECONDS} from 'common/time';
import {RelayStateStore} from "server/store/relay";
import {stateStore} from "server/store";

const jobName = 'Grass Sprinklers';
const lawnStateKey = 'lawn-sprinklers';
const waterEveryDays = 2;

type LawnState = {
  lastRun: string;
};

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

  const checkShouldWater = async () => {
    try {
      const state = await stateStore.read<LawnState>(lawnStateKey);
      const lastWatered = state ? moment(state.lastRun) : moment().subtract(1, 'month');
      if (moment().diff(lastWatered, 'days', true) >= waterEveryDays - 0.1) {
        await stateStore.write(lawnStateKey, {lastRun: moment().toISOString()} as LawnState);
        await waterLawn();
      } else {
        log(jobName, `${waterEveryDays} days have not yet passed - skipping`);
      }
    } catch (err) {
      log(jobName, 'failed to read state: ' + err.message);
    }
  };

  setupJob(jobName, '0 0 4 * * *', checkShouldWater, false);
};
