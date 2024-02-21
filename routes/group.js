import express from "express";
import * as timetableDB from "../db/timetableDB.js";
import * as groupDB from "../db/groupsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectBD from "../db/subjectsDB.js";
import * as subjectTypeDB from "../db/subjectTypesDB.js";

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

router.get("/group", async (req, res) => {
  try {
    const { name, gradeLevel } = req.query;
    const groups = await groupDB.getGroupsByNameAndGradeLevel(
      db,
      name,
      gradeLevel
    );
    for (const group of groups) {
      const teachings = await timetableDB.selectTimetableByGroupId(
        db,
        group.id
      );
      for (const teaching of teachings) {
        const teacher = await teacherDB.getTeacherNameById(
          db,
          teaching.teacherId
        );
        const subject = await subjectBD.getSubjectById(db, teaching.subjectId);
        const rid = await subjectBD.getSubjectRidById(db, teaching.subjectId);
        const type = await subjectTypeDB.getTypesByRID(db, rid.toString());

        teaching.teacherName = teacher;
        teaching.subjectId = subject.name;
        teaching.subjectType = type.type;
        teaching.classroomName = teaching.classroomName;
      }
      group.teachings = teachings;
    }
    res.render("group", { groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
