import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { renderSchedulerPage } from '../controller/schedulerController.js';

const router = express.Router();

router.get('/scheduler', authMiddleware(['Scheduler']), renderSchedulerPage);

export default router;
