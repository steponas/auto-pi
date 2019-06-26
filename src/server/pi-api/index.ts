import {Router} from 'express';
import tempHandler from './temp';
import relayHandler from './relay';
import relayStateHandler from './relay-state';

const router = Router();
router.get('/temp', tempHandler);
router.get('/relay-state', relayStateHandler);
router.post('/relay', relayHandler);

export default router;
