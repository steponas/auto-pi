import { success, error } from 'server/common/response';
import { error as logError } from 'common/log';
import {SerialRelay} from "raspberry/serial";

export interface RelayRequest {
  relayNum: number;
  targetState: boolean;
}

export const getRelayHandler = (serial: SerialRelay) => {
  return async function changeRelayHandler(req, res): Promise<void> {
    const data: RelayRequest = req.body;

    if (!data || isNaN(data.relayNum) || typeof data.targetState !== 'boolean') {
      return res.status(409).json(error('BAD_REQUEST', 'request body does not match RelayRequest struct'));
    }

    try {
      await serial.toggleRelay(data.relayNum, data.targetState);
      res.json(success());
    } catch (e) {
      logError('Could not toggle relay #%s to state %s: %s', data.relayNum, data.targetState, e.message);
      res.status(500).json(error('INTERNAL_ERROR', 'Could not set the state'));
    }
  };
};
