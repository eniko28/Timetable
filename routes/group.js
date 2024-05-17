import express from 'express';
import { getGroupDetails } from '../controller/groupsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/group', authMiddleware(['Admin', 'Student', 'Teacher', 'Scheduler']), getGroupDetails);

export default router;
