import express from 'express';
import setupDatabase from '../db/dbSetup.js';
import * as groupDB from '../model/groupsDB.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    process.exit(1);
  });

export const getGroupsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const result = await groupDB.getGroupsBySubjectId(db, subjectId);
    res.send(result);
  } catch (error) {
    console.error('Error getting groups by subject from database:', error);
    res.status(500).send('Internal Server Error');
  }
};

router.get('/getGroupsBySubject', authMiddleware(['Admin', 'Student', 'Teacher', 'Scheduler']), getGroupsBySubject);

export default router;
