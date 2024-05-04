export async function selectTimetable(db) {
  try {
    const query = "SELECT FROM Timetable";
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by group ID:", error);
    throw error;
  }
}

export async function selectTimetableByGroupId(db, groupId) {
  try {
    const query = `SELECT FROM Timetable WHERE groupId LIKE '${groupId}%'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by group ID:", error);
    throw error;
  }
}

export async function selectTimetableByClassroom(db, classroomName) {
  try {
    const query = `SELECT FROM Timetable WHERE classroomName = '${classroomName}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by classroom:", error);
    throw error;
  }
}

export async function selectTimetableByTeacherId(db, teacherId) {
  try {
    const query = `SELECT FROM Timetable WHERE teacherId = '${teacherId}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by teacher ID:", error);
    throw error;
  }
}

export async function selectTimetableBySubjectId(db, subjectId) {
  try {
    const query = `SELECT FROM Timetable WHERE subjectId = '${subjectId}'`;
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

export async function getTimetebaleByTeacherId(
  db,
  teacherId,
  subjectId,
  groupId
) {
  try {
    const query = `SELECT FROM Timetable WHERE teacherId = '${teacherId}' AND subjectId = '${subjectId}' AND groupId = '${groupId}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by timetable ID:", error);
    throw error;
  }
}

export async function getTimetableByTeacherAndTime(
  db,
  teacherId,
  startTime,
  endTime,
  day
) {
  try {
    const query = `SELECT FROM Timetable WHERE teacherId = '${teacherId}' AND start = '${startTime}' AND end = '${endTime}' AND day = '${day}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by teacher and time:", error);
    throw error;
  }
}

export async function getFreeTeacher(db, teacherId, start, end, day) {
  try {
    const query = `SELECT FROM Timetable WHERE teacherId = '${teacherId}' AND start = '${start}' AND end = '${end}' AND day = '${day}'`;
    const teacher = await db.query(query);
    return teacher;
  } catch (error) {
    console.error(
      `Error getting teaching with ID ${teacherId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getFreeGroup(db, groupId, start, end, day) {
  try {
    const query = `SELECT FROM Timetable WHERE groupId = '${groupId}' AND start = '${start}' AND end = '${end}' AND day = '${day}'`;
    const teacher = await db.query(query);
    return teacher;
  } catch (error) {
    console.error(
      `Error getting teaching with ID ${groupId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getTeachingsByGroupAndSubjectId(db, groupId, subjectId) {
  try {
    const query = `SELECT FROM Timetable WHERE groupId = '${groupId}' AND subjectId = '${subjectId}' `;
    const teacher = await db.query(query);
    return teacher;
  } catch (error) {
    console.error(
      `Error getting teaching with ID ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getFreeClassroom(db, classroomName, start, end, day) {
  try {
    const query = `SELECT FROM Timetable WHERE classroomName = '${classroomName}' AND day = '${day}' AND start = '${start}' AND end = '${end}'`;
    const classroom = await db.query(query);
    return classroom;
  } catch (error) {
    console.error(
      `Error getting classroom with name: ${classroomName} from the database:`,
      error
    );
    throw error;
  }
}

export async function getTimetableByDayAndTime(db, day, start) {
  try {
    const query = `SELECT FROM Timetable WHERE day = '${day}' AND start = '${start}'`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error("Error selecting timetable by teacher and time:", error);
    throw error;
  }
}

export async function insertTimetable(
  db,
  timetableId,
  teacherCode,
  subjectCode,
  groupCode,
  day,
  start,
  end,
  classroomName,
  teaching,
  classroom
) {
  await db
    .let("newTimetable", (nt) => {
      nt.insert()
        .into("Timetable")
        .set({
          timetableId,
          teacherId: teacherCode,
          subjectId: subjectCode,
          groupId: groupCode,
          day,
          start,
          end,
          classroomName,
        })
        .return("@rid");
    })
    .let("classroomTimetableEdge", (cte) => {
      cte
        .create("EDGE", "ClassroomsTimetable")
        .from("$newTimetable")
        .to(classroom["@rid"])
        .set({
          teacherId: teacherCode,
          subjectId: subjectCode,
          groupId: groupCode,
          start,
          end,
          day,
          classroomName,
        });
    })
    .let("teachingTimetableEdge", (tte) => {
      tte
        .create("edge", "TeachingTimetable")
        .from(teaching["@rid"])
        .to("$newTimetable")
        .set({
          teacherId: teacherCode,
          subjectId: subjectCode,
          groupId: groupCode,
          start,
          end,
          day,
          classroomName,
        });
    })
    .commit()
    .return("$newTimetable")
    .all()
    .then(() => {});
}
