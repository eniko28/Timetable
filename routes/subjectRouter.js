import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  renderAddSubjectsPage,
  handleAddSubjects,
  renderSubjectsPage,
} from "../controller/subjectAddController.js";

const router = express.Router();

router.get("/addSubjects", authMiddleware(["Admin"]), renderAddSubjectsPage);

router.post("/addSubjects", authMiddleware(["Admin"]), handleAddSubjects);

router.use("/subjects", renderSubjectsPage);

export default router;
