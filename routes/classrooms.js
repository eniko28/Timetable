import express from 'express';
import { getClassrooms } from '../controller/classroomsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/classrooms', authMiddleware(['Admin', 'Student', 'Teacher', 'Scheduler']), getClassrooms);

export default router;
