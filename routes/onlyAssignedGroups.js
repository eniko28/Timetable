import express from "express";
import setupDatabase from "../db/dbSetup.js";
import { getGroupsBySubjectId } from "../db/groupsDB.js";

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

router.get("/getGroupsBySubject", async (req, res) => {
  try {
    var subjectId = req.query.subjectId;
    const result = await getGroupsBySubjectId(db, subjectId);
    res.send(result);
  } catch (error) {
    console.error("Error getting groups by subject from database:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;