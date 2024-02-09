export async function insertUsers(db, userName, userId, password, type) {
  try {
    await db.query(
      `INSERT INTO Users SET 
              userId = '${userId}', 
              name = '${userName}', 
              password = '${password}',
              type = '${type}' 
            `
    );
  } catch (error) {
    console.error("Error inserting teaching:", error);
    throw error;
  }
}

export async function getAllUsers(db) {
  try {
    const users = await db.select().from("Users").all();
    return users;
  } catch (error) {
    console.error("Error getting teachers from the database:", error);
    throw error;
  }
}

export async function getAllUserNames(db) {
  try {
    const users = await db.select("name").from("Users").all();
    return users.map((user) => user.name);
  } catch (error) {
    console.error("Error getting user names from the database:", error);
    throw error;
  }
}

export async function getAllUserIds(db) {
  try {
    const users = await db.select("userId").from("Users").all();
    return users.map((user) => user.userId);
  } catch (error) {
    console.error("Error getting user ids from the database:", error);
    throw error;
  }
}

export async function getType(db, userId) {
  try {
    const result = await db
      .select("type")
      .from("Users")
      .where({ userId })
      .one();

    if (result) {
      return result.type;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user type by userId:", error);
    throw error;
  }
}

export async function getUsernameById(db, userId) {
  try {
    const result = await db
      .select("name")
      .from("Users")
      .where({ userId })
      .one();

    if (result) {
      return result.name;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting username by userId:", error);
    throw error;
  }
}

export async function getPassword(db, userId) {
  try {
    const result = await db
      .select("password")
      .from("Users")
      .where({ userId })
      .one();

    if (result) {
      return result.password;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting password by userId:", error);
    throw error;
  }
}

export async function getTeachers(db) {
  try {
    const teachers = await db
      .select()
      .from("Users")
      .where({ type: "Teacher" })
      .all();

    return teachers;
  } catch (error) {
    console.error("Error getting teachers from the database:", error);
    throw error;
  }
}
