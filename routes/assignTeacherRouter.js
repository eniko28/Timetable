import express from "express";
import * as wishlistDB from "../db/wishlistsDB.js";
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

router.get("/assignTeacher", async (req, res) => {
  try {
    const teachers = await teacherDB.getAllTeachers(db);
    const subjects = await subjectDB.getAllSubjects(db);
    res.render("assignTeacher", { teachers, subjects });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/assignTeacher", async (req, res) => {
  try {
    const { teacherCode, subjectCode } = req.fields;

    if (!teacherCode || !subjectCode) {
      return res.status(400).send("Missing required data.");
    }

    await teacherDB.insertTeachersSubjectId(db, teacherCode, subjectCode);

    res.redirect("/assignTeacher");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
