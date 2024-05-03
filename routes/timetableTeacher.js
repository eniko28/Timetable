import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { renderTimetableTeacherPage } from "../controller/timetableTeacherController.js";

const router = express.Router();

router.get(
  "/timetableTeacher",
  authMiddleware(["Teacher"]),
  renderTimetableTeacherPage
);

export default router;
