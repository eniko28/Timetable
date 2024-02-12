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

    await db.query(
      `INSERT INTO Subjects SET id = '${code}', name = '${name}', type = ${JSON.stringify(
        linkset
      )}`
    );
  } catch (error) {
    console.error("Error inserting subject:", error);
    throw error;
  }
}

export async function getAllSubjects(db) {
  try {
    const subjects = await db.select().from("Subjects").all();
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
    const typeFromDb = await getRIDByNameAndType(db, type);
    const subjects = await db.query(
      `SELECT FROM Subjects WHERE name = '${name}' AND type = ${typeFromDb.rid.toString()}`
    );

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
    const subject = await db
      .select()
      .from("Subjects")
      .where({ id: subjectId })
      .one();

    return subject;
  } catch (error) {
    console.error(
      `Error getting subject with ID ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}
