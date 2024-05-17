import { getUserData } from './personalDB.js';

export async function insertTeacherNameAndId(db, teacherCode, name) {
  try {
    const credit = 5;
    const query = `INSERT INTO Teachers SET id = '${teacherCode}', name = '${name}', credit = '${credit}'`;
    await db.query(query);
  } catch (error) {
    console.error('Error inserting teacher:', error);
    throw error;
  }
}

export async function updateTeachersCredit(db, teacherCode, credit) {
  try {
    const query = `UPDATE Teachers SET credit = '${credit}' WHERE id = '${teacherCode}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error updating teacher's credit:", error);
    throw error;
  }
}

export async function getCredit(db, teacherCode) {
  try {
    const query = `SELECT credit FROM Teachers WHERE id = '${teacherCode}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error updating teacher's credit:", error);
    throw error;
  }
}

export async function updateTeachers(db, userId) {
  try {
    const personal = await getUserData(db, userId);

    const linkset = [
      {
        '@type': 'd',
        '@class': 'Personal',
        '@rid': personal['@rid'],
      },
    ];

    await db.query(`UPDATE Teachers SET personal = ${JSON.stringify(linkset)} WHERE id = :userId`, {
      params: { userId },
    });
  } catch (error) {
    console.error('Error updating teachers:', error);
    throw error;
  }
}

export async function getAllTeachers(db) {
  try {
    const query = 'SELECT FROM Teachers';
    const teachers = await db.query(query);
    return teachers;
  } catch (error) {
    console.error('Error getting teachers from the database:', error);
    throw error;
  }
}

export async function getTeacherById(db, teacherId) {
  try {
    const query = `SELECT FROM Teachers WHERE id = '${teacherId}'`;
    const teacher = await db.query(query);
    return teacher.length > 0 ? teacher[0] : null;
  } catch (error) {
    console.error(`Error getting teacher with ID ${teacherId} from the database:`, error);
    throw error;
  }
}

export async function getTeacherNameById(db, teacherId) {
  try {
    const query = `SELECT name FROM Teachers WHERE id = '${teacherId}'`;
    const teacher = await db.query(query);
    return teacher.length > 0 ? teacher[0].name : null;
  } catch (error) {
    console.error(`Error getting teacher with id ${teacherId} from the database:`, error);
    throw error;
  }
}
