import {Router} from 'express';

const router = Router();
router.get('/temp', require('./temp'));

export default router;
