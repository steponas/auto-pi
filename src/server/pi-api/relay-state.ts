import { success, error } from 'server/common/response';
import { error as logError } from 'common/log';
import {SerialRelay} from "raspberry/serial";

export const getRelayStateHandler = (serial: SerialRelay) => {
  return async function handleGetRelayState(req, res): Promise<void> {
    try {
      res.json(success({
        state: await serial.getState()
      }));
    } catch (e) {
      logError('Could not read relay state: %s', e.message);
      res.status(500).json(error('INTERNAL_ERROR', 'Could not read relay state'));
    }
  };
};
