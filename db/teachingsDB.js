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
    await db.query(
      `INSERT INTO Teachings SET teachingId = '${teachingId}', 
       teacherId = '${teacherCode}', 
      subjectId = '${subjectCode}', 
      groupId = '${groupCode}', 
      day = '${day}', 
      start = '${start}', 
      end = '${end}'
      `
    );
  } catch (error) {
    console.error("Error inserting teaching:", error);
    throw error;
  }
}

export async function getTeachingById(db, teachingId) {
  try {
    const teaching = await db
      .select()
      .from("Teachings")
      .where({
        teachingId: teachingId,
      })
      .one();

    return teaching;
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
    const wishlist = await db.query(
      `SELECT FROM Teachings WHERE teacherId = '${teacherId}' AND day = '${day}' AND start = '${start}' AND end = '${end}'`
    );

    return wishlist;
  } catch (error) {
    console.error("Error getting subjects from the database:", error);
    throw error;
  }
}

export async function getFreeGroup(db, groupId, day, start, end) {
  try {
    const wishlist = await db.query(
      `SELECT FROM Teachings WHERE groupId = '${groupId}' AND day = '${day}' AND start = '${start}' AND end = '${end}'`
    );

    return wishlist;
  } catch (error) {
    console.error("Error getting subjects from the database:", error);
    throw error;
  }
}

export async function getTeachingsByGroupAndSubjectId(db, groupId, subjectId) {
  try {
    const wishlist = await db.query(
      `SELECT FROM Teachings WHERE groupId = '${groupId}' AND subjectId = '${subjectId}' `
    );

    return wishlist;
  } catch (error) {
    console.error("Error getting teachings from the database:", error);
    throw error;
  }
}

export async function getTeachingByGroupId(db, groupId) {
  try {
    const wishlist = await db.query(
      `SELECT FROM Teachings WHERE groupId = '${groupId}'`
    );

    return wishlist;
  } catch (error) {
    console.error("Error getting teachings from the database:", error);
    throw error;
  }
}
