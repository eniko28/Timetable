import express from "express";
import setupDatabase from "../db/dbSetup.js";
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from "fs";
import { join, basename } from "path";
import { authMiddleware } from "../middleware/auth.js";
import * as personalDB from "../db/personalDB.js";
import { updateStudent } from "../db/studentsDB.js";
import { updateTeachers } from "../db/teachersDB.js";

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(express.static("public"));

const uploadDir = join(process.cwd(), "uploadDir");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

router.use(express.static(uploadDir));

router.get(
  "/home",
  authMiddleware(["Admin", "Student", "Teacher", "Scheduler"]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const type = req.session.type;
      const userData = await personalDB.getUserData(db, userId);

      let imageName = null;
      const profilePicturePath = join(
        uploadDir,
        `${userId}-profile-picture.jpg`
      );
      if (existsSync(profilePicturePath)) {
        imageName = basename(profilePicturePath);
      }

      res.render("home", { userId, type, imageName, userData });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

router.post(
  "/home",
  authMiddleware(["Teacher", "Student"]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const type = req.session.type;
      const email = req.fields.email;
      const address = req.fields.address;
      const phone = req.fields.phone;
      const imagePath = req.files.avatar.path;
      const imageName = `${userId}-profile-picture.jpg`;
      const destinationPath = join(uploadDir, imageName);
      const existingUser = await personalDB.getUserData(db, userId);
      if (existingUser) {
        await personalDB.updatePersonal(
          db,
          userId,
          imageName,
          address,
          email,
          phone
        );
      } else {
        await personalDB.insertPersonal(
          db,
          userId,
          imageName,
          address,
          email,
          phone
        );
      }
      if (existsSync(destinationPath)) {
        unlinkSync(destinationPath);
      }
      copyFileSync(imagePath, destinationPath);
      if (type === "Student") {
        await updateStudent(db, userId);
      } else {
        if (type === "Teacher") {
          await updateTeachers(db, userId);
        }
      }
      res.redirect("home");
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
