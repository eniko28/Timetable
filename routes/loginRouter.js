import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { getLoginPage, postLogin } from '../controller/loginController.js';

const router = express.Router();

dotenv.config();
const secret = process.env.SECRET;

router.use(express.urlencoded({ extended: true }));

router.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
  }),
);
router.get('/', getLoginPage);
router.post('/login', postLogin);

export default router;
