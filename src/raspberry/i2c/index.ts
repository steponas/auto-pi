/* eslint no-await-in-loop:0 no-bitwise:0 */
import { waitFor } from 'common/helpers';
import Relays, { RelayNum } from './relays';
import { bwToolWrite, bwToolReadRelayState } from './bwtool';
import Timeouts from './timeouts';

export const toggleRelay = async (num, isOn): Promise<void> => {
  const { boardAddr, relayAddr, relayNum } = Relays.mapRelay(num);

  // Check if the expected command succeeded toggling the relay.
  const check = async (): Promise<boolean> => {
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

export const turnAllOff = async (): Promise<void> => {
  let state;
  for (let i = 1; i <= 12; i += 1) {
    const { boardAddr, relayNum } = Relays.mapRelay(i as RelayNum);
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

export interface RelayState {
  [index: number]: boolean;
};
// Get state for all board's relays
export const getState = async(): Promise<RelayState> => {
  const states = {
    [Relays.RELAY_1]: await bwToolReadRelayState(Relays.RELAY_1),
    [Relays.RELAY_2]: await bwToolReadRelayState(Relays.RELAY_2),
  };

  const stateMap = {};
  for (let i = 1; i <= 12; i++) {
    const { boardAddr, relayNum } = Relays.mapRelay(i as RelayNum);
    const state = states[boardAddr];
    const relayBit = 1 << (relayNum - 1);
    stateMap[i] = state ?
      (state & relayBit) === relayBit :
      false;
  }
  return stateMap;
};
