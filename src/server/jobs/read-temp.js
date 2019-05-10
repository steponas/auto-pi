const { state, KEY_TEMP_SENSOR } = require('../common/state');
const { readSensorData } = require('../../raspberry/dht/sensor');
const { log } = require('../../common/log');

const jobName = 'readTemp';

const readTemp = async () => {
  const { temp, humidity } = await readSensorData();
  state.set(KEY_TEMP_SENSOR, {
    temp,
    humidity,
    time: Date.now(),
  });

  log(jobName, `read done - temp ${temp}, humidity ${humidity}`);
};

module.exports = (setupJob) => {
  setupJob(jobName, '0 */5 * * * *', readTemp);
};
