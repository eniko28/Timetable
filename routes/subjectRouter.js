import express from "express";
import * as subjectsDB from "../db/subjectsDB.js";
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

router.get("/addSubjects", async (req, res) => {
  try {
    res.render("addSubjects", {});
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/addSubjects", async (req, res) => {
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
      res.status(400).render("error", {
        message: "Subject already exists.",
      });
      return;
    }

    await subjectsDB.insertSubject(db, code, name, type);
    res.redirect("/addSubjects");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.use("/subjects", async (req, res) => {
  try {
    const subjects = await subjectsDB.getAllSubjects(db);
    res.render("subjects", {
      subjects: subjects,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
