import express from "express";
import { getClassroomBySubject } from "../controller/appropiateClassroomController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/getClassroomBySubject",
  authMiddleware(["Admin", "Teacher", "Student"]),
  getClassroomBySubject
);

export default router;
