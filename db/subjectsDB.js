export async function insertSubject(db, code, name, type) {
  try {
    var hours = 0;
    if (type === "Course") {
      hours = 1;
    } else {
      if (type === "Seminar" || type === "Laboratory") {
        hours = 4;
      }
    }
    const query = `INSERT INTO Subjects SET id = '${code}', name = '${name}', type = '${type}', hours = '${hours}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error inserting subject:", error);
    throw error;
  }
}

export async function getAllSubjects(db) {
  try {
    const query = "SELECT * FROM Subjects";
    const subjects = await db.query(query);
    return subjects;
  } catch (error) {
    console.error("Error getting subjects from the database:", error);
    throw error;
  }
}

export async function getAllSubjectsByNameAndType(db, name, type) {
  try {
    const query = `SELECT * FROM Subjects WHERE name = '${name}' AND type = '${type}'`;
    const subjects = await db.query(query);
    return subjects;
  } catch (error) {
    console.error("Error getting subjects from the database:", error);
    throw error;
  }
}

export async function getSubjectById(db, subjectId) {
  try {
    const query = `SELECT FROM Subjects WHERE id = '${subjectId}'`;
    const subject = await db.query(query);
    return subject.length > 0 ? subject[0] : null;
  } catch (error) {
    console.error(
      `Error getting subject with ID ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getSubjectRidById(db, subjectId) {
  try {
    const query = `SELECT type FROM Subjects WHERE id = '${subjectId}'`;
    const subjects = await db.query(query);
    return subjects.length > 0 ? subjects[0].type : null;
  } catch (error) {
    console.error("Error getting subjects from the database:", error);
    throw error;
  }
}

export async function getSubjectsByName(db, subjectName) {
  try {
    const query = `SELECT id FROM Subjects WHERE name = '${subjectName}'`;
    const subjects = await db.query(query);
    return subjects;
  } catch (error) {
    console.error(
      `Error getting subjects with name ${subjectName} from the database:`,
      error
    );
    throw error;
  }
}

export async function getSubjectTypeById(db, subjectId) {
  try {
    const query = `SELECT type FROM Subjects WHERE id = '${subjectId}'`;
    const subject = await db.query(query);
    return subject.length > 0 ? subject[0] : null;
  } catch (error) {
    console.error(
      `Error getting subject with ID ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}
