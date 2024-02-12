import { v4 as uuidv4 } from "uuid";

export async function insertTeaching(
  db,
  teacherCode,
  subjectCode,
  groupCode,
  day,
  start,
  end
) {
  try {
    const teachingId = uuidv4();

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
