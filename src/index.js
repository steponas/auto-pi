const i2c = require('./raspberry/i2c');
const { waitFor } = require('./common/helpers');

const start = async () => {
  for (let i = 1; i <= 7; i += 1) {
    await i2c.toggleRelay(i, true);
    await waitFor(5 * 1000);
    await i2c.toggleRelay(i, false);
    await waitFor(1000);
  }
};

start();
