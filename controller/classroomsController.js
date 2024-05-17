import * as timetableDB from '../model/timetableDB.js';
import * as teacherDB from '../model/teachersDB.js';
import * as subjectDB from '../model/subjectsDB.js';
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

export const getClassrooms = async (req, res) => {
  try {
    const { name } = req.query;

    const teachings = await timetableDB.selectTimetableByClassroom(db, name);

    const teacherPromises = teachings.map((teaching) => teacherDB.getTeacherNameById(db, teaching.teacherId));
    const subjectPromises = teachings.map((teaching) => subjectDB.getSubjectById(db, teaching.subjectId));

    const teachers = await Promise.all(teacherPromises);
    const subjects = await Promise.all(subjectPromises);

    teachings.forEach((teaching, index) => {
      teaching.teacherName = teachers[index];
      teaching.subjectId = subjects[index].name;
      teaching.subjectType = subjects[index].type;
    });

    res.render('classrooms', { teachings, name });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
