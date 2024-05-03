import express from "express";
import * as timetableDB from "../db/timetableDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectDB from "../db/subjectsDB.js";
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

      const teacherPromises = teachings.map((teaching) =>
        teacherDB.getTeacherNameById(db, teaching.teacherId)
      );
      const subjectPromises = teachings.map((teaching) =>
        subjectDB.getSubjectById(db, teaching.subjectId)
      );

      const teachers = await Promise.all(teacherPromises);
      const subjects = await Promise.all(subjectPromises);

      teachings.forEach((teaching, index) => {
        teaching.teacherName = teachers[index];
        teaching.subjectId = subjects[index].name;
        teaching.subjectType = subjects[index].type;
      });

      res.render("classrooms", { teachings, name });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
