import {SerialRelay} from 'raspberry/serial';
import {BACK_LAWN_1, BACK_LAWN_2, FRONT_LAWN, GREENHOUSE, POWER_24V, SLOPE} from "../../config/relay-names";

interface RelayState {
  enabled: boolean;
  since: Date | null;
}

const getRelayState = (enabled: boolean) => ({
  enabled,
  since: enabled ? new Date() : null,
});

export interface RelayStateStore {
  toggleRelay: (relay: number, state: boolean) => Promise<void>;
  getState: () => Promise<boolean[]>;
  turnOffAllRelays: () => Promise<void>;
}

// Some relays depend on others. Turn them on/off.
// dependant -> dependsOn (eg. needed for dependant to work)
const RELAY_DEPENDENCIES = new Map<number, number>([
  [FRONT_LAWN, POWER_24V],
  [SLOPE, POWER_24V],
  [BACK_LAWN_1, POWER_24V],
  [BACK_LAWN_2, POWER_24V],
  [GREENHOUSE, POWER_24V],
]);
const DEPENDENT_RELAY_DEBOUNCE = 5000;

const getRelaysDependingOn = (relay: number): number[] => {
  const list: number[] = [];
  RELAY_DEPENDENCIES.forEach((dependsOn, dependent) => {
    if (dependsOn === relay) {
      list.push(Number(dependent));
    }
  });
  return list;
};

export const createRelayStore = async (serial: SerialRelay): Promise<RelayStateStore> => {
  const currentState = new Map<number, RelayState>();
  let lastStateRead: Date | null = null;

  const relayState: RelayStateStore = {
    async toggleRelay(relay: number, on: boolean) {
      await serial.toggleRelay(relay, on);
      currentState.set(relay, getRelayState(on));
      // Handle any relay deps
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await handleDependentRelays(relay, on);
    },
    async getState() {
      const res = await serial.getState();
      lastStateRead = new Date();

      res.forEach((isOn, relayNum) => {
        currentState.set(relayNum, getRelayState(isOn));
      });

      return res;
    },
    async turnOffAllRelays() {
      await serial.turnOffAllRelays();
      currentState.forEach((value, relay) => {
        currentState.set(relay, getRelayState(false));
      });
    }
  };

  const handleDependentRelays = async (relay: number, wasEnabled: boolean) => {
    const dependsOn = RELAY_DEPENDENCIES.get(relay);
    if (dependsOn == null) {
      // No dependent relay
      return;
    }
    if (currentState.get(dependsOn)?.enabled === wasEnabled) {
      // State matches desired
      return;
    }
    if (wasEnabled) {
      // Enable relay right away
      await relayState.toggleRelay(dependsOn, wasEnabled);
    } else {
      // When disabling, have a timeout so that the relay isn't toggled too often
      //  as a next dependent relay might be turned on soon.
      setTimeout(function turnOfIfNothingDependsOn() {
        const dependants = getRelaysDependingOn(dependsOn);
        const hasEnabled = dependants.some(depRelay => {
          return currentState.get(depRelay)?.enabled
        });
        if (!hasEnabled) {
          relayState.toggleRelay(dependsOn, false);
        }
      }, DEPENDENT_RELAY_DEBOUNCE);
    }
  };

  // Load initial state
  await relayState.getState();

  return relayState;
}
