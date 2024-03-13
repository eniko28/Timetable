import express from "express";
import setupDatabase from "../db/dbSetup.js";
import * as createEdge from "../db/createEdges.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as subjectDB from "../db/subjectsDB.js";
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

router.get("/wishlists", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const wishlists = await wishlistDB.getAllWishlists(db);
    const classrooms = await classroomDB.getAllClassrooms(db);
    for (const wishlist of wishlists) {
      const subjects = await subjectDB.getSubjectById(db, wishlist.subjectId);
      wishlist.subjectName = subjects.name;
      wishlist.subjectType = subjects.type;
    }
    res.render("wishlists", {
      wishlists: wishlists,
      classrooms: classrooms,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/wishlists", authMiddleware(["Admin"]), async (req, res) => {
  let newSubgroup;
  try {
    const {
      wishlistId,
      teacherId,
      subjectId,
      groupId,
      day,
      start,
      end,
      approved,
      classroomName,
      selectedSubgroup,
      subgroup,
    } = req.fields;
    if (
      !wishlistId ||
      !groupId ||
      !subjectId ||
      !teacherId ||
      !day ||
      !start ||
      !end ||
      !approved ||
      !classroomName
    ) {
      return res.status(400).send("Missing required data.");
    }
    if (approved === "approved") {
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
          return res
            .status(400)
            .send("The teacher already has a class scheduled for that time.");
        } else {
          if (classroomName !== existsTeacher[0].classroomName) {
            return res
              .status(400)
              .send(
                `Classroomname must be: '${existsTeacher[0].classroomName}'`
              );
          }
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
        return res
          .status(400)
          .send("The group already has a class scheduled for that time.");
      }
      if (subgroup === "yes") {
        newSubgroup = selectedSubgroup;
      }
      const existingSubject = await timetableDB.getTeachingsByGroupAndSubjectId(
        db,
        newSubgroup,
        subjectId
      );
      if (existingSubject.length !== 0) {
        return res
          .status(400)
          .send(
            "The group already has this subject scheduled in their timetable."
          );
      }
      const timetableId = uuidv4();
      if (subgroup === "no") {
        newSubgroup = groupId;
      }
      await timetableDB.insertTimetable(
        db,
        timetableId,
        teacherId,
        subjectId,
        newSubgroup,
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

      await wishlistDB.approvedWishlists(db, day, start, end);
    } else {
      await wishlistDB.rejectedWishlists(db, day, start, end);
    }

    res.redirect("/wishlists");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
