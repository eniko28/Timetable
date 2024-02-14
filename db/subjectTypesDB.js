export async function getSubjectType(db, subjectType) {
  try {
    const query = `SELECT FROM SubjectTypes WHERE type = '${subjectType}'`;
    const subject = await db.query(query);
    return subject.length > 0 ? subject[0] : null;
  } catch (error) {
    console.error(
      `Error getting subjectType with type ${subjectType} from the database:`,
      error
    );
    throw error;
  }
}

export async function getTypesByRID(db, subjectType) {
  try {
    const query = `SELECT FROM SubjectTypes WHERE @rid = '${subjectType}'`;
    const subject = await db.query(query);
    return subject.length > 0 ? subject[0] : null;
  } catch (error) {
    console.error(
      `Error getting subjectType with RID ${subjectType} from the database:`,
      error
    );
    throw error;
  }
}

export async function getRIDByNameAndType(db, subjectName, subjectType) {
  try {
    const query = `SELECT @rid FROM SubjectTypes WHERE type = '${subjectType}'`;
    const subject = await db.query(query);
    return subject.length > 0 ? subject[0].rid : null;
  } catch (error) {
    console.error(
      `Error getting subjectType with name ${subjectName} and type ${subjectType} from the database:`,
      error
    );
    throw error;
  }
}
