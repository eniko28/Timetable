import express from "express";
import setupDatabase from "./db/dbSetup.js";
import formidable from "express-formidable";
import subjectRoutes from "./routes/subjectRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import registerRoutes from "./routes/registerRoutes.js";
import teachingRoutes from "./routes/teachingRoutes.js";
import createVertices from "./db/createVertices.js";
import createEdges from "./db/createEdges.js";
import createProperties from "./db/createProperties.js";
import home from "./routes/home.js";
import adminMainPage from "./routes/adminMainPage.js";

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
    app.use("/", registerRoutes);
    app.use("/", loginRoutes);
    app.use("/", subjectRoutes);
    app.use("/", teacherRoutes);
    app.use("/", teachingRoutes);
    app.use("/", groupRoutes);
    app.use("/", home);
    app.use("/", adminMainPage);

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
