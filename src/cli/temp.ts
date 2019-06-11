import { readSensorData } from 'raspberry/dht/sensor';

const run = async (): Promise<void> => {
  const data = await readSensorData();
  console.log(data);
};

run();
