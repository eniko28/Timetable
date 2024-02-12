import express from "express";
import setupDatabase from "../db/dbSetup.js";
import * as wishlistDB from "../db/wishlistsDB.js";
import { getWishlistByDayandTime, deleteWishlist } from "../db/wishlistsDB.js";
import { insertTeaching } from "../db/teachingsDB.js";

const router = express.Router();
let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

router.get("/wishlists", async (req, res) => {
  try {
    const wishlists = await wishlistDB.getAllWishlists(db);
    res.render("wishlists", {
      wishlists: wishlists,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

router.post("/wishlists", async (req, res) => {
  try {
    const { teacherId, subjectId, groupId, day, start, end, approved } =
      req.fields;

    if (
      !groupId ||
      !subjectId ||
      !teacherId ||
      !day ||
      !start ||
      !end ||
      !approved
    ) {
      return res.status(400).send("Missing required data.");
    }

    if (approved === "approved") {
      await insertTeaching(db, teacherId, subjectId, groupId, day, start, end);
      await deleteWishlist(db, day, start, end);
    } else {
      await deleteWishlist(db, day, start, end);
    }

    res.redirect("/wishlists");
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

export default router;
