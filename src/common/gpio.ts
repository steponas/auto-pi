// We need to make sure that no command is issues to I2C bus
// while another is already executing.
// This might be good practice for all Raspberry PI GPIO reads.
//
// This module makes sure that only one action gets executed at a time,
// keeping a pool of requests.
//
// A simple mutex lock with a wait time.

import { waitFor } from './helpers';

interface Resolver {
  (releaseLock: () => Promise<void>): void;
}

const WAIT = 100;
const requests: Resolver[] = [];
let waiting = false;

export const execute = async (): Promise<void> => {
  if (waiting) {
    return;
  }

  const resolveNext = requests.shift();
  if (!resolveNext) {
    return;
  }

  waiting = true;

  const releaseLock = async (): Promise<void> => {
    await waitFor(WAIT);
    waiting = false;
    execute();
  };

  resolveNext(releaseLock);
};

export const gpioLock = (): Promise<() => Promise<void>> => new Promise((resolve): void => {
  // Should resolve only when we are next in line.
  requests.push(resolve as () => Promise<void>);
  execute();
});
