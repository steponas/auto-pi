import {SerialRelay} from 'raspberry/serial';
import {BACK_LAWN_1, BACK_LAWN_2, FRONT_LAWN, GREENHOUSE, POWER_24V, relayNames, SLOPE} from "../../config/relay-names";
import {RelayStateResponse} from "common/relays";
import {relayHistoryStore} from './index';

interface RelayState {
  enabled: boolean;
  enabledUntil: Date | null;
  since: Date | null;
  offTimeout: number | null;
}

const getRelayState = (enabled: boolean, until: Date | null, timeout: number | null): RelayState => ({
  enabled,
  enabledUntil: until,
  since: enabled ? new Date() : null,
  offTimeout: timeout,
});

export interface RelayStateStore {
  toggleRelay: (relay: number, state: boolean, until: Date | null) => Promise<void>;
  getState: () => Promise<RelayStateResponse[]>;
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

  const relayState: RelayStateStore = {
    async toggleRelay(relay: number, on: boolean, until: Date | null) {
      const previousState = currentState.get(relay);
      if (previousState?.offTimeout) {
        clearTimeout(previousState.offTimeout);
      }
      await serial.toggleRelay(relay, on);
      if (!on && previousState?.since) {
        // Log relay state
        relayHistoryStore.store({
          relay,
          relayName: relayNames[relay] ?? 'Unknown name',
          enabled: previousState.since,
          disabled: new Date(),
        }).catch(err => {
          // Error. Oops.
          console.error('Failed to store relay history: ' + err.message);
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const timeout = on && until ? setRelayOffTimeout(relay, until) : null;
      currentState.set(relay, getRelayState(on, until, timeout));
      // Handle any relay deps
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await handleDependentRelays(relay, on);
    },
    async getState() {
      const result: RelayStateResponse[] = [];
      currentState.forEach((val, relay) => {
        result[relay] = {
          enabled: val.enabled,
          enabledSince: val.since?.toISOString(),
          enabledUntil: val.enabledUntil?.toISOString(),
        };
      });
      return result;
    },
    async turnOffAllRelays() {
      await serial.turnOffAllRelays();
      currentState.forEach((value, relay) => {
        if (value.enabled) {
          relayState.toggleRelay(relay, false, null);
        }
      });
    }
  };

  const setRelayOffTimeout = (relay: number, until: Date): number | null => {
    const ms = until.valueOf() - Date.now();
    if (ms <= 0) {
      // Invalid duration.
      console.error(`Invalid duration "${ms}" for timeout on relay ${relay}`);
      return null;
    }
    return setTimeout(() => {
      relayState.toggleRelay(relay, false, null);
    }, ms);
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
      await relayState.toggleRelay(dependsOn, wasEnabled, null);
    } else {
      // When disabling, have a timeout so that the relay isn't toggled too often
      //  as a next dependent relay might be turned on soon.
      setTimeout(function turnOfIfNothingDependsOn() {
        const dependants = getRelaysDependingOn(dependsOn);
        const hasEnabled = dependants.some(depRelay => {
          return currentState.get(depRelay)?.enabled
        });
        if (!hasEnabled) {
          relayState.toggleRelay(dependsOn, false, null);
        }
      }, DEPENDENT_RELAY_DEBOUNCE);
    }
  };

  // Load initial state
  const res = await serial.getState();
  res.forEach((isOn, relayNum) => {
    currentState.set(relayNum, getRelayState(isOn, null, null));
  });

  return relayState;
}
