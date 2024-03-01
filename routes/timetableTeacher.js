import express from "express";
import * as timetableDB from "../db/timetableDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectDB from "../db/subjectsDB.js";
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

router.get("/timetableTeacher", async (req, res) => {
  try {
    const userId = req.session.userId;
    const teacher = await teacherDB.getTeacherById(db, userId);
    const teacherName = teacher.name;
    const teachings = await timetableDB.selectTimetableByTeacherId(db, userId);
    for (const teaching of teachings) {
      const subject = await subjectDB.getSubjectById(db, teaching.subjectId);
      teaching.subjectId = subject.name;
      teaching.subjectType = subject.type;
      teaching.classroomName = teaching.classroomName;
      teaching.groupId = teaching.groupId;
    }
    res.render("timetableTeacher", { teachings, teacherName });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
