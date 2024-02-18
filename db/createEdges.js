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
    createEdge(db, "SubjectsClassrooms"),
    createEdge(db, "TeachersWishlists"),
    createEdge(db, "TeachingsWishlists"),
    createEdge(db, "TeachingsTimetable"),
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

export async function createEdgeSubjectsClassrooms(db, classroom, subject) {
  try {
    await db
      .create("EDGE", "SubjectsClassrooms")
      .from(subject["@rid"])
      .to(classroom["@rid"])
      .one();
  } catch (error) {
    console.error("Error creating SubjectsClassrooms edge:", error);
    throw error;
  }
}

export async function createEdgeTeachingsWishlists(db, wishlists, teachings) {
  try {
    await db
      .create("EDGE", "TeachingsWishlists")
      .from(wishlists["@rid"])
      .to(teachings["@rid"])
      .one();
  } catch (error) {
    console.error("Error creating TeachingsWishlists edge:", error);
    throw error;
  }
}

export async function createEdgeTeachingsTimetable(db, timetable, teachings) {
  try {
    await db
      .create("EDGE", "TeachingsTimetable")
      .from(teachings["@rid"])
      .to(timetable["@rid"])
      .one();
  } catch (error) {
    console.error("Error creating TeachingsTimetable edge:", error);
    throw error;
  }
}

export default createEdges;
