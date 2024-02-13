export async function getAllGroups(db) {
  try {
    const groups = await db.select().from("Groups").all();
    return groups;
  } catch (error) {
    console.error("Error getting groups from the database:", error);
    throw error;
  }
}

export async function getGroupById(db, groupId) {
  try {
    const group = await db.select().from("Groups").where({ id: groupId }).one();

    return group;
  } catch (error) {
    console.error(
      `Error getting group with ID ${groupId} from the database:`,
      error
    );
    throw error;
  }
}

export async function insertGroupSubjectId(db, groupCode, subjectCode) {
  try {
    await db.query(
      `UPDATE Groups ADD subjectId = ['${subjectCode}'] WHERE id = '${groupCode}'`
    );
  } catch (error) {
    console.error("Error inserting subjectId into Groups:", error);
    throw error;
  }
}

export async function getGroupsBySubjectId(db, subjectId) {
  try {
    const groups = await db.query(
      `SELECT id FROM Groups WHERE subjectId contains '${subjectId}'`
    );

    return groups;
  } catch (error) {
    console.error(
      `Error getting group with SubjectID ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}
