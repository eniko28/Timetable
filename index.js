import express from "express";
import formidable from "express-formidable";
import setupDatabase from "./db/dbSetup.js";
import subjectRouter from "./routes/subjectRouter.js";
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
import studentRouter from "./routes/studentRouter.js";
import timetableRouter from "./routes/timetableRouter.js";
import timetableTeacher from "./routes/timetableTeacher.js";
import groupTimetable from "./routes/groupTimetable.js";
import teacherTimetable from "./routes/teacherTimetable.js";
import subjectTimetable from "./routes/subjectTimetable.js";
import classroomTimetable from "./routes/classroomTimetable.js";
import group from "./routes/group.js";
import teachers from "./routes/teachers.js";
import subject from "./routes/subject.js";
import classroom from "./routes/classrooms.js";
import getGroups from "./routes/getGroups.js";
import groupsDetail from "./routes/groupsDetail.js";
import schedulerRouter from "./routes/schedulerRouter.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(formidable());

setupDatabase()
  .then((db) =>
    createVertices(db).then(() =>
      createEdges(db).then(() => createProperties(db))
    )
  )
  .then(() => {
    app.use("/", registerRouter);
    app.use("/", loginRouter);
    app.use("/", subjectRouter);
    app.use("/", wishlistRouter);
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
    app.use("/", studentRouter);
    app.use("/", timetableRouter);
    app.use("/", groupTimetable);
    app.use("/", teacherTimetable);
    app.use("/", subjectTimetable);
    app.use("/", classroomTimetable);
    app.use("/", timetableTeacher);
    app.use("/", group);
    app.use("/", teachers);
    app.use("/", subject);
    app.use("/", classroom);
    app.use("/", getGroups);
    app.use("/", groupsDetail);
    app.use("/", schedulerRouter);

    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Error connecting to or creating 'Timetable' database:",
      error
    );
  });
