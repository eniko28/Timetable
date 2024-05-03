import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { renderTimetablePage } from "../controller/timetableController.js";

const router = express.Router();

router.get("/timetable", authMiddleware(["Student"]), renderTimetablePage);

export default router;
