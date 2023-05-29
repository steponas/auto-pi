import { success, error } from 'server/common/response';
import { error as logError } from 'common/log';
import { RelayStateStore } from 'server/store/relay';

export const getRelayStateHandler = (relays: RelayStateStore) => {
  return async function handleGetRelayState(req, res): Promise<void> {
    try {
      res.json(success({
        state: await relays.getState()
      }));
    } catch (e) {
      logError('Could not read relay state: %s', e.message);
      res.status(500).json(error('INTERNAL_ERROR', 'Could not read relay state'));
    }
  };
};
