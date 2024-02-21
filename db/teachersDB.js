export async function insertTeacherNameAndId(db, teacherCode, name) {
  try {
    const query = `INSERT INTO Teachers SET id = '${teacherCode}', name = '${name}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error inserting teacher:", error);
    throw error;
  }
}

export async function getAllTeachers(db) {
  try {
    const query = "SELECT FROM Teachers";
    const teachers = await db.query(query);
    return teachers;
  } catch (error) {
    console.error("Error getting teachers from the database:", error);
    throw error;
  }
}

export async function getTeacherById(db, teacherId) {
  try {
    const query = `SELECT FROM Teachers WHERE id = '${teacherId}'`;
    const teacher = await db.query(query);
    return teacher.length > 0 ? teacher[0] : null;
  } catch (error) {
    console.error(
      `Error getting teacher with ID ${teacherId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getTeacherNameById(db, teacherId) {
  try {
    const query = `SELECT name FROM Teachers WHERE id = '${teacherId}'`;
    const teacher = await db.query(query);
    return teacher.length > 0 ? teacher[0].name : null;
  } catch (error) {
    console.error(
      `Error getting teacher with id ${teacherId} from the database:`,
      error
    );
    throw error;
  }
}
