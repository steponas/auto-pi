const i2c = require('../raspberry/i2c');

const run = async () => {
  await i2c.turnAllOff();
};

run();
