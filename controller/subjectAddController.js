import * as subjectsDB from '../model/subjectsDB.js';
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

export const renderAddSubjectsPage = (req, res) => {
  try {
    res.render('addSubjects', {});
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const handleAddSubjects = async (req, res) => {
  try {
    const { code, name, type } = req.fields;

    if (!code || !name || !type) {
      return res.status(400).json({ error: 'Missing required data.' });
    }

    const existingSubject = await subjectsDB.getSubjectById(db, code);
    const existingNameAndType = await subjectsDB.getAllSubjectsByNameAndType(db, name, type);

    if (existingSubject !== null || existingNameAndType.length !== 0) {
      return res.status(400).json({ error: 'Subject already exists.' });
    }

    await subjectsDB.insertSubject(db, code, name, type);
    return res.status(200).json({ message: 'Successful addition!' });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

export const renderSubjectsPage = async (req, res) => {
  try {
    const subjects = await subjectsDB.getAllSubjects(db);
    subjects.sort((a, b) => a.name.localeCompare(b.name));
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = 9;

    const subjectsOnPage = subjects.slice((page - 1) * perPage, page * perPage);

    return res.render('subjects', {
      subjects: subjectsOnPage,
      currentPage: page,
      totalPages: Math.ceil(subjects.length / perPage),
    });
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
