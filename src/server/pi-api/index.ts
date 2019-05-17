import express from 'express';

const router = express.Router();
router.get('/temp', require('./temp'));

export default router;
