import setupDatabase from "../db/dbSetup.js";
import {
  getTeachersByGroupId,
  getSubjectsByTeacherId,
} from "../model/teachingsDB.js";
import * as groupDB from "../model/groupsDB.js";
import * as classroomDB from "../model/classroomDB.js";
import * as wishlistDB from "../model/wishlistsDB.js";
import * as timetableDB from "../model/timetableDB.js";

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
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
      teachers,
      subjects,
      wishlists,
      classrooms,
      timetable,
      groups,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
