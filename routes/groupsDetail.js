import express from "express";
import { getGroupDetails } from "../controller/groupsDetailController.js";

const router = express.Router();

router.get("/group/:groupId/details", getGroupDetails);

export default router;
