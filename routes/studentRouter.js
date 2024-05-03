import express from "express";
import { basename, join } from "path";
import { existsSync } from "fs";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const uploadDir = join(process.cwd(), "uploadDir");

router.get("/student", authMiddleware(["Student"]), (req, res) => {
  try {
    const { userId } = req.session;
    const { type } = req.session;

    let imagePath = null;
    const profilePicturePath = join(uploadDir, `${userId}-profile-picture.jpg`);
    if (existsSync(profilePicturePath)) {
      imagePath = basename(profilePicturePath);
    }

    res.render("student.ejs", { userId, type, imagePath });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
