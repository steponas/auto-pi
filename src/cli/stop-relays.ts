import { turnAllOff } from 'raspberry/i2c';

const run = async (): Promise<void> => {
  await turnAllOff();
};

run();
