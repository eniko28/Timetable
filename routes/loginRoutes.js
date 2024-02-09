import express from "express";
import setupDatabase from "../db/dbSetup.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as usersDB from "../db/usersDB.js";

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

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

router.get("/", (req, res) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

dotenv.config();
const secret = process.env.SECRET;

router.post("/login", async (req, res) => {
  const password = req.fields.password;
  const userId = req.fields.userId;
  const type = req.fields.userTypeLogin;

  try {
    if (!password || !userId || !type) {
      return res.status(400).send("Missing required data.");
    } else {
      const users = await usersDB.getAllUserIds(db, userId);

      const exists = users.includes(userId);
      if (!exists) {
        res.status(400).render("error", {
          message: "No user registered with the provided id!",
        });
        return;
      }

      const typeFromDatabase = await usersDB.getType(db, userId);

      if (typeFromDatabase !== type) {
        res.status(400).render("error", {
          message: "The provided userId is not registered in this role!",
        });
        return;
      }

      const passwordFromDatabase = await usersDB.getPassword(db, userId);
      const match = await bcrypt.compare(password, passwordFromDatabase);

      if (match) {
        const token = jwt.sign({ userId, type }, secret, {
          expiresIn: "356d",
        });
        res.cookie("Token", token);
        res.render("admin.ejs", { userId });
      } else {
        res.status(400).render("error", {
          message: "Wrong password!",
        });
      }
    }
  } catch (err) {
    console.log(`Hiba: ${err}`);
  }
});

export default router;
