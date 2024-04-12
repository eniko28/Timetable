import express from "express";
import setupDatabase from "../db/dbSetup.js";
import {
  getTeachersByGroupId,
  getSubjectsByTeacherId,
} from "../db/teachingsDB.js";
import * as teacherDB from "../db/teachersDB.js";
import * as groupDB from "../db/groupsDB.js";
import * as classroomDB from "../db/classroomDB.js";
import * as wishlistDB from "../db/wishlistsDB.js";
import * as timetableDB from "../db/timetableDB.js";

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

router.get("/group/:groupId/details", async (req, res) => {
  const groupId = req.params.groupId;
  const wishlists = await wishlistDB.getAllWishlists(db);
  const classrooms = await classroomDB.getAllClassrooms(db);
  const groups = await groupDB.getAllGroups(db);

  const timetable = await timetableDB.selectTimetableByGroupId(db, groupId);
  const teachers = await getTeachersByGroupId(db, groupId);
  const teacherIds = teachers.map((teacher) => teacher.teacherId);
  const subjectsPromises = teacherIds.map((teacherId) =>
    getSubjectsByTeacherId(db, teacherId)
  );
  const subjectsResults = await Promise.all(subjectsPromises);
  const subjects = subjectsResults.flatMap((result) => result);
  res.json({
    teachers: teachers,
    subjects: subjects,
    wishlists: wishlists,
    classrooms: classrooms,
    timetable: timetable,
    groups: groups,
  });
});

export default router;
