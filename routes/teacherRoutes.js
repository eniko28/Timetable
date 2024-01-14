import express from "express";
import * as teachersDB from "../db/teachersDB.js";
import * as usersDB from "../db/usersDB.js";
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

router.get("/addTeachers", async (req, res) => {
  try {
    const teachers = await usersDB.getTeachers(db);
    console.log(teachers);
    res.render("addTeachers", { teachers });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/addTeachers", async (req, res) => {
  try {
    const { teacherCode, subjectCode } = req.fields;

    if (!teacherCode || !subjectCode) {
      return res.status(400).send("Missing required data.");
    }

    await teachersDB.insertTeachersSubjectId(db, teacherCode, subjectCode);

    res.redirect("/teachers");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.use("/teachers", async (req, res) => {
  try {
    const teachers = await teachersDB.getAllTeachers(db);
    res.render("teachers", {
      teachers: teachers,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
