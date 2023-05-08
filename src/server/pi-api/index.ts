import {Router} from 'express';
import tempHandler from './temp';
import relayHandler from './relay';
import relayStateHandler from './relay-state';
import {handleTempHistory} from 'server/pi-api/temp-history';

const router = Router();
router.get('/temp', tempHandler);
router.get('/temp-history', handleTempHistory);
router.get('/relay-state', relayStateHandler);
router.post('/relay', relayHandler);

export default router;
