// import {
// Yeah... My tiny screwdrivers went missing, so I was not able to
// unscrew the relay board's screws. I've had to use the thing which
// had 220v on it - the rarely used sidewalk lights.
//   SIDEWALK_LIGHTS as XMAS_LIGHTS,
// } from '../../config/relay-names';

import {RelayStateStore} from "server/store/relay";

const XMAS_LIGHTS = -1;

const jobName = 'Xmas Lights';

export default (setupJob, relayStore: RelayStateStore): void => {
  async function turnOn(): Promise<void> {
    await relayStore.toggleRelay(XMAS_LIGHTS, true, null);
  }
  async function turnOff(): Promise<void> {
    await relayStore.toggleRelay(XMAS_LIGHTS, false, null);
  }

  // Shine in the morning, 7..8. Only on workdays.
  setupJob(`${jobName} morning - on`, '0 0 7 * * 1-5', turnOn, false);
  setupJob(`${jobName} morning - off`, '0 0 8 * * 1-5', turnOff, false);
  // And in the evening, 16..20. Everyday.
  setupJob(`${jobName} evening - on`, '0 0 16 * * *', turnOn, false);
  setupJob(`${jobName} evening - off`, '0 0 20 * * *', turnOff, false);
};
