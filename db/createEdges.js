function createEdge(db, className) {
  return db.class
    .get(className)
    .then(function (existingClass) {
      return existingClass;
    })
    .catch(function () {
      return db.class
        .create(className, "E")
        .then(function (createdClass) {
          return createdClass;
        })
        .catch(function (creationError) {
          console.error(
            `Error creating Class(E) '${className}':`,
            creationError
          );
          throw creationError;
        });
    });
}

function createEdges(db) {
  return Promise.all([
    createEdge(db, "TeacherTeachings"),
    createEdge(db, "SubjectTeachings"),
    createEdge(db, "GroupTeachings"),
    createEdge(db, "TeachersWishlists"),
    createEdge(db, "SubjectsClassrooms"),
  ]);
}

export async function createEdgeTeacherTeachings(db, teacher, teaching) {
  try {
    await db
      .create("EDGE", "TeacherTeachings")
      .from(teaching["@rid"])
      .to(teacher["@rid"])
      .one();
  } catch (error) {
    console.error("Error creating TeacherTeachings edge:", error);
    throw error;
  }
}

export async function createEdgeGroupTeachings(db, group, teaching) {
  try {
    await db
      .create("EDGE", "GroupTeachings")
      .from(teaching["@rid"])
      .to(group["@rid"])
      .one();
  } catch (error) {
    console.error("Error creating GroupTeachings edge:", error);
    throw error;
  }
}

export async function createEdgesSubjectTeachings(db, subject, teaching) {
  try {
    await db
      .create("EDGE", "SubjectTeachings")
      .from(teaching["@rid"])
      .to(subject["@rid"])
      .one();
  } catch (error) {
    console.error("Error creating SubjectTeachings edge:", error);
    throw error;
  }
}

export async function createEdgeTeachersWishlists(db, wishlists, teacher) {
  try {
    await db
      .create("EDGE", "TeachersWishlists")
      .from(wishlists["@rid"])
      .to(teacher["@rid"])
      .one();
  } catch (error) {
    console.error("Error creating TeachersWishlists edge:", error);
    throw error;
  }
}

export async function createEdgeSubjectsClassrooms(
  db,
  classroom,
  subject,
  subjectId,
  classroomName
) {
  try {
    await db
      .create("EDGE", "SubjectsClassrooms")
      .from(subject["@rid"])
      .to(classroom["@rid"])
      .set({
        subjectId: subjectId,
        classroomName: classroomName,
      })
      .one();
  } catch (error) {
    console.error("Error creating SubjectsClassrooms edge:", error);
    throw error;
  }
}

export default createEdges;
