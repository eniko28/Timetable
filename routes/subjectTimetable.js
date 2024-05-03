import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { renderSubjectTimetablePage } from "../controller/subjectTimetableController.js";

const router = express.Router();

router.get(
  "/subjectTimetable",
  authMiddleware(["Admin", "Student", "Teacher", "Scheduler"]),
  renderSubjectTimetablePage
);

export default router;
