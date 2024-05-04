import setupDatabase from "../db/dbSetup.js";
import * as teachingDB from "../model/teachingsDB.js";

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

export const getGroupsBySubject = async (req, res) => {
  try {
    const { subjectCode } = req.query;
    const groups = await teachingDB.getGroupBySubjectId(db, subjectCode);
    res.json(groups);
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
