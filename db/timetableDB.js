export async function insertTimetable(
  db,
  timetableId,
  teacherCode,
  subjectCode,
  groupCode,
  day,
  start,
  end,
  classroomName
) {
  try {
    const query = `INSERT INTO Timetable SET timetableId = '${timetableId}', teacherId = '${teacherCode}', subjectId = '${subjectCode}', groupId = '${groupCode}', day = '${day}', start = '${start}', end = '${end}', classroomName = '${classroomName}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error inserting teaching:", error);
    throw error;
  }
}

export async function selectTimetableByGroupId(db, groupId) {
  try {
    const query = `SELECT * FROM Timetable WHERE groupId = '${groupId}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by group ID:", error);
    throw error;
  }
}

export async function selectTimetableByClassroom(db, classroomName) {
  try {
    const query = `SELECT * FROM Timetable WHERE classroomName = '${classroomName}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by classroom:", error);
    throw error;
  }
}

export async function selectTimetableByTeacherId(db, teacherId) {
  try {
    const query = `SELECT * FROM Timetable WHERE teacherId = '${teacherId}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by teacher ID:", error);
    throw error;
  }
}

export async function selectTimetableBySubjectId(db, subjectId) {
  try {
    const query = `SELECT * FROM Timetable WHERE subjectId = '${subjectId}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by subject ID:", error);
    throw error;
  }
}

export async function getTimetableById(db, timetableId) {
  try {
    const query = `SELECT FROM Timetable WHERE timetableId = '${timetableId}'`;
    const result = await db.query(query);
    return result[0];
  } catch (error) {
    console.error("Error selecting timetable by timetable ID:", error);
    throw error;
  }
}
