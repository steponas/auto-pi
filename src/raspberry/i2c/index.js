/* eslint no-await-in-loop:0 no-bitwise:0 */
const { waitFor } = require('../../common/helpers');
const Relays = require('./relays');
const { bwToolWrite, bwToolReadRelayState } = require('./bwtool');

const toggleRelay = async (num, isOn) => {
  const { boardAddr, relayAddr, relayNum } = Relays.mapRelay(num);

  // Check if the expected command succeeded toggling the relay.
  const check = async () => {
    const data = await bwToolReadRelayState(boardAddr);

    if (!data) {
      return false;
    }

    const allRelaysInt = parseInt(data, 16);
    const relayBit = 1 << (relayNum - 1);
    const expResult = isOn ? relayBit : 0;

    return (allRelaysInt & relayBit) === expResult;
  };

  while (true) {
    await bwToolWrite(boardAddr, relayAddr.toString(16), isOn ? '01' : '00');
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
