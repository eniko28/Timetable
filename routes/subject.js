import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { renderSubjectPage } from '../controller/subjectsController.js';

const router = express.Router();

router.get('/subject', authMiddleware(['Admin', 'Student', 'Teacher', 'Scheduler']), renderSubjectPage);

export default router;
