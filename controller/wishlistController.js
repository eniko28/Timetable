import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as wishlistDB from '../model/wishlistsDB.js';
import * as subjectDB from '../model/subjectsDB.js';
import * as teachersSubjects from '../model/teachersTeachingEdge.js';
import * as createEdge from '../db/createEdges.js';
import * as groupDB from '../model/groupsDB.js';
import * as teacherDB from '../model/teachersDB.js';
import setupDatabase from '../db/dbSetup.js';

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

export const renderAddWishlistsPage = async (req, res) => {
  try {
    const id = req.session.userId;
    const cr = await teacherDB.getCredit(db, id);
    const { credit } = cr[0];
    const subjectIds = await teachersSubjects.getSubjectByUserId(db, id);

    await Promise.all(
      subjectIds.map(async (subjectId) => {
        const subject = await subjectDB.getSubjectById(db, subjectId.subjectId);
        subjectId.name = subject.name;
        subjectId.type = subject.type;
      }),
    );

    const groups = await groupDB.getAllGroups(db);
    res.render('addWishlist', { id, subjectIds, groups, credit });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const handleAddWishlists = async (req, res) => {
  try {
    const { teacherCode, day, start, end } = req.fields;
    let { credit } = req.fields;

    if (!teacherCode || !day || !start || !end) {
      return res.status(400).render('error', { message: 'Missing required data.' });
    }

    if (credit <= 0) {
      return res.status(400).render('error', { message: 'No more available credits.' });
    }

    const timeFormat = /^(0[8-9]|1[0-9]|20):[0-5][0-9]$/;
    if (!start.match(timeFormat) || !end.match(timeFormat)) {
      return res.status(400).render('error', {
        message: 'Invalid time format. Please use HH:mm between 8:00 and 20:00.',
      });
    }

    const startTime = new Date(`2000-01-01T${start}:00Z`);
    const endTime = new Date(`2000-01-01T${end}:00Z`);

    if (startTime > endTime) {
      return res.status(400).render('error', { message: 'Start time must be before end time.' });
    }

    const wishlistId = uuidv4();

    await wishlistDB.insertWishlist(db, wishlistId, teacherCode, day, start, end);

    credit -= 1;
    await teacherDB.updateTeachersCredit(db, teacherCode, credit);

    const teacher = await teacherDB.getTeacherById(db, teacherCode);
    const wishlist = await wishlistDB.getWishlistById(db, wishlistId);

    await createEdge.createEdgeTeachersWishlists(db, wishlist, teacher, day, start, end);

    return res.redirect('/addWishlists');
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export default router;
