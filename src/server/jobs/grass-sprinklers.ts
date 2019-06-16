const { toggleRelay } = require('../../raspberry/i2c');
const { log } = require('../../common/log');  
const {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2, SLOPE,
} = require('../../config/relay-names');
const { waitFor } = require('../../common/helpers');
const { HOURS, MINUTES, SECONDS } = require('../../common/time');

const jobName = 'Grass Sprinklers';

async function runFrontClose() {
  await toggleRelay(FRONT_LAWN, true);
  await waitFor(30 * SECONDS);

  await toggleRelay(BACK_LAWN_1, true);
  await waitFor(10 * SECONDS);

  await toggleRelay(BACK_LAWN_2, true);

  await waitFor(15 * MINUTES);

  const list = [FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2];
  for (sprinkler of list) {
    await toggleRelay(sprinkler, false);
    await waitFor(5 * SECONDS);
  }
}

