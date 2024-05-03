import express from "express";
import { getGroupsBySubject } from "../controller/getGroupsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/getGroups",
  authMiddleware(["Admin", "Student", "Teacher", "Scheduler"]),
  getGroupsBySubject
);

export default router;
