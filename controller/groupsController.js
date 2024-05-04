import setupDatabase from "../db/dbSetup.js";
import * as timetableDB from "../model/timetableDB.js";
import * as groupDB from "../model/groupsDB.js";
import * as teacherDB from "../model/teachersDB.js";
import * as subjectBD from "../model/subjectsDB.js";

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
    const { name, gradeLevel } = req.query;
    const groups = await groupDB.getGroupsByNameAndGradeLevel(
      db,
      name,
      gradeLevel
    );

    await Promise.all(
      groups.map(async (group) => {
        const teachings = await timetableDB.selectTimetableByGroupId(
          db,
          group.id
        );

        group.teachings = await Promise.all(
          teachings.map(async (teaching) => {
            const teacher = await teacherDB.getTeacherNameById(
              db,
              teaching.teacherId
            );
            const subject = await subjectBD.getSubjectById(
              db,
              teaching.subjectId
            );

            return {
              teacherName: teacher,
              subjectId: subject.name,
              subjectType: subject.type,
              classroomName: teaching.classroomName,
              day: teaching.day,
              start: teaching.start,
              end: teaching.end,
              groupId: teaching.groupId,
            };
          })
        );
      })
    );

    res.render("group", { groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
