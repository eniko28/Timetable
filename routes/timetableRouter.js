import express from "express";
import * as studentDB from "../db/studentsDB.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as groupDB from "../db/groupsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectDB from "../db/subjectsDB.js";
import * as subjectTypeDB from "../db/subjectTypesDB.js";
import * as subjectClassrooms from "../db/subjectsclassesDB.js";
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

router.get("/timetable", async (req, res) => {
  try {
    const userId = req.session.userId;
    const groupRid = await studentDB.getGroupIdByStudentId(db, userId);
    const groupId = await groupDB.getGroupIdByRid(db, groupRid);
    const teachings = await teachingDB.getTeachingByGroupId(db, groupId[0].id);
    for (const teaching of teachings) {
      const subject = await subjectDB.getSubjectById(db, teaching.subjectId);
      const rid = await subjectDB.getSubjectRidById(db, teaching.subjectId);
      const classroomName = await subjectClassrooms.getSubjectClassroom(
        db,
        teaching.subjectId
      );
      teaching.subjectId = subject.name;
      const type = await subjectTypeDB.getTypesByRID(db, rid.toString());
      teaching.subjectType = type.type;
      teaching.classroomName = classroomName[0].classroomName;
    }
    for (const teaching of teachings) {
      const teacher = await teacherDB.getTeacherById(db, teaching.teacherId);
      teaching.teacherId = teacher.name;
    }
    const group = groupId[0].id;
    res.render("timetable", { teachings, group });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;