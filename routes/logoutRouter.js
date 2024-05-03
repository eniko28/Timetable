import express from "express";
import { logOut } from "../controller/logoutController.js";

const router = express.Router();

router.get("/logout", logOut);

export default router;
