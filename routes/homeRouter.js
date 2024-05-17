import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getHomePage, postHomePage } from '../controller/homeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.static('public'));

router.use(express.static('uploadDir'));

const uploadDir = join(process.cwd(), 'uploadDir');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

router.get('/home', authMiddleware(['Admin', 'Student', 'Teacher', 'Scheduler']), getHomePage);

router.post('/home', authMiddleware(['Teacher', 'Student']), postHomePage);

export default router;
