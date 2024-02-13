export async function getAllClassrooms(db) {
  try {
    const classrooms = await db.select().from("Classrooms").all();
    return classrooms;
  } catch (error) {
    console.error("Error getting classrooms from the database:", error);
    throw error;
  }
}

export async function getClassroomByName(db, classroomName) {
  try {
    const classroom = await db
      .select()
      .from("Classrooms")
      .where({ name: classroomName })
      .one();

    return classroom;
  } catch (error) {
    console.error(
      `Error getting classroom with name: ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}
