import { getUserData } from './personalDB.js';

export async function insertStudent(db, code, name, groupId) {
  try {
    const query = 'INSERT INTO Students (id, name, group) VALUES (:code, :name, :groupId)';
    await db.query(query, {
      params: {
        code,
        name,
        groupId,
      },
    });
  } catch (error) {
    console.error('Error inserting students:', error);
    throw error;
  }
}

export async function updateStudent(db, userId) {
  try {
    const personal = await getUserData(db, userId);

    const linkset = [
      {
        '@type': 'd',
        '@class': 'Personal',
        '@rid': personal['@rid'],
      },
    ];

    await db.query(`UPDATE Students SET personal = ${JSON.stringify(linkset)} WHERE id = :userId`, {
      params: { userId },
    });
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

export async function getGroupIdByStudentId(db, userId) {
  try {
    const result = await db.query(`SELECT group FROM Students WHERE id = '${userId}'`);

    if (result.length > 0) {
      return result[0].group;
    }
    return null;
  } catch (error) {
    console.error("Error getting student's group from the database:", error);
    throw error;
  }
}

export async function getStudentById(db, userId) {
  try {
    const query = `SELECT FROM Students WHERE id = '${userId}'`;
    const result = await db.query(query);
    return result[0];
  } catch (error) {
    console.error("Error getting student's group from the database:", error);
    throw error;
  }
}
