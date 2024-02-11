import express from "express";
import * as teachingDB from "../db/teachingsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectDB from "../db/subjectsDB.js";
import * as groupDB from "../db/groupsDB.js";
import { createEdgeTeacherTeachings } from "../db/createEdges.js";
import { createEdgeGroupTeachings } from "../db/createEdges.js";
import { createEdgesSubjectTeachings } from "../db/createEdges.js";
import setupDatabase from "../db/dbSetup.js";
import { v4 as uuidv4 } from "uuid";

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
    const id = req.session.userId;
    const subjects = await teacherDB.getTeacherSubjects(db, id);
    const groups = await groupDB.getAllGroups(db);
    res.render("addTeachings", { id, subjects, groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/addTeachings", async (req, res) => {
  try {
    const { teacherCode, subjectCode, groupCode, day, start, end } = req.fields;

    if (!teacherCode || !groupCode || !subjectCode || !day || !start || !end) {
      return res.status(400).send("Missing required data.");
    }

    const timeFormat = /^(?:0[89]|1[0-9]|20):[0-5][0-9]$/;
    if (!start.match(timeFormat) || !end.match(timeFormat)) {
      return res
        .status(400)
        .send("Invalid time format. Please use HH:mm between 8:00 and 20:00.");
    }

    const startTime = new Date(`2000-01-01T${start}:00Z`);
    const endTime = new Date(`2000-01-01T${end}:00Z`);

    if (startTime > endTime) {
      return res.status(400).send("Start time must be before end time.");
    }

    const teachingId = uuidv4();

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

    res.redirect("/addTeachings");
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
