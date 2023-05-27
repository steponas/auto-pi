import {Router} from 'express';
import tempHandler from './temp';
import {getRelayHandler} from './relay';
import {getRelayStateHandler} from './relay-state';
import {handleTempHistory} from 'server/pi-api/temp-history';
import {SerialRelay} from "raspberry/serial";

const serial = new SerialRelay();
// Turn off relays after the server starts, for a clean state.
setTimeout(() => {
  try {
    serial.turnOffAllRelays();
  } catch (e) {
    console.error('Initial relay turning off failed: ' + e.message);
  }
}, 1000);

const router = Router();
router.get('/temp', tempHandler);
router.get('/temp-history', handleTempHistory);
router.get('/relay-state', getRelayStateHandler(serial));
router.post('/relay', getRelayHandler(serial));

export default router;
