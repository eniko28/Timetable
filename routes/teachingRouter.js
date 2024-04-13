import express from "express";
import setupDatabase from "../db/dbSetup.js";
import * as createEdge from "../db/createEdges.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as groupDB from "../db/groupsDB.js";
import * as classroomDB from "../db/classroomDB.js";
import * as wishlistDB from "../db/wishlistsDB.js";
import * as timetableDB from "../db/timetableDB.js";
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

router.get("/wishlists", authMiddleware(["Scheduler"]), async (req, res) => {
  try {
    const wishlists = await wishlistDB.getAllWishlists(db);
    const classrooms = await classroomDB.getAllClassrooms(db);
    const teachers = await teacherDB.getAllTeachers(db);
    const timetable = await timetableDB.selectTimetable(db);
    const groups = await groupDB.getAllGroups(db);

    res.render("wishlists", {
      wishlists: wishlists,
      classrooms: classrooms,
      teachers: teachers,
      timetable: timetable,
      groups: groups,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/wishlists", authMiddleware(["Scheduler"]), async (req, res) => {
  try {
    const { teacherId, subjectId, groupId, day, start, end, classroomName } =
      req.fields;
    if (
      !groupId ||
      !subjectId ||
      !teacherId ||
      !day ||
      !start ||
      !end ||
      !classroomName
    ) {
      res.status(400).render("error", {
        message: "Missing required data.",
      });
      return;
    }

    const existsTeacher = await timetableDB.getFreeTeacher(
      db,
      teacherId,
      start,
      end,
      day
    );

    if (existsTeacher.length !== 0) {
      if (
        existsTeacher[0].groupId.substring(0, 2) !== groupId.substring(0, 2)
      ) {
        res.status(400).render("error", {
          message: "The teacher already has a class scheduled for that time.",
        });
        return;
      }
    }

    const existsGroup = await timetableDB.getFreeGroup(
      db,
      groupId,
      day,
      start,
      end
    );

    if (existsGroup.length !== 0) {
      res.status(400).render("error", {
        message: "The group already has a class scheduled for that time.",
      });
      return;
    }
    const existingSubject = await timetableDB.getTeachingsByGroupAndSubjectId(
      db,
      groupId,
      subjectId
    );
    if (existingSubject.length !== 0) {
      res.status(400).render("error", {
        message:
          "The group already has this subject scheduled in their timetable.",
      });
      return;
    }

    const isFreeClassroom = await timetableDB.getFreeClassroom(
      db,
      classroomName,
      start,
      end,
      day
    );
    if (isFreeClassroom.length !== 0) {
      res.status(400).render("error", {
        message: "The classroom is booked at this time.",
      });
      return;
    }
    const timetableId = uuidv4();

    await timetableDB.insertTimetable(
      db,
      timetableId,
      teacherId,
      subjectId,
      groupId,
      day,
      start,
      end,
      classroomName
    );

    const teachingId = await teachingDB.getTeachingId(
      db,
      teacherId,
      subjectId,
      groupId
    );
    const teaching = await teachingDB.getTeachingById(db, teachingId[0].id);
    const timetable = await timetableDB.getTimetableById(db, timetableId);
    const classroom = await classroomDB.getClassroomByName(db, classroomName);

    await createEdge.createEdgeClassroomsTimetable(
      db,
      classroom,
      timetable,
      teacherId,
      subjectId,
      groupId,
      start,
      end,
      day,
      classroomName
    );

    await createEdge.createEdgeTeachingTimetable(
      db,
      teaching,
      timetable,
      teacherId,
      subjectId,
      groupId,
      start,
      end,
      day,
      classroomName
    );

    res.redirect("/wishlists");
  } catch (error) {
    console.error("Error processing wishlist data:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

export default router;
