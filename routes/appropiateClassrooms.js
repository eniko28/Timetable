import express from "express";
import setupDatabase from "../db/dbSetup.js";
import * as classroomDB from "../db/classroomDB.js";
import * as subjectBD from "../db/subjectsDB.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

router.get(
  "/getClassroomBySubject",
  authMiddleware(["Admin", "Teacher", "Student"]),
  async (req, res) => {
    try {
      const { subjectId } = req.query;
      const subject = await subjectBD.getSubjectById(db, subjectId);
      const { type } = subject;
      const classrooms = await classroomDB.getClassroomByType(db, type);
      res.json(classrooms);
    } catch (error) {
      console.error(
        "Error getting classrooms by subject from database:",
        error
      );
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
