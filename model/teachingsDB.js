export async function insertSubjectAndTeacher(db, teachingId, teacherCode, subjectCode) {
  try {
    const query = 'INSERT INTO Teachings (id, teacherId, subjectId) VALUES (:teachingId, :teacherCode, :subjectCode)';
    await db.query(query, {
      params: {
        teachingId,
        teacherCode,
        subjectCode,
      },
    });
  } catch (error) {
    console.error('Error inserting teaching:', error);
    throw error;
  }
}

export async function insertSubjectAndGroup(db, teachingId, subjectCode, groupCode) {
  try {
    const query = 'INSERT INTO Teachings (id, subjectId, groupId) VALUES (:teachingId, :subjectCode, :groupCode)';
    await db.query(query, {
      params: {
        teachingId,
        subjectCode,
        groupCode,
      },
    });
  } catch (error) {
    console.error('Error inserting teaching:', error);
    throw error;
  }
}

export async function updateTeacher(db, teacherCode, subjectCode) {
  try {
    const query = 'UPDATE Teachings SET teacherId = :teacherCode WHERE subjectId = :subjectCode';
    await db.query(query, {
      params: {
        teacherCode,
        subjectCode,
      },
    });
  } catch (error) {
    console.error('Error updating teaching:', error);
    throw error;
  }
}

export async function insertTeaching(db, teachingId, teacherCode, subjectCode, groupCode) {
  try {
    const query =
      'INSERT INTO Teachings (id, teacherId, subjectId, groupId) VALUES (:teachingId, :teacherCode, :subjectCode, :groupCode)';
    await db.query(query, {
      params: {
        teachingId,
        teacherCode,
        subjectCode,
        groupCode,
      },
    });
  } catch (error) {
    console.error('Error inserting teaching:', error);
    throw error;
  }
}

export async function updateGroup(db, subjectCode, groupCode) {
  try {
    const query = 'UPDATE Teachings SET groupId = :groupCode WHERE subjectId = :subjectCode';
    await db.query(query, {
      params: {
        groupCode,
        subjectCode,
      },
    });
  } catch (error) {
    console.error('Error updating teaching:', error);
    throw error;
  }
}

export async function getTeachingById(db, teachingId) {
  try {
    const query = `SELECT FROM Teachings WHERE id = '${teachingId}'`;
    const teaching = await db.query(query);
    return teaching.length > 0 ? teaching[0] : null;
  } catch (error) {
    console.error(`Error getting teaching with ID ${teachingId} from the database:`, error);
    throw error;
  }
}

export async function getTeachingsByGroupAndSubjectId(db, groupId, subjectId) {
  try {
    const query = `SELECT FROM Teachings WHERE groupId = '${groupId}' AND subjectId = '${subjectId}' `;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getTeachingsByTeacherAndSubject(db, teacherId, subjectId) {
  try {
    const query = `SELECT FROM Teachings WHERE teacherId = '${teacherId}' AND subjectId = '${subjectId}' `;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getTeachingByGroupId(db, groupId) {
  try {
    const query = `SELECT FROM Teachings WHERE groupId = '${groupId}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getTeacherBySubjectId(db, subjectId) {
  try {
    const query = `SELECT teacherId FROM Teachings WHERE subjectId = '${subjectId}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getAllBySubjectId(db, subjectId) {
  try {
    const query = `SELECT FROM Teachings WHERE subjectId = '${subjectId}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getGroupBySubjectId(db, subjectId) {
  try {
    const query = `SELECT groupId FROM Teachings WHERE subjectId = '${subjectId}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getTeachingIdBySubjectAndGroup(db, subjectId, groupId) {
  try {
    const query = `SELECT id FROM Teachings WHERE groupId = '${groupId}' AND subjectId = '${subjectId}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getTeachingIdByTeacherAndSubject(db, subjectId, teacherId) {
  try {
    const query = `SELECT id FROM Teachings WHERE teacherId = '${teacherId}' AND subjectId = '${subjectId}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getSubjectByUserId(db, teacherId) {
  try {
    const query = `SELECT subjectId FROM Teachings WHERE teacherId = '${teacherId}' `;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting teachings from the database:', error);
    throw error;
  }
}

export async function getTeachingId(db, teacherId, subjectId, groupId) {
  try {
    const query = `SELECT id FROM Teachings WHERE teacherId = '${teacherId}' AND subjectId = '${subjectId}' AND groupId = '${groupId}' `;
    const teaching = await db.query(query);
    return teaching;
  } catch (error) {
    console.error('Error getting teaching Id from the database:', error);
    throw error;
  }
}

export async function getTeachersByGroupId(db, groupId) {
  try {
    const query = `SELECT teacherId FROM Teachings WHERE groupId = '${groupId}'`;
    const teaching = await db.query(query);
    return teaching;
  } catch (error) {
    console.error(`Error getting teaching with ID ${groupId} from the database:`, error);
    throw error;
  }
}

export async function getSubjectByGroupId(db, groupId) {
  try {
    const query = `SELECT subjectId FROM Teachings WHERE groupId = '${groupId}'`;
    const teaching = await db.query(query);
    return teaching;
  } catch (error) {
    console.error(`Error getting teaching with ID ${groupId} from the database:`, error);
    throw error;
  }
}

export async function getSubjectsByTeacherId(db, teacherId) {
  try {
    const query = `SELECT * FROM Teachings WHERE teacherId = '${teacherId}'`;
    const teaching = await db.query(query);
    return teaching;
  } catch (error) {
    console.error(`Error getting teaching with teacherID ${teacherId} from the database:`, error);
    throw error;
  }
}
