import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { showAdminPage } from "../controller/adminController.js";

const router = express.Router();

router.get("/admin", authMiddleware(["Admin"]), showAdminPage);

export default router;
