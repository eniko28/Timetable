import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import * as usersDB from "../db/usersDB.js";
import * as teachersDB from "../db/teachersDB.js";
import setupDatabase from "../db/dbSetup.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(cookieParser());
let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

router.get("/register", async (req, res) => {
  try {
    res.render("register", {});
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, userId, password, type } = req.fields;

    if (!name || !userId || !password || !type) {
      return res.status(400).send("Missing required data.");
    }

    const user = await usersDB.getUsernameById(db, userId);

    if (user !== null) {
      res.status(400).render("error", {
        message: "The provided userId is already taken!",
      });
      return;
    }

    const hashWithSalt = await bcrypt.hash(password, 10);
    await usersDB.insertUsers(db, name, userId, hashWithSalt, type);
    if (type === "Teacher") {
      await teachersDB.insertTeacherNameAndId(db, userId, name);
    }

    res.redirect("/register");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.use("/register", async (req, res) => {
  try {
    const users = await usersDB.getAllUsers(db);
    res.render("registerDB", {
      users: users,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
