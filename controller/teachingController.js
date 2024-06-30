import { v4 as uuidv4 } from 'uuid';
import setupDatabase from '../db/dbSetup.js';
import * as teachingDB from '../model/teachingsDB.js';
import * as subjectDB from '../model/subjectsDB.js';
import * as teacherDB from '../model/teachersDB.js';
import * as groupDB from '../model/groupsDB.js';
import * as classroomDB from '../model/classroomDB.js';
import * as wishlistDB from '../model/wishlistsDB.js';
import * as timetableDB from '../model/timetableDB.js';

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    process.exit(1);
  });

export const getWishlists = async (req, res) => {
  try {
    const wishlists = await wishlistDB.getAllWishlists(db);
    const classrooms = await classroomDB.getAllClassrooms(db);
    const teachers = await teacherDB.getAllTeachers(db);
    const sortedTeachers = teachers.sort((a, b) => a.id.localeCompare(b.id));
    const timetable = await timetableDB.selectTimetable(db);
    const groups = await groupDB.getAllGroups(db);
    const sortedGroups = groups.sort((a, b) => a.id.localeCompare(b.id));

    res.render('wishlists', {
      wishlists,
      classrooms,
      teachers: sortedTeachers,
      timetable,
      groups: sortedGroups,
    });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const postWishlists = async (req, res) => {
  try {
    const { teacherId, subjectId, groupId, day, start, end, classroomName } = req.fields;
    if (!groupId || !subjectId || !teacherId || !day || +!start || !end || !classroomName) {
      return res.status(400).json({ error: 'Missing required data.' });
    }

    const existsTeacher = await timetableDB.getFreeTeacher(db, teacherId, start, end, day);

    if (existsTeacher.length !== 0) {
      if (existsTeacher[0].groupId.substring(0, 2) !== groupId.substring(0, 2)) {
        return res.status(400).json({ error: 'The teacher already has a class scheduled for that time.' });
      }
    }

    const existsGroup = await timetableDB.getFreeGroup(db, groupId, day, start, end);

    if (existsGroup.length !== 0) {
      return res.status(400).json({ error: 'The group already has a class scheduled for that time.' });
    }

    const existingSubject = await timetableDB.getTeachingsByGroupAndSubjectId(db, groupId, subjectId);
    if (existingSubject.length !== 0) {
      return res.status(400).json({ error: 'The group already has this subject scheduled in their timetable.' });
    }

    const isFreeClassroom = await timetableDB.getFreeClassroom(db, classroomName, start, end, day);
    if (isFreeClassroom.length !== 0) {
      return res.status(400).json({ error: 'The classroom is booked at this time.' });
    }

    const timetableId = uuidv4();

    const teachingId = await teachingDB.getTeachingId(db, teacherId, subjectId, groupId);
    const teaching = await teachingDB.getTeachingById(db, teachingId[0].id);
    const classroom = await classroomDB.getClassroomByName(db, classroomName);

    await timetableDB.insertTimetable(
      db,
      timetableId,
      teacherId,
      subjectId,
      groupId,
      day,
      start,
      end,
      classroomName,
      teaching,
      classroom,
    );

    return res.status(200).json({ message: 'Inserted successfully!' });
  } catch (error) {
    console.error('Error processing wishlist data:', error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

export const fetchWishlists = async (req, res) => {
  try {
    const { day, start, subject } = req.query;
    const timetable = await timetableDB.getTimetableByDayAndTime(db, day, start);
    const subjectType = await subjectDB.getSubjectTypeById(db, subject);
    const occupiedClassrooms = timetable.map((slot) => slot.classroomName);
    const allClassrooms = await classroomDB.getClassroomByType(db, subjectType.type);
    const freeClassrooms = allClassrooms.filter((classroom) => !occupiedClassrooms.includes(classroom.name));
    res.json(freeClassrooms);
  } catch (error) {
    console.error('Error fetching free classrooms:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
