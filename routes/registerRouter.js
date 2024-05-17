import express from 'express';
import cookieParser from 'cookie-parser';
import { showRegistrationForm, registerUser } from '../controller/registerController.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(cookieParser());

router.get('/register', showRegistrationForm);
router.post('/register', registerUser);

export default router;
