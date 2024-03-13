import express from "express";
import * as subjectDB from "../db/subjectsDB.js";
import setupDatabase from "../db/dbSetup.js";
import { authMiddleware } from "../middleware/auth.js";

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
  "/subjectTimetable",
  authMiddleware(["Admin", "Student", "Teacher"]),
  async (req, res) => {
    try {
      const subjects = await subjectDB.getAllSubjects(db);
      res.render("subjectTimetable", { subjects });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
