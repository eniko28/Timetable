import express from 'express';
import { getGroupTimetable } from '../controller/groupTimetableController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/groupTimetable', authMiddleware(['Admin', 'Teacher', 'Student', 'Scheduler']), getGroupTimetable);

export default router;
