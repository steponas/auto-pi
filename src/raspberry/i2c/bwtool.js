// Interfacing with relays over bw_tool - https://bitwizard.nl/wiki/Bw_tool
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { gpioLock } = require('../../common/gpio');
const { debug, error } = require('../../common/log');

const execute = async (cmd) => {
  debug(`bw_tool: Executing "${cmd}"`);
  const unlock = await gpioLock();
  let result = null;
  try {
    const { stdout } = await exec(cmd);
    result = stdout;
  } catch (err) {
    error(`bw_tool: Error executing: ${err}`);
  }
  unlock();
  return result;
};

const bwToolWriteCmd = (board, cmd, bit) => `bw_tool -I -D /dev/i2c-1 -a ${board} -W ${cmd}:${bit}:b`;
/**
 * Generate the bw_tool command to be run.
 * @param {Number} board The board address to send command to
 * @param {string} cmd Command, in hex
 * @param {string} bit - 00 or 01 mostly, as hex
 * @returns {Promise<string>} Result of the command
 */
const bwToolWrite = async (board, cmd, bit) => execute(bwToolWriteCmd(board, cmd, bit));

const bwToolReadRelayStateCmd = board => `bw_tool -I -D /dev/i2c-1 -a ${board} -R 10:b`;
/**
 * Read the state of all relays on the $board
 * @param {Number} board
 * @returns {Number} A byte where each bit represents the state of an relay.
 */
const bwToolReadRelayState = board => execute(bwToolReadRelayStateCmd(board));

module.exports = {
  bwToolWrite,
  bwToolReadRelayState,
};
