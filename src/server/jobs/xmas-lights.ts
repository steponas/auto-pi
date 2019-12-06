import { toggleRelay } from 'raspberry/i2c';
import {
  // Yeah... My tiny screwdrivers went missing, so I was not able to
  // unscrew the relay board's screws. I've had to use the thing which
  // had 220v on it - the rarely used sidewalk lights.
  SIDEWALK_LIGHTS as XMAS_LIGHTS,
} from '../../config/relay-names';

const jobName = 'Xmas Lights';

async function turnOn(): Promise<void> {
  await toggleRelay(XMAS_LIGHTS, true);
}
async function turnOff(): Promise<void> {
  await toggleRelay(XMAS_LIGHTS, false);
}

export default (setupJob): void => {
  // Shine in the morning, 7..8. Only on workdays.
  setupJob(`${jobName} morning - on`, '0 0 7 * * 1-5', turnOn, false);
  setupJob(`${jobName} morning - off`, '0 0 8 * * 1-5', turnOff, false);
  // And in the evening, 16..20. Everyday.
  setupJob(`${jobName} evening - on`, '0 0 16 * * *', turnOn, false);
  setupJob(`${jobName} evening - off`, '0 0 20 * * *', turnOff, false);
};
