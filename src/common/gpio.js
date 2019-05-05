// We need to make sure that no command is issues to I2C bus
// while another is already executing.
// This might be good practice for all Raspberry PI GPIO reads.
//
// This module makes sure that only one action gets executed at a time,
// keeping a pool of requests.
//
// A simple mutex lock with a wait time.

const { waitFor } = require('./helpers');

const WAIT = 100;
const requests = [];
let waiting = false;

const execute = async () => {
  if (waiting || requests.length === 0) {
    return;
  }
  waiting = true;

  const { resolve: giveLock } = requests.shift();
  const releaseLock = async () => {
    await waitFor(WAIT);
    waiting = false;
    execute();
  };

  giveLock(releaseLock);
};

const gpioLock = () => new Promise((resolve) => {
  // Should resolve only when we are next in line.
  requests.push({ resolve });
  execute();
});

module.exports = {
  gpioLock,
};
