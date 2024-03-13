import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(
  "/home",
  authMiddleware(["Admin", "Student", "Teacher"]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const type = req.session.type;
      res.render("home", { userId, type });
    } catch (error) {
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  }
);

export default router;
