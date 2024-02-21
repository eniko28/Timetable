import OrientDB from "orientjs";
import dbConfig from "./dbConfig.js";

async function createUserIfNotExists(db) {
  try {
    const userExists = await db.query("SELECT FROM OUser WHERE name = 'root'");

    if (userExists.length === 0) {
      await db.query("CREATE USER root IDENTIFIED BY 'root' ROLE admin");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function setupDatabase() {
  const server = OrientDB(dbConfig);

  try {
    const list = await server.list();

    const isTimetableExists = list.some((db) => db.name === "Timetable");

    if (!isTimetableExists) {
      const createdDb = await server.create({
        name: "Timetable",
        type: "graph",
        storage: "remote",
      });
      await createUserIfNotExists(createdDb);

      return createdDb;
    } else {
      const usedDb = await server.use({
        name: "Timetable",
        username: "root",
        password: "root",
      });
      await createUserIfNotExists(usedDb);

      return usedDb;
    }
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}

export default setupDatabase;
