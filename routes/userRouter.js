import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { renderUsersPage } from "../controller/userController.js";

const router = express.Router();

router.get(
  "/users",
  authMiddleware(["Scheduler", "Student", "Teacher", "Admin"]),
  renderUsersPage
);

export default router;
