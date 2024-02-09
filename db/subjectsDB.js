import { getSubjectType, getTypesByRID } from "./subjectTypes.js";

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

export async function getSubjectById(db, subjectId) {
  try {
    const group = await db
      .select()
      .from("Subjects")
      .where({ id: subjectId })
      .one();

    return group;
  } catch (error) {
    console.error(
      `Error getting subject with ID ${subjectId} from the database:`,
      error
    );
    throw error;
  }
}
