import { existsSync, copyFileSync, unlinkSync } from 'fs';
import { join, basename } from 'path';
import setupDatabase from '../db/dbSetup.js';
import * as personalDB from '../model/personalDB.js';
import { updateStudent } from '../model/studentsDB.js';
import { updateTeachers } from '../model/teachersDB.js';

let db;

setupDatabase()
  .then((database) => {
    db = database;
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    process.exit(1);
  });

export const getHomePage = async (req, res) => {
  try {
    const { userId } = req.session;
    const { type } = req.session;
    const userData = await personalDB.getUserData(db, userId);

    let imageName = null;
    const uploadDir = join(process.cwd(), 'uploadDir');
    const profilePicturePath = join(uploadDir, `${userId}-profile-picture.jpg`);
    if (existsSync(profilePicturePath)) {
      imageName = basename(profilePicturePath);
    }

    res.render('home', { userId, type, imageName, userData });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

export const postHomePage = async (req, res) => {
  try {
    const { userId } = req.session;
    const { type } = req.session;
    const { email, address, phone } = req.fields;
    const photo = req.files.avatar.name;
    if (email === '' || address === '' || phone === '' || photo === '') {
      return res.status(400).render('error', { message: 'Missing required data.' });
    }
    const imagePath = req.files.avatar.path;
    const imageName = `${userId}-profile-picture.jpg`;
    const uploadDir = join(process.cwd(), 'uploadDir');
    const destinationPath = join(uploadDir, imageName);
    const existingUser = await personalDB.getUserData(db, userId);
    if (existingUser) {
      await personalDB.updatePersonal(db, userId, imageName, address, email, phone);
    } else {
      await personalDB.insertPersonal(db, userId, imageName, address, email, phone);
    }
    if (existsSync(destinationPath)) {
      unlinkSync(destinationPath);
    }
    copyFileSync(imagePath, destinationPath);
    if (type === 'Student') {
      await updateStudent(db, userId);
    } else if (type === 'Teacher') {
      await updateTeachers(db, userId);
    }
    return res.redirect('home');
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
