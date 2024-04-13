import express from "express";
import * as timetableDB from "../db/timetableDB.js";
import * as subjectBD from "../db/subjectsDB.js";
import * as teacherBD from "../db/teachersDB.js";
import setupDatabase from "../db/dbSetup.js";
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
  "/subject",
  authMiddleware(["Admin", "Student", "Teacher", "Scheduler"]),
  async (req, res) => {
    try {
      const { name } = req.query;

      const subjectIds = await subjectBD.getSubjectsByName(db, name);

      const teachings = [];
      for (const subjectId of subjectIds) {
        const subjectTeachings = await timetableDB.selectTimetableBySubjectId(
          db,
          subjectId.id
        );

        for (const teaching of subjectTeachings) {
          const teacher = await teacherBD.getTeacherNameById(
            db,
            teaching.teacherId
          );
          const subject = await subjectBD.getSubjectById(
            db,
            teaching.subjectId
          );

          teaching.teacherName = teacher;
          teaching.subjectId = subject.name;
          teaching.subjectType = subject.type;
          teachings.push(teaching);
        }
      }

      res.render("subject", { teachings, name });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
