import express from "express";
import setupDatabase from "./db/dbSetup.js";
import formidable from "express-formidable";
import subjectRouter from "./routes/subjectRouter.js";
import groupRouter from "./routes/groupRouter.js";
import loginRouter from "./routes/loginRouter.js";
import registerRouter from "./routes/registerRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import createVertices from "./db/createVertices.js";
import createEdges from "./db/createEdges.js";
import createProperties from "./db/createProperties.js";
import homeRouter from "./routes/homeRouter.js";
import userRouter from "./routes/userRouter.js";
import assignTeacherRouter from "./routes/assignTeacherRouter.js";
import assignGroupRouter from "./routes/assignGroupRouter.js";
import adminRouter from "./routes/adminRouter.js";
import teacherRouter from "./routes/teacherRouter.js";
import logoutRouter from "./routes/logoutRouter.js";
import teachingRouter from "./routes/teachingRouter.js";
import onlyAssignedGroups from "./routes/onlyAssignedGroups.js";
import appropiateClassrooms from "./routes/appropiateClassrooms.js";
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(formidable());

setupDatabase()
  .then((db) => {
    return createVertices(db).then(function () {
      return createEdges(db).then(function () {
        return createProperties(db);
      });
    });
  })
  .then(() => {
    app.use("/", registerRouter);
    app.use("/", loginRouter);
    app.use("/", subjectRouter);
    app.use("/", wishlistRouter);
    app.use("/", groupRouter);
    app.use("/", homeRouter);
    app.use("/", userRouter);
    app.use("/", assignTeacherRouter);
    app.use("/", assignGroupRouter);
    app.use("/", adminRouter);
    app.use("/", teacherRouter);
    app.use("/", teachingRouter);
    app.use("/", logoutRouter);
    app.use("/", onlyAssignedGroups);
    app.use("/", appropiateClassrooms);

    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Error connecting to or creating 'MyTimetable' database:",
      error
    );
  });
