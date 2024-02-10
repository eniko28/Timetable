export async function getSubjectType(db, subjectType) {
  try {
    const subject = await db
      .select()
      .from("SubjectTypes")
      .where({
        type: subjectType,
      })
      .one();

    return subject;
  } catch (error) {
    console.error(
      `Error getting subjectType with ID ${teacherId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getTypesByRID(db, subjectType) {
  try {
    const subject = await db
      .select()
      .from("SubjectTypes")
      .where({
        "@rid": subjectType,
      })
      .one();

    return subject;
  } catch (error) {
    console.error(
      `Error getting subjectType with RID ${teacherId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getRIDByNameAndType(db, subjectType) {
  try {
    const subject = await db
      .select("@rid")
      .from("SubjectTypes")
      .where({
        type: subjectType,
      })
      .one();

    return subject;
  } catch (error) {
    console.error(
      `Error getting subjectType with name ${subjectName} and type ${subjectType} from the database:`,
      error
    );
    throw error;
  }
}
