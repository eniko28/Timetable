import express from "express";
import * as groupsDB from "../db/groupsDB.js";
import setupDatabase from "../db/dbSetup.js";

const router = express.Router();

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

router.use("/groups", async (req, res) => {
  try {
    const groups = await groupsDB.getAllGroups(db);
    res.render("groups", {
      groups: groups,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
