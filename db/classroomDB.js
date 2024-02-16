export async function getAllClassrooms(db) {
  try {
    const query = "SELECT * FROM Classrooms";
    const classrooms = await db.query(query);
    return classrooms;
  } catch (error) {
    console.error("Error getting classrooms from the database:", error);
    throw error;
  }
}

export async function getClassroomByName(db, classroomName) {
  try {
    const query = `SELECT FROM Classrooms WHERE name = '${classroomName}'`;
    const classroom = await db.query(query);
    return classroom.length > 0 ? classroom[0] : null;
  } catch (error) {
    console.error(
      `Error getting classroom with name: ${classroomName} from the database:`,
      error
    );
    throw error;
  }
}

export async function getClassroomByType(db, classroomType) {
  try {
    const query = `SELECT name FROM Classrooms WHERE type = '${classroomType}'`;
    const classrooms = await db.query(query);
    return classrooms;
  } catch (error) {
    console.error(
      `Error getting classroom with type: ${classroomType} from the database:`,
      error
    );
    throw error;
  }
}
