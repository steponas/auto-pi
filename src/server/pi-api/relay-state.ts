import { success, error } from 'server/common/response';
import { getState } from 'raspberry/i2c';
import { error as logError } from 'common/log';

interface RelayRequest {
  relayNum: number;
  targetState: boolean;
}

/**
 * Get the current temperature.
 */
export default async function getRelayState(req, res): Promise<void> {
  try {
    res.json(success({
      state: await getState()
    }));
  } catch (e) {
    logError('Could not read relay state: %s', e.message);
    res.status(500).json(error('INTERNAL_ERROR', 'Could not read relay state'));
  }
};
