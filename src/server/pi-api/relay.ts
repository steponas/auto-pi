import { success, error } from 'server/common/response';
import { toggleRelay } from 'raspberry/i2c';
import { error as logError } from 'common/log';

export interface RelayRequest {
  relayNum: number;
  targetState: boolean;
}

/**
 * Get the current temperature.
 */
export default async function changeRelay(req, res): Promise<void> {
  const data: RelayRequest = req.body;

  if (!data || isNaN(data.relayNum) || typeof data.targetState !== 'boolean') {
    return res.status(409).json(error('BAD_REQUEST', 'request body does not match RelayRequest struct'));
  }

  try {
    toggleRelay(data.relayNum, data.targetState);
    res.json(success());
  } catch (e) {
    logError('Could not toggle relay #%s to state %s: %s', data.relayNum, data.targetState, e.message);
    res.status(500).json(error('INTERNAL_ERROR', 'Could not set the state'));
  }
};
