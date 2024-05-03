import { basename, join } from "path";
import { existsSync } from "fs";

const uploadDir = join(process.cwd(), "uploadDir");

export const renderTeacherPage = (req, res) => {
  try {
    const { userId } = req.session;
    const { type } = req.session;
    let imagePath = null;
    const profilePicturePath = join(uploadDir, `${userId}-profile-picture.jpg`);
    if (existsSync(profilePicturePath)) {
      imagePath = basename(profilePicturePath);
    }
    res.render("teacher.ejs", { userId, type, imagePath });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
