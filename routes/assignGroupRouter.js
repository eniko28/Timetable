import express from 'express';
import { assignGroupGet, assignGroupPost, getGroupSubjects } from '../controller/assignGroupController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/assignGroup', authMiddleware(['Admin']), assignGroupGet);
router.post('/assignGroup', authMiddleware(['Admin']), assignGroupPost);
router.get('/getGroupSubjects', getGroupSubjects);

export default router;
