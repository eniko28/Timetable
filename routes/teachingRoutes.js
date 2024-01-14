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

router.get("/addTeachings", async (req, res) => {
  try {
    const teachers = await teacherDB.getAllTeachers(db);
    const subjects = await subjectDB.getAllSubjects(db);
    const groups = await groupDB.getAllGroups(db);
    res.render("addTeachings", { teachers, subjects, groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/addTeachings", async (req, res) => {
  try {
    const { teachingId, teacherCode, subjectCode, groupCode, day, start, end } =
      req.fields;

    if (
      !teachingId ||
      !teacherCode ||
      !groupCode ||
      !subjectCode ||
      !day ||
      !start ||
      !end
    ) {
      return res.status(400).send("Missing required data.");
    }

    await teachingDB.insertTeaching(
      db,
      teachingId,
      teacherCode,
      groupCode,
      subjectCode,
      day,
      start,
      end
    );

    const teacher = await teacherDB.getTeacherById(db, teacherCode);
    const group = await groupDB.getGroupById(db, groupCode);
    const teachings = await teachingDB.getTeachingById(db, teachingId);
    const subject = await subjectDB.getSubjectById(db, subjectCode);

    createEdgeTeacherTeachings(db, teacher, teachings);
    createEdgeGroupTeachings(db, group, teachings);
    createEdgesSubjectTeachings(db, subject, teachings);

    res.redirect("/teachings");
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
