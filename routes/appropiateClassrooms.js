import express from "express";
import setupDatabase from "../db/dbSetup.js";
import { getTypesByRID } from "../db/subjectTypesDB.js";
import { getSubjectById } from "../db/subjectsDB.js";
import { getClassroomByType } from "../db/classroomDB.js";

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
    const subject = await getSubjectById(db, subjectId);
    const subjectType = subject.type.toString();
    const type = await getTypesByRID(db, subjectType);
    const classrooms = await getClassroomByType(db, type.type);
    res.json(classrooms);
  } catch (error) {
    console.error("Error getting classrooms by subject from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
