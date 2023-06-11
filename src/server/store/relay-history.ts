import {Pool} from "mysql";
import moment from "moment";

type RelayHistoryStore = {
  store: (arg: {relay: number; relayName: string; enabled: Date; disabled: Date}) => Promise<void>,
};

const INSERT_DATA_QRY = `INSERT INTO relay_history SET ?`;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const getRelayHistoryStore = (connPool: Pool): RelayHistoryStore => {
  return {
    async store({relay, relayName, enabled, disabled}) {
      const params = {
        relay,
        relay_name: relayName,
        enabled: moment(enabled).format(DATE_FORMAT),
        disabled: moment(disabled).format(DATE_FORMAT),
      };
      return new Promise((resolve, reject) =>
        connPool.query(INSERT_DATA_QRY, params, (queryErr): void => {
          if (queryErr) {
            reject(queryErr);
          } else {
            resolve();
          }
        })
      );
    }
  }
};
