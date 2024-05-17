export async function insertUsers(db, userName, userId, password, type) {
  try {
    const query = `INSERT INTO Users SET userId = '${userId}', name = '${userName}', password = '${password}', type = '${type}'`;
    await db.query(query);
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

export async function getAllUsers(db) {
  try {
    const query = 'SELECT FROM Users';
    const users = await db.query(query);
    return users;
  } catch (error) {
    console.error('Error getting users from the database:', error);
    throw error;
  }
}

export async function getAllUserNames(db) {
  try {
    const query = 'SELECT name FROM Users';
    const users = await db.query(query);
    return users.map((user) => user.name);
  } catch (error) {
    console.error('Error getting user names from the database:', error);
    throw error;
  }
}

export async function getAllUserIds(db) {
  try {
    const query = 'SELECT userId FROM Users';
    const users = await db.query(query);
    return users.map((user) => user.userId);
  } catch (error) {
    console.error('Error getting user ids from the database:', error);
    throw error;
  }
}

export async function getType(db, userId) {
  try {
    const query = `SELECT type FROM Users WHERE userId = '${userId}'`;
    const result = await db.query(query);
    return result.length > 0 ? result[0].type : null;
  } catch (error) {
    console.error('Error getting user type by userId:', error);
    throw error;
  }
}

export async function getUsernameById(db, userId) {
  try {
    const query = `SELECT name FROM Users WHERE userId = '${userId}'`;
    const result = await db.query(query);
    return result.length > 0 ? result[0].name : null;
  } catch (error) {
    console.error('Error getting username by userId:', error);
    throw error;
  }
}

export async function getPassword(db, userId) {
  try {
    const query = `SELECT password FROM Users WHERE userId = '${userId}'`;
    const result = await db.query(query);
    return result.length > 0 ? result[0].password : null;
  } catch (error) {
    console.error('Error getting password by userId:', error);
    throw error;
  }
}

export async function getTeachers(db) {
  try {
    const query = "SELECT FROM Users WHERE type = 'Teacher'";
    const teachers = await db.query(query);
    return teachers;
  } catch (error) {
    console.error('Error getting users(teachers) from the database:', error);
    throw error;
  }
}
