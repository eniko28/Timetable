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

router.get("/groupTimetable", async (req, res) => {
  try {
    const groups = await groupDB.getAllGroups(db);
    res.render("groupTimetable", { groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
