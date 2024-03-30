import express from "express";
import eformidable from "express-formidable";
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from "fs";
import { join, basename } from "path";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(express.static("public"));

const uploadDir = join(process.cwd(), "uploadDir");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}
router.use(eformidable({ uploadDir, keepExtensions: true, multiples: true }));

router.use(express.static(uploadDir));

router.get(
  "/home",
  authMiddleware(["Admin", "Student", "Teacher"]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const type = req.session.type;
      let imageName = null;
      const profilePicturePath = join(
        uploadDir,
        `${userId}-profile-picture.jpg`
      );
      if (existsSync(profilePicturePath)) {
        imageName = basename(profilePicturePath);
      }
      res.render("home", { userId, type, imageName });
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
      const imagePath = req.files.avatar.path;
      const imageName = `${userId}-profile-picture.jpg`;
      const destinationPath = join(uploadDir, imageName);
      if (existsSync(destinationPath)) {
        unlinkSync(destinationPath);
      }
      copyFileSync(imagePath, destinationPath);
      res.redirect("home");
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
