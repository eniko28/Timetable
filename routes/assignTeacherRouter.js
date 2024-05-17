import express from 'express';
import { assignTeacherGet, assignTeacherPost } from '../controller/assignTeacherController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/assignTeacher', authMiddleware(['Admin']), assignTeacherGet);

router.post('/assignTeacher', authMiddleware(['Admin']), assignTeacherPost);

export default router;
