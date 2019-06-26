import {Pool} from 'mysql';
import {utc as createUTCTime} from 'moment';

interface SensorDataFn {
  (temp: number, humidity: number): Promise<void>;
}

const QUERY = `INSERT INTO sensor_data SET ?`;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default function setup(connPool: Pool): SensorDataFn {
  return (temp: number, humidity: number): Promise<void> => new Promise((resolve, reject): void => {
    const params = {
      temperature: Number(temp).toFixed(1),
      humidity: humidity,
      date: createUTCTime().format(DATE_FORMAT),
    };
    connPool.query(QUERY, params, (queryErr): void => {
      if (queryErr) {
        reject(queryErr);
      } else {
        resolve();
      }
    });
  });
}