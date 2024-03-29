import setupDb from './connection';
import getStoreSensorData from './sensor-data';
import setupTempHistory from './temp-history';
import {getRelayHistoryStore} from './relay-history';
import {getStateStore} from './state';

const connectionPool = setupDb();

export const storeSensorData = getStoreSensorData(connectionPool);
export const getTempHistory = setupTempHistory(connectionPool);
export const relayHistoryStore = getRelayHistoryStore(connectionPool);
export const stateStore = getStateStore(connectionPool);
