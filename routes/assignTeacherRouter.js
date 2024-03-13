import express from "express";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectDB from "../db/subjectsDB.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as teacherTeaching from "../db/teachersTeachingEdge.js";
import {
  createEdgeTeacherTeachings,
  createEdgesSubjectTeachings,
} from "../db/createEdges.js";
import setupDatabase from "../db/dbSetup.js";
import { v4 as uuidv4 } from "uuid";
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

router.get("/assignTeacher", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const teachers = await teacherDB.getAllTeachers(db);
    const subjects = await subjectDB.getAllSubjects(db);
    res.render("assignTeacher", { teachers, subjects });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/assignTeacher", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const { teacherCode, subjectCode } = req.fields;

    if (!teacherCode || !subjectCode) {
      return res.status(400).send("Missing required data.");
    }
    const existingTeaching = await teacherTeaching.getTeachersSubjects(
      db,
      teacherCode,
      subjectCode
    );
    if (existingTeaching.length !== 0) {
      res.status(400).render("error", {
        message: "Teacher already assigned to selected subject.",
      });
      return;
    }
    const teacherExists = await teachingDB.getTeacherBySubjectId(
      db,
      subjectCode
    );
    var teachingId = uuidv4();
    if (teacherExists.length === 0) {
      await teachingDB.insertSubjectAndTeacher(
        db,
        teachingId,
        teacherCode,
        subjectCode
      );
    } else {
      if (teacherExists[0].teacherId === teacherCode) {
        res.status(400).render("error", {
          message: "Teacher already assigned to selected subject.",
        });
        return;
      } else {
        await teachingDB.updateTeacher(db, teacherCode, subjectCode);
        const id = await teachingDB.getTeachingIdByTeacherAndSubject(
          db,
          subjectCode,
          teacherCode
        );
        teachingId = id[0].id;
      }
    }

    const teacher = await teacherDB.getTeacherById(db, teacherCode);
    const teaching = await teachingDB.getTeachingById(db, teachingId);
    const subject = await subjectDB.getSubjectById(db, subjectCode);
    await createEdgeTeacherTeachings(
      db,
      teacher,
      teaching,
      teacherCode,
      subjectCode
    );
    await createEdgesSubjectTeachings(
      db,
      subject,
      teaching,
      subjectCode,
      teacherCode
    );
    res.redirect("/assignTeacher");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
