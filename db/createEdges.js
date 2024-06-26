function createEdge(db, className) {
  return db.class
    .get(className)
    .then((existingClass) => existingClass)
    .catch(() =>
      db.class
        .create(className, 'E')
        .then((createdClass) => createdClass)
        .catch((creationError) => {
          console.error(`Error creating Class(E) '${className}':`, creationError);
          throw creationError;
        }),
    );
}

function createEdges(db) {
  return Promise.all([
    createEdge(db, 'TeacherTeachings'),
    createEdge(db, 'SubjectTeachings'),
    createEdge(db, 'GroupTeachings'),
    createEdge(db, 'TeachingTimetable'),
    createEdge(db, 'StudentsGroups'),
    createEdge(db, 'TeachersWishlists'),
    createEdge(db, 'ClassroomsTimetable'),
  ]);
}

export async function createEdgeTeacherTeachings(db, teacher, teaching, teacherId, subjectId) {
  try {
    await db
      .create('EDGE', 'TeacherTeachings')
      .from(teaching['@rid'])
      .to(teacher['@rid'])
      .set({
        teacherId,
        subjectId,
      })
      .one();
  } catch (error) {
    console.error('Error creating TeacherTeachings edge:', error);
    throw error;
  }
}

export async function createEdgeTeacherTeachingsWithoutInfo(db, teacher, teaching) {
  try {
    await db.create('EDGE', 'TeacherTeachings').from(teaching['@rid']).to(teacher['@rid']).one();
  } catch (error) {
    console.error('Error creating TeacherTeachings edge:', error);
    throw error;
  }
}

export async function createEdgeGroupTeachings(db, group, teaching, groupId, subjectId) {
  try {
    await db
      .create('EDGE', 'GroupTeachings')
      .from(teaching['@rid'])
      .to(group['@rid'])
      .set({
        groupId,
        subjectId,
      })
      .one();
  } catch (error) {
    console.error('Error creating GroupTeachings edge:', error);
    throw error;
  }
}

export async function createEdgesSubjectTeachings(db, subject, teaching, subjectId, teacherId) {
  try {
    await db
      .create('EDGE', 'SubjectTeachings')
      .from(teaching['@rid'])
      .to(subject['@rid'])
      .set({
        subjectId,
        teacherId,
      })
      .one();
  } catch (error) {
    console.error('Error creating SubjectTeachings edge:', error);
    throw error;
  }
}

export async function createEdgesSubjectTeachingsWithoutInfo(db, subject, teaching) {
  try {
    await db.create('EDGE', 'SubjectTeachings').from(teaching['@rid']).to(subject['@rid']).one();
  } catch (error) {
    console.error('Error creating SubjectTeachings edge:', error);
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
  classroomName,
) {
  try {
    await db
      .create('EDGE', 'TeachingTimetable')
      .from(teaching['@rid'])
      .to(timetable['@rid'])
      .set({
        teacherId,
        subjectId,
        groupId,
        start,
        end,
        day,
        classroomName,
      })
      .one();
  } catch (error) {
    console.error('Error creating TeachingTimetable edge:', error);
    throw error;
  }
}

export async function createEdgeStudentsGroups(db, student, group, studentId, groupId) {
  try {
    await db
      .create('EDGE', 'StudentsGroups')
      .from(student['@rid'])
      .to(group['@rid'])
      .set({
        studentId,
        groupId,
      })
      .one();
  } catch (error) {
    console.error('Error creating StudentsGroups edge:', error);
    throw error;
  }
}

export async function createEdgeTeachersWishlists(db, wishlist, teacher, start, end, day) {
  try {
    await db
      .create('EDGE', 'TeachersWishlists')
      .from(wishlist['@rid'])
      .to(teacher['@rid'])
      .set({
        day,
        start,
        end,
      })
      .one();
  } catch (error) {
    console.error('Error creating TeachersWishlists edge:', error);
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
  classroomName,
) {
  try {
    await db
      .create('EDGE', 'ClassroomsTimetable')
      .from(timetable['@rid'])
      .to(classroom['@rid'])
      .set({
        teacherId,
        subjectId,
        groupId,
        start,
        end,
        day,
        classroomName,
      })
      .one();
  } catch (error) {
    console.error('Error creating ClassroomsTimetable edge:', error);
    throw error;
  }
}

export default createEdges;
