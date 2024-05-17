import { v4 as uuidv4 } from 'uuid';
import * as teacherDB from '../model/teachersDB.js';
import * as subjectDB from '../model/subjectsDB.js';
import * as groupDB from '../model/groupsDB.js';
import * as teachingDB from '../model/teachingsDB.js';
import * as teacherTeaching from '../model/teachersTeachingEdge.js';
import {
  createEdgeTeacherTeachings,
  createEdgesSubjectTeachings,
  createEdgeGroupTeachings,
} from '../db/createEdges.js';
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

export const assignTeacherGet = async (req, res) => {
  try {
    const teachers = await teacherDB.getAllTeachers(db);
    const subjects = await subjectDB.getAllSubjects(db);
    res.render('assignTeacher', { teachers, subjects });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const assignTeacherPost = async (req, res) => {
  try {
    const { teacherCode, subjectCode } = req.fields;

    if (!teacherCode || !subjectCode) {
      return res.status(400).send('Missing required data.');
    }
    const existingTeaching = await teacherTeaching.getTeachersSubjects(db, teacherCode, subjectCode);
    if (existingTeaching.length !== 0) {
      return res.status(400).render('error', {
        message: 'Teacher already assigned to selected subject.',
      });
    }
    const teacherExists = await teachingDB.getAllBySubjectId(db, subjectCode);
    let teachingId = uuidv4();
    if (teacherExists.length === 0) {
      await teachingDB.insertSubjectAndTeacher(db, teachingId, teacherCode, subjectCode);
    } else if (teacherExists[0].teacherId !== teacherCode && teacherExists[0].teacherId) {
      await teachingDB.insertSubjectAndTeacher(db, teachingId, teacherCode, subjectCode);
      if (teacherExists[0].groupId) {
        const groupCode = teacherExists[0].groupId;
        const group = await groupDB.getGroupById(db, groupCode);
        const teaching = await teachingDB.getTeachingById(db, teachingId);
        await createEdgeGroupTeachings(db, group, teaching, groupCode, subjectCode);
        await teachingDB.updateGroup(db, subjectCode, groupCode);
      }
    } else {
      await teachingDB.updateTeacher(db, teacherCode, subjectCode);
      const id = await teachingDB.getTeachingIdByTeacherAndSubject(db, subjectCode, teacherCode);
      teachingId = id[0].id;
    }
    const all = await teachingDB.getTeachingsByTeacherAndSubject(db, teacherCode, subjectCode);

    const promises = all.map(async (teachingRecord) => {
      const teacher = await teacherDB.getTeacherById(db, teacherCode);
      const teaching = await teachingDB.getTeachingById(db, teachingRecord.id);
      const subject = await subjectDB.getSubjectById(db, subjectCode);

      await Promise.all([
        createEdgeTeacherTeachings(db, teacher, teaching, teacherCode, subjectCode),
        createEdgesSubjectTeachings(db, subject, teaching, subjectCode, teacherCode),
      ]);
    });

    await Promise.all(promises);

    return res.redirect('/assignTeacher');
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};