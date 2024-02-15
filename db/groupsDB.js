export async function insertGroupSubjectId(db, groupCode, subjectCode) {
  try {
    const query = `UPDATE Groups ADD subjectId = ['${subjectCode}'] WHERE id = '${groupCode}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error inserting subjectId into Groups:", error);
    throw error;
  }
}

export async function getAllGroups(db) {
  try {
    const query = "SELECT FROM Groups";
    const groups = await db.query(query);
    return groups;
  } catch (error) {
    console.error("Error getting groups from the database:", error);
    throw error;
  }
}

export async function getGroupById(db, groupId) {
  try {
    const query = `SELECT FROM Groups WHERE id = '${groupId}'`;
    const group = await db.query(query);
    return group.length > 0 ? group[0] : null;
  } catch (error) {
    console.error(
      `Error getting group with ID ${groupId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getGroupsBySubjectId(db, subjectId) {
  try {
    const query = `SELECT id FROM Groups WHERE subjectId contains '${subjectId}'`;
    const groups = await db.query(query);
    return groups;
  } catch (error) {
    console.error(
      `Error getting group with SubjectID ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getGroupIdByRid(db, groupRid) {
  try {
    const query = `SELECT id FROM Groups WHERE @rid = '${groupRid}'`;
    const groups = await db.query(query);
    return groups;
  } catch (error) {
    console.error(
      `Error getting group with RID ${groupRid} from the database:`,
      error
    );
    throw error;
  }
}

export async function getGroupsNameById(db, groupId) {
  try {
    const query = `SELECT name FROM Groups WHERE id = '${groupId}'`;
    const groups = await db.query(query);
    return groups;
  } catch (error) {
    console.error(
      `Error getting group with Id ${groupId} from the database:`,
      error
    );
    throw error;
  }
}
