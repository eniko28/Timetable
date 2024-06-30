import { v4 as uuidv4 } from 'uuid';
import * as subjectDB from '../model/subjectsDB.js';
import * as groupDB from '../model/groupsDB.js';
import * as teacherDB from '../model/teachersDB.js';
import * as teachingDB from '../model/teachingsDB.js';
import * as groupTeaching from '../model/groupTeachingsEdge.js';
import {
  createEdgeGroupTeachings,
  createEdgeTeacherTeachings,
  createEdgesSubjectTeachings,
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

export const assignGroupGet = async (req, res) => {
  try {
    const groups = await groupDB.getAllGroups(db);
    const sortedGroups = groups.sort((a, b) => a.id.localeCompare(b.id));
    const subjects = await subjectDB.getAllSubjects(db);
    const sortedSubjects = subjects.sort((a, b) => a.name.localeCompare(b.name));

    res.render('assignGroup', { groups: sortedGroups, subjects: sortedSubjects });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const assignGroupPost = async (req, res) => {
  try {
    const { groupCode, subjectCode } = req.fields;

    if (!groupCode || !subjectCode) {
      return res.status(400).json({ error: 'Missing required data.' });
    }

    const existingTeaching = await groupTeaching.getSubjectsGroups(db, subjectCode, groupCode);
    if (existingTeaching.length !== 0) {
      return res.status(400).json({ error: 'Subject already assigned to selected group.' });
    }
    const groupExists = await teachingDB.getGroupBySubjectId(db, subjectCode);
    let teachingId = uuidv4();
    if (groupExists.length === 0) {
      await teachingDB.insertSubjectAndGroup(db, teachingId, subjectCode, groupCode);
    } else {
      if (groupExists[0].groupId === groupCode) {
        return res.status(400).json({ error: 'Subject already assigned to selected group.' });
      }
      if (groupExists[0].groupId) {
        const teacherId = await teachingDB.getTeacherBySubjectId(db, subjectCode);
        if (teacherId[0].teacherId === undefined) {
          await teachingDB.insertSubjectAndGroup(db, teachingId, subjectCode, groupCode);
        } else {
          await teachingDB.insertTeaching(db, teachingId, teacherId[0].teacherId, subjectCode, groupCode);
          const teacher = await teacherDB.getTeacherById(db, teacherId[0].teacherId);
          const teaching = await teachingDB.getTeachingById(db, teachingId);
          const subject = await subjectDB.getSubjectById(db, subjectCode);
          await createEdgeTeacherTeachings(db, teacher, teaching, teacherId[0].teacherId, subjectCode);
          await createEdgesSubjectTeachings(db, subject, teaching, subjectCode, teacherId[0].teacherId);
        }
      } else {
        await teachingDB.updateGroup(db, subjectCode, groupCode);
        const id = await teachingDB.getTeachingIdBySubjectAndGroup(db, subjectCode, groupCode);
        teachingId = id[0].id;
      }
    }
    const all = await teachingDB.getTeachingsByGroupAndSubjectId(db, groupCode, subjectCode);
    await Promise.all(
      all.map(async (teachingRecord) => {
        const teaching = await teachingDB.getTeachingById(db, teachingRecord.id);
        const group = await groupDB.getGroupById(db, groupCode);
        return createEdgeGroupTeachings(db, group, teaching, groupCode, subjectCode);
      }),
    );
    return res.status(200).json({ message: 'Group assigned successfully.' });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

export const getGroupSubjects = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).send('Missing groupId parameter.');
    }

    const groupSubjects = await groupTeaching.getSubjectsByGroup(db, groupId);
    const allSubjects = await subjectDB.getAllSubjects(db);

    const unassignedSubjects = [];
    for (let i = 0; i < allSubjects.length; i++) {
      let isAssigned = false;
      for (let j = 0; j < groupSubjects.length; j++) {
        if (groupSubjects[j].subjectId === allSubjects[i].id) {
          isAssigned = true;
          break;
        }
      }
      if (!isAssigned) {
        unassignedSubjects.push(allSubjects[i]);
      }
    }
    return res.json(unassignedSubjects);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
