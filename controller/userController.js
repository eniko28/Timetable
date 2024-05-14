import * as usersDb from "../model/usersDB.js";
import setupDatabase from "../db/dbSetup.js";

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });

export const renderUsersPage = async (req, res) => {
  try {
    const users = await usersDb.getAllUsers(db);
    users.sort((a, b) => a.name.localeCompare(b.name));
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = 9;

    const usersOnPage = users.slice((page - 1) * perPage, page * perPage);

    res.render("users", {
      users: usersOnPage,
      currentPage: page,
      totalPages: Math.ceil(users.length / perPage),
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
