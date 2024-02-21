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
    return group[0];
  } catch (error) {
    console.error(
      `Error getting group with ID ${groupId} from the database:`,
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

export async function getAllGroupIds(db) {
  try {
    const query = `SELECT id FROM Groups `;
    const groups = await db.query(query);
    return groups;
  } catch (error) {
    console.error(`Error getting groupNames from the database:`, error);
    throw error;
  }
}

export async function getGroupsByNameAndGradeLevel(db, name, gradeLevel) {
  try {
    const query = `SELECT FROM Groups WHERE name = '${name}' AND gradeLevel = '${gradeLevel}'`;
    const groups = await db.query(query);
    return groups;
  } catch (error) {
    console.error(
      `Error getting group with name ${name}  AND gradeLevel ${gradeLevel}from the database:`,
      error
    );
    throw error;
  }
}
