import * as teacherDB from '../model/teachersDB.js';
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

export const renderTeacherTimetablePage = async (req, res) => {
  try {
    const teachers = await teacherDB.getAllTeachers(db);
    res.render('teacherTimetable', { teachers });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
