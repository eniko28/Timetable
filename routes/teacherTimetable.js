import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { renderTeacherTimetablePage } from '../controller/teacherTimetableController.js';

const router = express.Router();

router.get(
  '/teacherTimetable',
  authMiddleware(['Admin', 'Teacher', 'Student', 'Scheduler']),
  renderTeacherTimetablePage,
);

export default router;
