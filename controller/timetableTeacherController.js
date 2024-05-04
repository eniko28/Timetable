import express from "express";
import * as timetableDB from "../model/timetableDB.js";
import * as teacherDB from "../model/teachersDB.js";
import * as subjectDB from "../model/subjectsDB.js";
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

export const renderTimetableTeacherPage = async (req, res) => {
  try {
    const { userId } = req.session;
    const teacher = await teacherDB.getTeacherById(db, userId);
    const teacherName = teacher.name;
    const teachings = await timetableDB.selectTimetableByTeacherId(db, userId);

    await Promise.all(
      teachings.map(async (teaching) => {
        const subject = await subjectDB.getSubjectById(db, teaching.subjectId);
        teaching.subjectId = subject.name;
        teaching.subjectType = subject.type;
      })
    );

    res.render("timetableTeacher", { teachings, teacherName });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export default router;
