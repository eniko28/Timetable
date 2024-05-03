import express from "express";
import * as subjectsDB from "../db/subjectsDB.js";
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

router.get("/addSubjects", authMiddleware(["Admin"]), (req, res) => {
  try {
    res.render("addSubjects", {});
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/addSubjects", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const { code, name, type } = req.fields;

    if (!code || !name || !type) {
      return res.status(400).send("Missing required data.");
    }

    const existingSubject = await subjectsDB.getSubjectById(db, code);
    const existingNameAndType = await subjectsDB.getAllSubjectsByNameAndType(
      db,
      name,
      type
    );

    if (existingSubject !== null || existingNameAndType.length !== 0) {
      return res.status(400).render("error", {
        message: "Subject already exists.",
      });
    }

    await subjectsDB.insertSubject(db, code, name, type);
    return res.redirect("/addSubjects");
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.use("/subjects", async (req, res) => {
  try {
    const subjects = await subjectsDB.getAllSubjects(db);
    return res.render("subjects", {
      subjects,
    });
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
