export async function getSubjectByUserId(db, teacherId) {
  try {
    const query = `SELECT subjectId FROM SubjectTeachings WHERE teacherId = '${teacherId}'`;
    const teacher = await db.query(query);
    return teacher;
  } catch (error) {
    console.error(`Error getting teaching with ID ${teacherId} from the database:`, error);
    throw error;
  }
}

export async function getTeachersSubjects(db, teacherId, subjectId) {
  try {
    const query = `SELECT * FROM SubjectTeachings WHERE teacherId = '${teacherId}' AND subjectId = '${subjectId}'`;
    const teacher = await db.query(query);
    return teacher;
  } catch (error) {
    console.error(`Error getting teaching with ID ${teacherId} from the database:`, error);
    throw error;
  }
}
