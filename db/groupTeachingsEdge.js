export async function getSubjectsGroups(db, subjectId, groupId) {
  try {
    const query = `SELECT * FROM groupTeachings WHERE subjectId = '${subjectId}' AND groupId = '${groupId}'`;
    const teacher = await db.query(query);
    return teacher;
  } catch (error) {
    console.error(`Error getting  from the database:`, error);
    throw error;
  }
}
