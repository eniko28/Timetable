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
