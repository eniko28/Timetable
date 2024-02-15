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

router.get("/group", async (req, res) => {
  try {
    const name = req.query.name;
    const gradeLevel = req.query.gradeLevel;
    const groups = await groupDB.getGroupsByNameAndGradeLevel(
      db,
      name,
      gradeLevel
    );

    for (const group of groups) {
      const teachings = await teachingDB.getTeachingByGroupId(db, group.id);
      group.teacherIds = teachings.map((teaching) => teaching.teacherId);
      group.subjectId = teachings.map((teaching) => teaching.subjectId);
      group.day = teachings.map((teaching) => teaching.day);
      group.start = teachings.map((teaching) => teaching.start);
      group.end = teachings.map((teaching) => teaching.end);
    }

    res.render("group", { groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
