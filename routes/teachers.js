import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { renderTeachersPage } from '../controller/teachersController.js';

const router = express.Router();

router.get('/teachers', authMiddleware(['Teacher', 'Admin', 'Student', 'Scheduler']), renderTeachersPage);

export default router;
