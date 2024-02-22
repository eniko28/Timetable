import express from "express";
import * as subjectDB from "../db/subjectsDB.js";
import * as groupDB from "../db/groupsDB.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as groupTeaching from "../db/groupTeachingsEdge.js";
import { createEdgeGroupTeachings } from "../db/createEdges.js";
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
        await teachingDB.insertTeaching(
          db,
          teachingId,
          teacherId[0].teacherId,
          subjectCode,
          groupCode
        );
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
    const group = await groupDB.getGroupById(db, groupCode);
    const teaching = await teachingDB.getTeachingById(db, teachingId);
    await createEdgeGroupTeachings(db, group, teaching, groupCode, subjectCode);
    res.redirect("/assignGroup");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
