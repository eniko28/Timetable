import {
  getSubjectType,
  getTypesByRID,
  getRIDByNameAndType,
} from "./subjectTypesDB.js";

export async function insertSubject(db, code, name, type) {
  try {
    const subjectTypeValue = await getSubjectType(db, type);
    const linkset = [
      {
        "@type": "d",
        "@class": "SubjectTypes",
        "@rid": subjectTypeValue["@rid"],
      },
    ];

    const query = `INSERT INTO Subjects SET id = '${code}', name = '${name}', type = ${JSON.stringify(
      linkset
    )}`;
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

    for (let subject of subjects) {
      const result = await getTypesByRID(db, subject.type.toString());
      subject.type = result.type;
    }

    return subjects;
  } catch (error) {
    console.error("Error getting subjects from the database:", error);
    throw error;
  }
}

export async function getAllSubjectsByNameAndType(db, name, type) {
  try {
    const typeFromDb = await getRIDByNameAndType(db, name, type);
    const query = `SELECT * FROM Subjects WHERE name = '${name}' AND type = ${typeFromDb.toString()}`;
    const subjects = await db.query(query);

    for (let subject of subjects) {
      const result = await getTypesByRID(db, subject.type.toString());
      subject.type = result.type;
    }

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
