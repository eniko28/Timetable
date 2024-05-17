import express from 'express';
import { getClassroomTimetable } from '../controller/classroomTimetableController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/classroomTimetable', authMiddleware(['Admin', 'Student', 'Teacher', 'Scheduler']), getClassroomTimetable);

export default router;
