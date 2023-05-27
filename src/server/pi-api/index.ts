import {Router} from 'express';
import tempHandler from './temp';
import {getRelayHandler} from './relay';
import {getRelayStateHandler} from './relay-state';
import {handleTempHistory} from 'server/pi-api/temp-history';
import {SerialRelay} from "raspberry/serial";
import {createRelayStore} from "server/store/relay";

export const getPiApiRouter = async () => {
  const serial = new SerialRelay();
  const relayState = await createRelayStore(serial);
  // Turn off relays after the server starts, for a clean state.
  setTimeout(async () => {
    try {
      serial.turnOffAllRelays();
    } catch (e) {
      console.error('Initial relay turning off failed: ' + e.message);
    }
  }, 1000);

  const router = Router();
  router.get('/temp', tempHandler);
  router.get('/temp-history', handleTempHistory);
  router.get('/relay-state', getRelayStateHandler(relayState));
  router.post('/relay', getRelayHandler(relayState));

  return router;
}
