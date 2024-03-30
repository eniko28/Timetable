function createVertex(db, className) {
  return db.class
    .get(className)
    .then(function (existingClass) {
      return existingClass;
    })
    .catch(function () {
      return db.class
        .create(className, "V")
        .then(function (createdClass) {
          return createdClass;
        })
        .catch(function (creationError) {
          console.error(
            `Error creating Class(V) '${className}':`,
            creationError
          );
          throw creationError;
        });
    });
}

function createVertices(db) {
  return Promise.all([
    createVertex(db, "Teachers"),
    createVertex(db, "Students"),
    createVertex(db, "Subjects"),
    createVertex(db, "Groups"),
    createVertex(db, "Teachings"),
    createVertex(db, "Classrooms"),
    createVertex(db, "Users"),
    createVertex(db, "Wishlists"),
    createVertex(db, "Timetable"),
    createVertex(db, "Personal"),
  ]);
}

export default createVertices;
