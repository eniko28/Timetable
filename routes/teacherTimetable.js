import express from "express";
import * as teacherDB from "../db/teachersDB.js";
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

router.get("/teacherTimetable", async (req, res) => {
  try {
    const teachers = await teacherDB.getAllTeachers(db);
    res.render("teacherTimetable", { teachers });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;