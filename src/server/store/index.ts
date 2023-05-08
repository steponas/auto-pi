import setupDb from './connection';
import getStoreSensorData from './sensor-data';
import setupTempHistory from './temp-history';

const connectionPool = setupDb();

export const storeSensorData = getStoreSensorData(connectionPool);
export const getTempHistory = setupTempHistory(connectionPool);
