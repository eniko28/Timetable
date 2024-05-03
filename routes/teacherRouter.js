import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { renderTeacherPage } from "../controller/teacherController.js";

const router = express.Router();

router.get("/teacher", authMiddleware(["Teacher"]), renderTeacherPage);

export default router;
