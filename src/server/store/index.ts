import setupDb from './connection';
import getStoreSensorData from './sensor-data';

const connectionPool = setupDb();

export const storeSensorData = getStoreSensorData(connectionPool);
