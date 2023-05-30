import {Router} from 'express';
import tempHandler from './temp';
import {getRelayHandler} from './relay';
import {getRelayStateHandler} from './relay-state';
import {handleTempHistory} from 'server/pi-api/temp-history';
import {RelayStateStore} from "server/store/relay";

export const getPiApiRouter = (relayState: RelayStateStore) => {
  const router = Router();
  router.get('/temp', tempHandler);
  router.get('/temp-history', handleTempHistory);
  router.get('/relay-state', getRelayStateHandler(relayState));
  router.post('/relay', getRelayHandler(relayState));

  return router;
}
