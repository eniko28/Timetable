import * as timetableDB from "../db/timetableDB.js";
import * as subjectBD from "../db/subjectsDB.js";
import * as teacherBD from "../db/teachersDB.js";
import setupDatabase from "../db/dbSetup.js";

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

export const renderSubjectPage = async (req, res) => {
  try {
    const { name } = req.query;

    const subjectIds = await subjectBD.getSubjectsByName(db, name);

    const subjectTeachingsPromises = subjectIds.map(async (subjectId) => {
      const subjectTeachings = await timetableDB.selectTimetableBySubjectId(
        db,
        subjectId.id
      );

      return Promise.all(
        subjectTeachings.map(async (teaching) => {
          const teacher = await teacherBD.getTeacherNameById(
            db,
            teaching.teacherId
          );
          const subject = await subjectBD.getSubjectById(
            db,
            teaching.subjectId
          );

          teaching.teacherName = teacher;
          teaching.subjectId = subject.name;
          teaching.subjectType = subject.type;
          return teaching;
        })
      );
    });

    const teachings = (await Promise.all(subjectTeachingsPromises)).flat();

    res.render("subject", { teachings, name });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
