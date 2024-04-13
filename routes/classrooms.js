import express from "express";
import * as timetableDB from "../db/timetableDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectBD from "../db/subjectsDB.js";
import { authMiddleware } from "../middleware/auth.js";

import setupDatabase from "../db/dbSetup.js";

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
  "/classrooms",
  authMiddleware(["Admin", "Student", "Teacher", "Scheduler"]),
  async (req, res) => {
    try {
      const { name } = req.query;

      const teachings = await timetableDB.selectTimetableByClassroom(db, name);

      for (const teaching of teachings) {
        const teacher = await teacherDB.getTeacherNameById(
          db,
          teaching.teacherId
        );
        const subject = await subjectBD.getSubjectById(db, teaching.subjectId);

        teaching.teacherName = teacher;
        teaching.subjectId = subject.name;
        teaching.subjectType = subject.type;
      }
      res.render("classrooms", { teachings, name });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
