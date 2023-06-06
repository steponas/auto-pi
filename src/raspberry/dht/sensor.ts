import * as sensor from 'node-dht-sensor';
import { waitFor } from 'common/helpers';
import { log } from 'common/log';
import { gpioLock } from 'common/gpio';

const TYPE = 22;
const GPIO = 4;

interface SensorData {
  temp: number;
  humidity: number;
}

const readSensor = (): Promise<SensorData> => new Promise(
  (resolve, reject): void => sensor.read(TYPE, GPIO, (err, temp, humidity): void => {
    if (!err) {
      resolve({ temp, humidity });
    } else {
      reject(err);
    }
  })
);

const read = async (): Promise<SensorData> => {
  const unlock = await gpioLock();
  try {
    const data = await readSensor();
    unlock();
    return data;
  } catch (err) {
    unlock();
    throw err;
  }
};

const MAX_READS = 3;
const WAIT = 5000;
// Returns the average of some sensor reads
export const readSensorData = async (): Promise<SensorData> => {
  let reads = 0;
  while (reads < MAX_READS) {
    reads += 1;
    try {
      const data = await read();
      return data;
    } catch (err) {
      // skip error.
      log(`DHT read error: ${err}`);
    }
    await waitFor(WAIT);
  }

  throw new Error('Failed to read DHT sensor data, no value returned');
};
