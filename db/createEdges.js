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
    createEdge(db, "TeachingTimetable"),
    createEdge(db, "StudentsGroups"),
    createEdge(db, "TeachingsWishlists"),
    createEdge(db, "ClassroomsTimetable"),
  ]);
}

export async function createEdgeTeacherTeachings(
  db,
  teacher,
  teaching,
  teacherId,
  subjectId
) {
  try {
    await db
      .create("EDGE", "TeacherTeachings")
      .from(teaching["@rid"])
      .to(teacher["@rid"])
      .set({
        teacherId: teacherId,
        subjectId: subjectId,
      })
      .one();
  } catch (error) {
    console.error("Error creating TeacherTeachings edge:", error);
    throw error;
  }
}

export async function createEdgeGroupTeachings(
  db,
  group,
  teaching,
  groupId,
  subjectId
) {
  try {
    await db
      .create("EDGE", "GroupTeachings")
      .from(teaching["@rid"])
      .to(group["@rid"])
      .set({
        groupId: groupId,
        subjectId: subjectId,
      })
      .one();
  } catch (error) {
    console.error("Error creating GroupTeachings edge:", error);
    throw error;
  }
}

export async function createEdgesSubjectTeachings(
  db,
  subject,
  teaching,
  subjectId,
  teacherId
) {
  try {
    await db
      .create("EDGE", "SubjectTeachings")
      .from(teaching["@rid"])
      .to(subject["@rid"])
      .set({
        subjectId: subjectId,
        teacherId: teacherId,
      })
      .one();
  } catch (error) {
    console.error("Error creating SubjectTeachings edge:", error);
    throw error;
  }
}

export async function createEdgeTeachingTimetable(
  db,
  teaching,
  timetable,
  teacherId,
  subjectId,
  groupId,
  start,
  end,
  day,
  classroomName
) {
  try {
    await db
      .create("EDGE", "TeachingTimetable")
      .from(teaching["@rid"])
      .to(timetable["@rid"])
      .set({
        teacherId: teacherId,
        subjectId: subjectId,
        groupId: groupId,
        start: start,
        end: end,
        day: day,
        classroomName: classroomName,
      })
      .one();
  } catch (error) {
    console.error("Error creating TeachingTimetable edge:", error);
    throw error;
  }
}

export async function createEdgeStudentsGroups(
  db,
  student,
  group,
  studentId,
  groupId
) {
  try {
    await db
      .create("EDGE", "StudentsGroups")
      .from(student["@rid"])
      .to(group["@rid"])
      .set({
        studentId: studentId,
        groupId: groupId,
      })
      .one();
  } catch (error) {
    console.error("Error creating StudentsGroups edge:", error);
    throw error;
  }
}

export async function createEdgeTeachingsWishlists(
  db,
  wishlist,
  teaching,
  teacherId,
  subjectId,
  groupId,
  start,
  end,
  day
) {
  try {
    await db
      .create("EDGE", "TeachingsWishlists")
      .from(wishlist["@rid"])
      .to(teaching["@rid"])
      .set({
        teacherId: teacherId,
        subjectId: subjectId,
        groupId: groupId,
        start: start,
        end: end,
        day: day,
      })
      .one();
  } catch (error) {
    console.error("Error creating TeachingsWishlists edge:", error);
    throw error;
  }
}

export async function createEdgeClassroomsTimetable(
  db,
  classroom,
  timetable,
  teacherId,
  subjectId,
  groupId,
  start,
  end,
  day,
  classroomName
) {
  try {
    await db
      .create("EDGE", "ClassroomsTimetable")
      .from(timetable["@rid"])
      .to(classroom["@rid"])
      .set({
        teacherId: teacherId,
        subjectId: subjectId,
        groupId: groupId,
        start: start,
        end: end,
        day: day,
        classroomName: classroomName,
      })
      .one();
  } catch (error) {
    console.error("Error creating ClassroomsTimetable edge:", error);
    throw error;
  }
}

export default createEdges;
