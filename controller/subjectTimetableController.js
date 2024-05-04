import * as subjectDB from "../model/subjectsDB.js";
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

export const renderSubjectTimetablePage = async (req, res) => {
  try {
    const subjects = await subjectDB.getAllSubjects(db);
    res.render("subjectTimetable", { subjects });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
