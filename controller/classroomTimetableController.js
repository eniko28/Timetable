import * as classroomDB from '../model/classroomDB.js';
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

export const getClassroomTimetable = async (req, res) => {
  try {
    const classrooms = await classroomDB.getAllClassrooms(db);
    res.render('classroomTimetable', { classrooms });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
