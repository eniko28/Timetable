import express from "express";
import * as subjectDB from "../db/subjectsDB.js";
import * as groupDB from "../db/groupsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as groupTeaching from "../db/groupTeachingsEdge.js";
import {
  createEdgeGroupTeachings,
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

router.get("/assignGroup", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const groups = await groupDB.getAllGroups(db);
    const subjects = await subjectDB.getAllSubjects(db);
    res.render("assignGroup", { groups, subjects });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/assignGroup", authMiddleware("Admin"), async (req, res) => {
  try {
    const { groupCode, subjectCode } = req.fields;

    if (!groupCode || !subjectCode) {
      return res.status(400).send("Missing required data.");
    }

    const existingTeaching = await groupTeaching.getSubjectsGroups(
      db,
      subjectCode,
      groupCode
    );
    if (existingTeaching.length !== 0) {
      res.status(400).render("error", {
        message: "Subject already assigned to selected group.",
      });
      return;
    }
    const groupExists = await teachingDB.getGroupBySubjectId(db, subjectCode);
    var teachingId = uuidv4();
    if (groupExists.length === 0) {
      await teachingDB.insertSubjectAndGroup(
        db,
        teachingId,
        subjectCode,
        groupCode
      );
    } else {
      if (groupExists[0].groupId == groupCode) {
        res.status(400).render("error", {
          message: "Subject already assigned to selected group.",
        });
        return;
      } else if (groupExists[0].groupId) {
        const teacherId = await teachingDB.getTeacherBySubjectId(
          db,
          subjectCode
        );
        if (teacherId[0].teacherId === undefined) {
          await teachingDB.insertSubjectAndGroup(
            db,
            teachingId,
            subjectCode,
            groupCode
          );
        } else {
          await teachingDB.insertTeaching(
            db,
            teachingId,
            teacherId[0].teacherId,
            subjectCode,
            groupCode
          );
          const teacher = await teacherDB.getTeacherById(
            db,
            teacherId[0].teacherId
          );
          const teaching = await teachingDB.getTeachingById(db, teachingId);
          const subject = await subjectDB.getSubjectById(db, subjectCode);
          await createEdgeTeacherTeachings(
            db,
            teacher,
            teaching,
            teacherId[0].teacherId,
            subjectCode
          );
          await createEdgesSubjectTeachings(
            db,
            subject,
            teaching,
            subjectCode,
            teacherId[0].teacherId
          );
        }
        const teaching = await teachingDB.getTeachingById(db, teachingId);
        const teacher = await teacherDB.getTeacherById(
          db,
          teacherId[0].teacherId
        );
        const subject = await subjectDB.getSubjectById(db, subjectCode);
      } else {
        await teachingDB.updateGroup(db, subjectCode, groupCode);
        const id = await teachingDB.getTeachingIdBySubjectAndGroup(
          db,
          subjectCode,
          groupCode
        );
        teachingId = id[0].id;
      }
    }
    const all = await teachingDB.getTeachingsByGroupAndSubjectId(
      db,
      groupCode,
      subjectCode
    );
    for (const teachingRecord of all) {
      const teaching = await teachingDB.getTeachingById(db, teachingRecord.id);
      const group = await groupDB.getGroupById(db, groupCode);
      await createEdgeGroupTeachings(
        db,
        group,
        teaching,
        groupCode,
        subjectCode
      );
    }
    res.redirect("/assignGroup");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.get("/getGroupSubjects", async (req, res) => {
  try {
    const groupId = req.query.groupId;

    if (!groupId) {
      return res.status(400).send("Missing groupId parameter.");
    }

    const groupSubjects = await groupTeaching.getSubjectsByGroup(db, groupId);
    const allSubjects = await subjectDB.getAllSubjects(db);

    var unassignedSubjects = [];
    for (var i = 0; i < allSubjects.length; i++) {
      var isAssigned = false;
      for (var j = 0; j < groupSubjects.length; j++) {
        if (groupSubjects[j].subjectId === allSubjects[i].id) {
          isAssigned = true;
          break;
        }
      }
      if (!isAssigned) {
        unassignedSubjects.push(allSubjects[i]);
      }
    }
    res.json(unassignedSubjects);
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
