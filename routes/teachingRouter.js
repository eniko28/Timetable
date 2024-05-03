import express from "express";
import {
  getWishlists,
  postWishlists,
  fetchWishlists,
} from "../controller/teachingController.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/wishlists", authMiddleware(["Scheduler"]), getWishlists);

router.post("/wishlists", authMiddleware(["Scheduler"]), postWishlists);

router.get("/free-classrooms", authMiddleware(["Scheduler"]), fetchWishlists);

export default router;
