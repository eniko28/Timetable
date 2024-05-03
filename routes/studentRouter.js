import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { renderStudentPage } from "../controller/studentController.js";

const router = express.Router();

router.get("/student", authMiddleware(["Student"]), renderStudentPage);

export default router;
