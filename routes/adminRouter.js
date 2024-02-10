import express from "express";

const router = express.Router();

router.get("/admin", (req, res) => {
  try {
    const userId = req.session.userId;
    const type = req.session.type;
    res.render("admin.ejs", { userId, type });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
