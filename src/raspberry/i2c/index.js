/* eslint no-await-in-loop:0 no-bitwise:0 */
const { waitFor } = require('../../common/helpers');
const Relays = require('./relays');
const { bwToolWrite, bwToolReadRelayState } = require('./bwtool');
const Timeouts = require('./timeouts');

const toggleRelay = async (num, isOn) => {
  const { boardAddr, relayAddr, relayNum } = Relays.mapRelay(num);

  // Check if the expected command succeeded toggling the relay.
  const check = async () => {
    const allRelaysInt = await bwToolReadRelayState(boardAddr);

    if (allRelaysInt === null) {
      return false;
    }

    const relayBit = 1 << (relayNum - 1);
    const expResult = isOn ? relayBit : 0;

    return (allRelaysInt & relayBit) === expResult;
  };

  while (true) {
    await bwToolWrite(boardAddr, relayAddr.toString(16), isOn ? '01' : '00');
    await waitFor(Timeouts.BEFORE_RELAY_CHECK);
    const ok = await check();
    if (ok) {
      // The relay is in a good state. We're done.
      break;
    } else {
      // Relay didn't toggle.
      // Wait before trying the same command again.
      await waitFor(Timeouts.AFTER_BAD_WRITE);
    }
  }
};

const turnAllOff = async () => {
  let state = null;
  for (let i = 1; i <= 12; i += 1) {
    const { boardAddr, relayNum } = Relays.mapRelay(i);
    const relayBit = 1 << (relayNum - 1);

    if (!state) {
      state = await bwToolReadRelayState(boardAddr);
    }
    if ((state & relayBit) === relayBit) {
      await toggleRelay(i, false);
      state = null;
    }
  }
};

module.exports = {
  toggleRelay,
  turnAllOff,
};
