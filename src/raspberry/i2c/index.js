/* eslint no-await-in-loop:0 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { gpioLock } = require('../../common/gpio');
// const { waitFor } = require('../../common/helpers');
const logger = require('../../common/log');
const Relays = require('./relays');

// const STOP_COUNT = 10;
// const STOP_DELAY = 2000;

/**
 * Generate the bw_tool command to be run.
 */
const bwToolCommand = (board, cmd, bit) => `bw_tool -D /dev/i2c-1 -a ${board} -W ${cmd}:${bit}:b`;

const execute = async (cmd) => {
  logger.log(`Executing "${cmd}"`);
  const unlock = await gpioLock();
  try {
    await exec(cmd);
  } catch (err) {
    logger.log(`Error executing: ${err}`);
  }
  unlock();
};

const toggleRelay = async (num, isOn) => {
  const { boardAddr, relayAddr } = Relays.mapRelay(num);

  const cmd = bwToolCommand(boardAddr, relayAddr.toString(16), isOn ? '01' : '00');
  if (isOn) {
    await execute(cmd);
  } else {
    await execute(cmd);
    // Problems with turning the relays off.
    // Need to do it slowly, and repeatedly.
    // for (let n = 1; n <= STOP_COUNT; n += 1) {
    //   await execute(cmd);
    //   if (STOP_COUNT !== n) {
    //     await waitFor(STOP_DELAY);
    //   }
    // }
  }
};

const turnAllOff = async () => {
  await execute(bwToolCommand(Relays.RELAY_1, 10, '00'));
  await execute(bwToolCommand(Relays.RELAY_2, 10, '00'));
  // for (let i = 1; i <= 12; i += 1) {
  //   await toggleRelay(i, false);
  //   await waitFor(300);
  // }
};

module.exports = {
  connect: () => {},
  toggleRelay,
  turnAllOff,
};
