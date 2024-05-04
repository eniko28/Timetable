import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import setupDatabase from "../db/dbSetup.js";
import * as usersDB from "../model/usersDB.js";

dotenv.config();
const secret = process.env.SECRET;

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

export const getLoginPage = (req, res) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const postLogin = async (req, res) => {
  const { password } = req.fields;
  const { userId } = req.fields;
  const type = req.fields.userTypeLogin;

  try {
    if (!password || !userId || !type) {
      return res.status(400).send("Missing required data.");
    }
    const users = await usersDB.getAllUserIds(db, userId);

    const exists = users.includes(userId);
    if (!exists) {
      return res.status(400).render("error", {
        message: "No user registered with the provided id!",
      });
    }

    const typeFromDatabase = await usersDB.getType(db, userId);

    if (typeFromDatabase !== type) {
      return res.status(400).render("error", {
        message: "The provided userId is not registered in this role!",
      });
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
      } else if (type === "Teacher") {
        res.redirect("/teacher");
      } else if (type === "Student") {
        res.redirect("/student");
      } else if (type === "Scheduler") {
        res.redirect("/scheduler");
      }
    } else {
      return res.status(400).render("error", {
        message: "Wrong password!",
      });
    }
  } catch (err) {
    console.log(`Hiba: ${err}`);
    return res.status(500).send(`Internal Server Error: ${err.message}`);
  }
  return {};
};
