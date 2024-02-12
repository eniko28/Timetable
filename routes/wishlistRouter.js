import express from "express";
import * as wishlistDB from "../db/wishlistsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as teachingDB from "../db/teachingsDB.js";
import * as groupDB from "../db/groupsDB.js";
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

router.get("/addWishlists", async (req, res) => {
  try {
    const id = req.session.userId;
    const subjects = await teacherDB.getTeacherSubjects(db, id);
    const groups = await groupDB.getAllGroups(db);
    res.render("addWishlist", { id, subjects, groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/addWishlists", async (req, res) => {
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

    const wishlistId = uuidv4();

    await wishlistDB.insertWishlist(
      db,
      wishlistId,
      teacherCode,
      groupCode,
      subjectCode,
      day,
      start,
      end
    );

    res.redirect("/addWishlists");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
