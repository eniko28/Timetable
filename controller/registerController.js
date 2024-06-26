import bcrypt from 'bcrypt';
import * as usersDB from '../model/usersDB.js';
import * as teachersDB from '../model/teachersDB.js';
import * as studentsDB from '../model/studentsDB.js';
import * as groupDB from '../model/groupsDB.js';
import { createEdgeStudentsGroups } from '../db/createEdges.js';
import setupDatabase from '../db/dbSetup.js';

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    process.exit(1);
  });

export const showRegistrationForm = (req, res) => {
  try {
    res.render('register', {});
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, userId, password, type } = req.fields;

    if (!name || !userId || !password || !type) {
      return res.status(400).json({ error: 'Missing required data.' });
    }

    const user = await usersDB.getUsernameById(db, userId);

    if (user !== null) {
      return res.status(400).json({ error: 'The provided userId is already taken!' });
    }

    const hashWithSalt = await bcrypt.hash(password, 10);
    await usersDB.insertUsers(db, name, userId, hashWithSalt, type);
    if (type === 'Teacher') {
      await teachersDB.insertTeacherNameAndId(db, userId, name);
    }
    if (type === 'Student') {
      const { groupId } = req.fields;
      await studentsDB.insertStudent(db, userId, name, groupId);
      const student = await studentsDB.getStudentById(db, userId);
      const group = await groupDB.getGroupById(db, groupId);
      await createEdgeStudentsGroups(db, student, group, userId, groupId);
    }
    return res.status(200).json({ message: 'Successful addition!' });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};
