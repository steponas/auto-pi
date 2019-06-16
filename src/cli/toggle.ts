import {toggleRelay} from 'raspberry/i2c';

const run = async (): Promise<void> => {
  const [, , relayStr, onFlag] = process.argv;
  const relay = parseInt(relayStr, 10);
  const isOn = onFlag === '1';

  await toggleRelay(relay, isOn);
};

run();
