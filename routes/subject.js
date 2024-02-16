import express from "express";
import * as timetableDB from "../db/timetableDB.js";
import * as groupDB from "../db/groupsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectBD from "../db/subjectsDB.js";
import * as subjectClassrooms from "../db/subjectsclassesDB.js";
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

router.get("/subject", async (req, res) => {
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
        const subject = await subjectBD.getSubjectById(db, teaching.subjectId);
        const rid = await subjectBD.getSubjectRidById(db, teaching.subjectId);
        const type = await subjectTypeDB.getTypesByRID(db, rid.toString());

        teaching.subjectId = subject.name;
        teaching.subjectType = type.type;
        teachings.push(teaching);
      }
    }

    res.render("subject", { teachings, name });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
