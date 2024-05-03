import express from "express";
import groupRouter from "../controller/onlyAssignedGroupsController.js";

const app = express();

app.use("/group", groupRouter);

export default app;
