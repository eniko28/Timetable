import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as wishlistDB from "../db/wishlistsDB.js";
import * as subjectDB from "../db/subjectsDB.js";
import * as teachersSubjects from "../db/teachersTeachingEdge.js";
import * as createEdge from "../db/createEdges.js";
import * as groupDB from "../db/groupsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import setupDatabase from "../db/dbSetup.js";
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

router.get("/addWishlists", authMiddleware(["Teacher"]), async (req, res) => {
  try {
    const id = req.session.userId;
    const subjectIds = await teachersSubjects.getSubjectByUserId(db, id);

    await Promise.all(
      subjectIds.map(async (subjectId) => {
        const subject = await subjectDB.getSubjectById(db, subjectId.subjectId);
        subjectId.name = subject.name;
        subjectId.type = subject.type;
      })
    );

    const groups = await groupDB.getAllGroups(db);
    res.render("addWishlist", { id, subjectIds, groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/addWishlists", authMiddleware(["Teacher"]), async (req, res) => {
  try {
    const { teacherCode, day, start, end } = req.fields;

    if (!teacherCode || !day || !start || !end) {
      return res.status(400).send("Missing required data.");
    }

    const timeFormat = /^(0[8-9]|1[0-9]|20):[0-5][0-9]$/;
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

    const wishlistId = uuidv4();

    await wishlistDB.insertWishlist(
      db,
      wishlistId,
      teacherCode,
      day,
      start,
      end
    );

    const teacher = await teacherDB.getTeacherById(db, teacherCode);
    const wishlist = await wishlistDB.getWishlistById(db, wishlistId);

    await createEdge.createEdgeTeachersWishlists(
      db,
      wishlist,
      teacher,
      day,
      start,
      end
    );

    return res.redirect("/addWishlists");
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
