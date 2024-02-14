export async function getSubjectClassroom(db, subjectId) {
  try {
    const result = await db.query(
      `SELECT classroomName FROM SubjectsClassrooms WHERE subjectId = '${subjectId}'`
    );
    return result;
  } catch (error) {
    console.error("Error getting SubjectClassroom from the database:", error);
    throw error;
  }
}
