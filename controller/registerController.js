import bcrypt from "bcrypt";
import * as usersDB from "../db/usersDB.js";
import * as teachersDB from "../db/teachersDB.js";
import * as studentsDB from "../db/studentsDB.js";
import * as groupDB from "../db/groupsDB.js";
import { createEdgeStudentsGroups } from "../db/createEdges.js";
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

export const showRegistrationForm = (req, res) => {
  try {
    res.render("register", {});
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, userId, password, type } = req.fields;

    if (!name || !userId || !password || !type) {
      return res.status(400).send("Missing required data.");
    }

    const user = await usersDB.getUsernameById(db, userId);

    if (user !== null) {
      return res.status(400).render("error", {
        message: "The provided userId is already taken!",
      });
    }

    const hashWithSalt = await bcrypt.hash(password, 10);
    await usersDB.insertUsers(db, name, userId, hashWithSalt, type);
    if (type === "Teacher") {
      await teachersDB.insertTeacherNameAndId(db, userId, name);
    }
    if (type === "Student") {
      const { groupId } = req.fields;
      await studentsDB.insertStudent(db, userId, name, groupId);
      const student = await studentsDB.getStudentById(db, userId);
      const group = await groupDB.getGroupById(db, groupId);
      await createEdgeStudentsGroups(db, student, group, userId, groupId);
    }
    return res.redirect("/register");
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
