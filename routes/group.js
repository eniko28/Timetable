import express from "express";
import * as timetableDB from "../db/timetableDB.js";
import * as groupDB from "../db/groupsDB.js";
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
  "/group",
  authMiddleware(["Admin", "Student", "Teacher"]),
  async (req, res) => {
    try {
      const { name, gradeLevel } = req.query;
      let groups = await groupDB.getGroupsByNameAndGradeLevel(
        db,
        name,
        gradeLevel
      );

      for (const group of groups) {
        const teachings = await timetableDB.selectTimetableByGroupId(
          db,
          group.id
        );

        group.teachings = [];

        for (const teaching of teachings) {
          const teacher = await teacherDB.getTeacherNameById(
            db,
            teaching.teacherId
          );
          const subject = await subjectBD.getSubjectById(
            db,
            teaching.subjectId
          );

          const newTeaching = {
            teacherName: teacher,
            subjectId: subject.name,
            subjectType: subject.type,
            classroomName: teaching.classroomName,
            day: teaching.day,
            start: teaching.start,
            end: teaching.end,
            groupId: teaching.groupId,
          };

          group.teachings.push(newTeaching);
        }
      }
      res.render("group", { groups });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
