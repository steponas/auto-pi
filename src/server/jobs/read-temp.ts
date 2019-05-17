import { state, KEY_TEMP_SENSOR } from 'server/common/state';
import { readSensorData } from 'raspberry/dht/sensor';
import { log } from 'common/log';

const jobName = 'readTemp';

const readTemp = async (): Promise<void> => {
  const { temp, humidity } = await readSensorData();
  state.set(KEY_TEMP_SENSOR, {
    temp,
    humidity,
    time: Date.now(),
  });

  log(jobName, `read done - temp ${temp}, humidity ${humidity}`);
};

module.exports = (setupJob): void => {
  setupJob(jobName, '0 */5 * * * *', readTemp);
};
