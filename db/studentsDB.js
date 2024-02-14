import * as groupDB from "../db/groupsDB.js";

export async function insertStudent(db, code, name, groupId) {
  try {
    const group = await groupDB.getGroupById(db, groupId);
    const linkset = [
      {
        "@type": "d",
        "@class": "Groups",
        "@rid": group["@rid"],
      },
    ];

    await db.query(
      `INSERT INTO Students SET id = '${code}', name = '${name}', group = ${JSON.stringify(
        linkset
      )}`
    );
  } catch (error) {
    console.error("Error inserting students:", error);
    throw error;
  }
}

export async function getGroupIdByStudentId(db, userId) {
  try {
    const result = await db.query(
      `SELECT group FROM Students WHERE id = '${userId}'`
    );

    if (result.length > 0) {
      return result[0].group;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting student's group from the database:", error);
    throw error;
  }
}
