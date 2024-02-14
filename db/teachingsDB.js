export async function insertTeaching(
  db,
  teachingId,
  teacherCode,
  subjectCode,
  groupCode,
  day,
  start,
  end
) {
  try {
    const query = `INSERT INTO Teachings SET teachingId = '${teachingId}', teacherId = '${teacherCode}', subjectId = '${subjectCode}', groupId = '${groupCode}', day = '${day}', start = '${start}', end = '${end}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error inserting teaching:", error);
    throw error;
  }
}

export async function getTeachingById(db, teachingId) {
  try {
    const query = `SELECT FROM Teachings WHERE teachingId = '${teachingId}'`;
    const teaching = await db.query(query);
    return teaching.length > 0 ? teaching[0] : null;
  } catch (error) {
    console.error(
      `Error getting teaching with ID ${teachingId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getFreeTeacher(db, teacherId, day, start, end) {
  try {
    const query = `SELECT FROM Teachings WHERE teacherId = '${teacherId}' AND day = '${day}' AND start = '${start}' AND end = '${end}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error("Error getting teachings from the database:", error);
    throw error;
  }
}

export async function getFreeGroup(db, groupId, day, start, end) {
  try {
    const query = `SELECT FROM Teachings WHERE groupId = '${groupId}' AND day = '${day}' AND start = '${start}' AND end = '${end}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error("Error getting teachings from the database:", error);
    throw error;
  }
}

export async function getTeachingsByGroupAndSubjectId(db, groupId, subjectId) {
  try {
    const query = `SELECT FROM Teachings WHERE groupId = '${groupId}' AND subjectId = '${subjectId}' `;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error("Error getting teachings from the database:", error);
    throw error;
  }
}

export async function getTeachingByGroupId(db, groupId) {
  try {
    const query = `SELECT FROM Teachings WHERE groupId = '${groupId}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error("Error getting teachings from the database:", error);
    throw error;
  }
}
