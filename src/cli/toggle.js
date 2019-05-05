const i2c = require('../raspberry/i2c');

const run = async () => {
  const [, , relayStr, onFlag] = process.argv;
  const relay = parseInt(relayStr, 10);
  const isOn = onFlag === '1';

  await i2c.toggleRelay(relay, isOn);
};

run();
