import express from "express";
import * as classroomDB from "../db/classroomDB.js";
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
  "/classroomTimetable",
  authMiddleware(["Admin", "Student", "Teacher", "Scheduler"]),
  async (req, res) => {
    try {
      const classrooms = await classroomDB.getAllClassrooms(db);
      res.render("classroomTimetable", { classrooms });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
