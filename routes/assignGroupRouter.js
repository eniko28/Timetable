import express from "express";
import * as teachingDB from "../db/teachingsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectDB from "../db/subjectsDB.js";
import * as groupDB from "../db/groupsDB.js";
import { createEdgeTeacherTeachings } from "../db/createEdges.js";
import { createEdgeGroupTeachings } from "../db/createEdges.js";
import { createEdgesSubjectTeachings } from "../db/createEdges.js";
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

router.get("/assignGroup", async (req, res) => {
  try {
    const groups = await groupDB.getAllGroups(db);
    const subjects = await subjectDB.getAllSubjects(db);
    res.render("assignGroup", { groups, subjects });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/assignGroup", async (req, res) => {
  try {
    const { groupCode, subjectCode } = req.fields;

    if (!groupCode || !subjectCode) {
      return res.status(400).send("Missing required data.");
    }

    await groupDB.insertGroupSubjectId(db, groupCode, subjectCode);

    res.redirect("/assignGroup");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.use("/teachings", async (req, res) => {
  try {
    const teachings = await teachingDB.getAllTeachings(db);
    res.render("teachings", {
      teachings: teachings,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
