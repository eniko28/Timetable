import express from "express";

const router = express.Router();

router.use("/home", async (req, res) => {
  try {
    res.render("home", {});
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
