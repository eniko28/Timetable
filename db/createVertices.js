function createVertex(db, className) {
  return db.class
    .get(className)
    .then((existingClass) => existingClass)
    .catch(() =>
      db.class
        .create(className, 'V')
        .then((createdClass) => createdClass)
        .catch((creationError) => {
          console.error(`Error creating Class(V) '${className}':`, creationError);
          throw creationError;
        }),
    );
}

function createVertices(db) {
  return Promise.all([
    createVertex(db, 'Teachers'),
    createVertex(db, 'Students'),
    createVertex(db, 'Subjects'),
    createVertex(db, 'Groups'),
    createVertex(db, 'Teachings'),
    createVertex(db, 'Classrooms'),
    createVertex(db, 'Users'),
    createVertex(db, 'Wishlists'),
    createVertex(db, 'Timetable'),
    createVertex(db, 'Personal'),
  ]);
}

export default createVertices;
