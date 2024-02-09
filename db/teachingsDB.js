export async function insertTeaching(
  db,
  teachingId,
  teacherCode,
  groupCode,
  subjectCode,
  day,
  start,
  end
) {
  try {
    await db.query(
      `INSERT INTO Teachings SET 
          teachingId = ${teachingId}, 
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

export async function getAllTeachings(db) {
  try {
    const teachings = await db.select().from("Teachings").all();
    return teachings;
  } catch (error) {
    console.error("Error getting teachers from the database:", error);
    throw error;
  }
}

export async function getTeachingById(db, teachingId) {
  try {
    const teacher = await db
      .select()
      .from("Teachings")
      .where({
        teachingId: teachingId,
      })
      .one();

    return teacher;
  } catch (error) {
    console.error(
      `Error getting teaching with ID ${teachingId} from the database:`,
      error
    );
    throw error;
  }
}
