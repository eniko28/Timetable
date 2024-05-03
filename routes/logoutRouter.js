import express from "express";

const router = express.Router();

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error occurred while destroying session data:", err);
    } else {
      res.redirect("/");
    }
  });
});

export default router;
