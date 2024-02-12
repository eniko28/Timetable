import express from "express";
import setupDatabase from "../db/dbSetup.js";
import * as wishlistDB from "../db/wishlistsDB.js";
import {
  insertTeaching,
  getFreeTeacher,
  getFreeGroup,
  getTeachingsByGroupAndSubjectId,
} from "../db/teachingsDB.js";
import { createEdgeTeacherTeachings } from "../db/createEdges.js";
import { createEdgeGroupTeachings } from "../db/createEdges.js";
import { createEdgesSubjectTeachings } from "../db/createEdges.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as subjectDB from "../db/subjectsDB.js";
import * as groupDB from "../db/groupsDB.js";
import { v4 as uuidv4 } from "uuid";
import { deleteWishlist } from "../db/wishlistsDB.js";

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

router.get("/wishlists", async (req, res) => {
  try {
    const wishlists = await wishlistDB.getAllWishlists(db);
    res.render("wishlists", {
      wishlists: wishlists,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/wishlists", async (req, res) => {
  try {
    const { teacherId, subjectId, groupId, day, start, end, approved } =
      req.fields;

    if (
      !groupId ||
      !subjectId ||
      !teacherId ||
      !day ||
      !start ||
      !end ||
      !approved
    ) {
      return res.status(400).send("Missing required data.");
    }

    if (approved === "approved") {
      const existsTeacher = await getFreeTeacher(
        db,
        teacherId,
        day,
        start,
        end
      );
      if (existsTeacher.length !== 0) {
        return res
          .status(400)
          .send("The teacher already has a class scheduled for that time.");
      }
      const existsGroup = await getFreeGroup(db, groupId, day, start, end);
      if (existsGroup.length !== 0) {
        return res
          .status(400)
          .send("The group already has a class scheduled for that time.");
      }
      const existingSubject = await getTeachingsByGroupAndSubjectId(
        db,
        groupId,
        subjectId
      );
      if (existingSubject.length !== 0) {
        return res
          .status(400)
          .send(
            "The group already has this subject scheduled in their timetable."
          );
      }
      const teachingId = uuidv4();
      await insertTeaching(
        db,
        teachingId,
        teacherId,
        subjectId,
        groupId,
        day,
        start,
        end
      );
      const teacher = await teacherDB.getTeacherById(db, teacherId);
      const group = await groupDB.getGroupById(db, groupId);
      const teachings = await teachingDB.getTeachingById(db, teachingId);
      const subject = await subjectDB.getSubjectById(db, subjectId);

      createEdgeTeacherTeachings(db, teacher, teachings);
      createEdgeGroupTeachings(db, group, teachings);
      createEdgesSubjectTeachings(db, subject, teachings);
      await deleteWishlist(db, day, start, end);
    } else {
      await deleteWishlist(db, day, start, end);
    }

    res.redirect("/wishlists");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
