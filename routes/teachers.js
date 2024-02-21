import express from "express";
import * as timetableDB from "../db/timetableDB.js";
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

router.get("/teachers", async (req, res) => {
  try {
    const { name, id } = req.query;

    const teachings = await timetableDB.selectTimetableByTeacherId(db, id);

    for (const teaching of teachings) {
      const subject = await subjectBD.getSubjectById(db, teaching.subjectId);
      const rid = await subjectBD.getSubjectRidById(db, teaching.subjectId);
      const type = await subjectTypeDB.getTypesByRID(db, rid.toString());

      teaching.subjectId = subject.name;
      teaching.subjectType = type.type;
    }
    res.render("teachers", { teachings, name });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;