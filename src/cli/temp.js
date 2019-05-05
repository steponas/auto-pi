const { readSensorData } = require('../raspberry/dht/sensor');

const run = async () => {
  const data = await readSensorData();
  console.log(data);
};

run();
