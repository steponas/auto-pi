/* eslint no-await-in-loop:0 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { gpioLock } = require('../../common/gpio');
const { waitFor } = require('../../common/helpers');
const logger = require('../../common/log');
const Relays = require('./relays');

// const STOP_COUNT = 10;
// const STOP_DELAY = 2000;

/**
 * Generate the bw_tool command to be run.
 */
const bwToolWrite = (board, cmd, bit) => `bw_tool -I -D /dev/i2c-1 -a ${board} -W ${cmd}:${bit}:b`;
const readRelays = board => `bw_tool -I -D /dev/i2c-1 -a ${board} -R 10:b`;

const execute = async (cmd) => {
  logger.log(`Executing "${cmd}"`);
  const unlock = await gpioLock();
  let result = null;
  try {
    const { stdout, stderr } = await exec(cmd);
    result = stdout;
  } catch (err) {
    logger.log(`Error executing: ${err}`);
  }
  unlock();
  return result;
};

const toggleRelay = async (num, isOn) => {
  const { boardAddr, relayAddr, relayNum } = Relays.mapRelay(num);

  // Check if the expected command succeeded toggling the relay.
  const check = async () => {
    const checkCmd = readRelays(boardAddr);
    const data = await execute(checkCmd);

    if (!data) {
      return false;
    }

    const num = parseInt(data, 16);
    const relayBit = 1 << (relayNum - 1);
    const expResult = isOn ? relayBit : 0;

    return (num & relayBit) === expResult;
  };

  const cmd = bwToolWrite(boardAddr, relayAddr.toString(16), isOn ? '01' : '00');

  while (true) {
    await execute(cmd);
    await waitFor(1000);
    const ok = await check();
    if (ok) {
      // The relay is in a good state. We're done.
      break;
    } else {
      // Relay didn't toggle.
      // Wait 2 seconds before trying the same command again.
      await waitFor(2000);
    }
  }
};

const turnAllOff = async () => {
  for (let i = 1; i <= 12; i += 1) {
    await toggleRelay(i, false);
    await waitFor(300);
  }
};

module.exports = {
  toggleRelay,
  turnAllOff,
};
