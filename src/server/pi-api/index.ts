import {Router} from 'express';
import tempHandler from './temp';

const router = Router();
router.get('/temp', tempHandler);

export default router;
