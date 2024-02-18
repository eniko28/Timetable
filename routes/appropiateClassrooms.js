import express from "express";
import setupDatabase from "../db/dbSetup.js";
import * as classroomDB from "../db/classroomDB.js";
import * as subjectBD from "../db/subjectsDB.js";
import * as subjectTypesDB from "../db/subjectTypesDB.js";

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

router.get("/getClassroomBySubject", async (req, res) => {
  try {
    var subjectId = req.query.subjectId;
    const subject = await subjectBD.getSubjectById(db, subjectId);
    const subjectType = subject.type.toString();
    const type = await subjectTypesDB.getTypesByRID(db, subjectType);
    const classrooms = await classroomDB.getClassroomByType(db, type.type);
    res.json(classrooms);
  } catch (error) {
    console.error("Error getting classrooms by subject from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
