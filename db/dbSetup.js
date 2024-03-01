import OrientDB from "orientjs";
import dbConfig from "./dbConfig.js";

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

      return createdDb;
    } else {
      const usedDb = await server.use({
        name: "Timetable",
        username: "root",
        password: "root",
      });

      return usedDb;
    }
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}

export default setupDatabase;
