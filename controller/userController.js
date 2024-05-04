import express from "express";
import * as usersDb from "../model/usersDB.js";
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

export const renderUsersPage = async (req, res) => {
  try {
    const users = await usersDb.getAllUsers(db);
    res.render("users", {
      users,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export default router;
