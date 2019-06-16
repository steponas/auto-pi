// On not-raspberry env the 'node-dht-sensor' is not found
// @ts-ignore
import * as sensor from 'node-dht-sensor';
import { waitFor } from 'common/helpers';
import { log } from 'common/log';
import { gpioLock } from 'common/gpio';

const TYPE = 11;
const GPIO = 10;

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

const AVG_READS = 3;
const WAIT = 1000;
// Returns the average of some sensor reads
export const readSensorData = async (): Promise<SensorData> => {
  let reads = 0;
  let temp = 0;
  let humidity = 0;
  let initial = true;
  do {
    try {
      const data = await read();

      if (initial) {
        // Seems like the sensor returns the previous read value when measuring
        // the first time in a while. Just skip the first result.
        initial = false;
        continue;
      }

      reads += 1;

      temp += data.temp;
      humidity += data.humidity;
    } catch (err) {
      // skip error.
      log(`DHT read error: ${err}`);
    }
    await waitFor(WAIT);
  } while (reads < AVG_READS);

  return {
    temp: Math.round(temp / AVG_READS),
    humidity: Math.round(humidity / AVG_READS),
  };
};
