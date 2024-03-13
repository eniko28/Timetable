import express from "express";
import setupDatabase from "../db/dbSetup.js";
import * as teachingDB from "../db/teachingsDB.js";
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
  "/getGroups",
  authMiddleware(["Admin", "Student", "Teacher"]),
  async (req, res) => {
    try {
      const { subjectCode } = req.query;
      const groups = await teachingDB.getGroupBySubjectId(db, subjectCode);
      res.json(groups);
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
