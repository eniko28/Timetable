import * as groupDB from "../db/groupsDB.js";
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

export const getGroupTimetable = async (req, res) => {
  try {
    const groups = await groupDB.getAllGroups(db);
    res.render("groupTimetable", { groups });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
