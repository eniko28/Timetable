export async function insertTeacherNameAndId(db, teacherCode, name) {
  try {
    await db.query(
      `INSERT INTO Teachers SET id = '${teacherCode}', name = '${name}'`
    );
  } catch (error) {
    console.error("Error inserting teacher:", error);
    throw error;
  }
}

export async function insertTeachersSubjectId(db, teacherCode, subjectCode) {
  try {
    await db.query(
      `UPDATE Teachers ADD subjectId = '${subjectCode}' WHERE id = '${teacherCode}'`
    );
  } catch (error) {
    console.error("Error inserting teacher:", error);
    throw error;
  }
}

export async function getAllTeachers(db) {
  try {
    const teachers = await db.select().from("Teachers").all();
    return teachers;
  } catch (error) {
    console.error("Error getting teachers from the database:", error);
    throw error;
  }
}

export async function getTeacherById(db, teacherId) {
  try {
    const teacher = await db
      .select()
      .from("Teachers")
      .where({
        id: teacherId,
      })
      .one();

    return teacher;
  } catch (error) {
    console.error(
      `Error getting teacher with ID ${teacherId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getTeacherSubjects(db, teacherId) {
  try {
    const subjects = await db
      .select("subjectId")
      .from("Teachers")
      .where({
        id: teacherId,
      })
      .all();

    return subjects;
  } catch (error) {
    console.error(
      `Error getting subjects for teacher with ID ${teacherId} from the database:`,
      error
    );
    throw error;
  }
}
