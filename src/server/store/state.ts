import {Pool} from "mysql";
import moment from "moment";

type StateStore = {
  write: (name: string, value: null | any) => Promise<void>,
  read: <T>(name: string) => Promise<T | null>,
};

const INSERT_DATA_QRY = `
  INSERT INTO state SET ?
  ON DUPLICATE KEY UPDATE 
    data = VALUES(data), 
    updated = VALUES(updated)
`;
const DELETE_QRY = `DELETE FROM state WHERE name = ?`;
const READ_QRY = `SELECT data FROM state WHERE name = ?`;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const getStateStore = (connPool: Pool): StateStore => {
  return {
    async write(name, value) {
      if (value == null) {
        // Nullish means remove. Null is returned anyway.
        return new Promise((resolve, reject) =>
          connPool.query(DELETE_QRY, {name}, (queryErr): void => {
            if (queryErr) {
              reject(queryErr);
            } else {
              resolve();
            }
          })
        );
      }
      return new Promise((resolve, reject) =>
        connPool.query(INSERT_DATA_QRY, {
          name,
          data: JSON.stringify(value),
          updated: moment().format(DATE_FORMAT)
        }, (queryErr): void => {
          if (queryErr) {
            reject(queryErr);
          } else {
            resolve();
          }
        })
      );
    },
    async read(name: string) {
      return new Promise((resolve, reject) =>
        connPool.query(READ_QRY, [name], (queryErr, results): void => {
          if (queryErr) {
            reject(queryErr);
          } else {
            if (!results || results.length === 0) {
              resolve(null);
              return;
            }

            try {
              const value = JSON.parse(results[0].data);
              resolve(value);
            } catch (err) {
              console.error('Failed to parse state value from DB: ' + err.message);
              reject(err);
            }
          }
        })
      );
    }
  }
};
