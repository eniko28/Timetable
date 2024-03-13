import express from "express";
import session from "express-session";
import setupDatabase from "../db/dbSetup.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as usersDB from "../db/usersDB.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

let db;

dotenv.config();
const secret = process.env.SECRET;

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

router.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", (req, res) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

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
        req.session.userId = userId;
        req.session.type = type;
        req.session.token = token;

        if (type === "Admin") {
          res.redirect("/admin");
        } else {
          if (type === "Teacher") {
            res.redirect("/teacher");
          } else {
            if (type === "Student") {
              res.redirect("/student");
            }
          }
        }
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
