import express from "express";
import * as studentDB from "../db/studentsDB.js";
import * as timetableDB from "../db/timetableDB.js";
import * as groupDB from "../db/groupsDB.js";
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

export const renderTimetablePage = async (req, res) => {
  try {
    const { userId } = req.session;
    const groupId = await studentDB.getGroupIdByStudentId(db, userId);
    const teachings = await timetableDB.selectTimetableByGroupId(db, groupId);

    await Promise.all(
      teachings.map(async (teaching) => {
        const subjectPromise = subjectDB.getSubjectById(db, teaching.subjectId);
        const teacherPromise = teacherDB.getTeacherById(db, teaching.teacherId);

        const [subject, teacher] = await Promise.all([
          subjectPromise,
          teacherPromise,
        ]);

        teaching.subjectName = subject.name;
        teaching.subjectType = subject.type;
        teaching.teacherName = teacher.name;
      })
    );

    const group = groupId;
    const groupName = await groupDB.getGroupsNameById(db, group);
    const groupsName = groupName[0].name;

    res.render("timetable", { teachings, groupsName, group });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export default router;
