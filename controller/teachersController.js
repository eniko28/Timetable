import * as timetableDB from '../model/timetableDB.js';
import * as subjectBD from '../model/subjectsDB.js';
import setupDatabase from '../db/dbSetup.js';

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    process.exit(1);
  });

export const renderTeachersPage = async (req, res) => {
  try {
    const { name, id } = req.query;

    const teachings = await timetableDB.selectTimetableByTeacherId(db, id);

    await Promise.all(
      teachings.map(async (teaching) => {
        const subject = await subjectBD.getSubjectById(db, teaching.subjectId);
        teaching.subjectId = subject.name;
        teaching.subjectType = subject.type;
      }),
    );

    res.render('teachers', { teachings, name });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
