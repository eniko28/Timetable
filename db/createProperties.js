function createDataIfNotExists(db, className, data, keyName, keyValue) {
  return db
    .select()
    .from(className)
    .where({ [keyName]: keyValue })
    .one()
    .then((existingData) => {
      if (!existingData) {
        const insertQuery = `INSERT INTO ${className} SET userId='${keyValue}', name='${data.name}', password='${data.password}', type='${data.type}'`;

        return db
          .query(insertQuery)
          .then(() => {})
          .catch((error) => {
            console.error(
              `Error inserting data: ${JSON.stringify(data)}`,
              error
            );
          });
      }
      return existingData;
    });
}

function createDataIfNotExistsGroups(db, className, data, keyName, keyValue) {
  return db
    .select()
    .from(className)
    .where({ [keyName]: keyValue })
    .one()
    .then((existingData) => {
      if (!existingData) {
        const insertQuery = `INSERT INTO ${className} SET ${keyName}='${keyValue}', id='${data.id}', gradeLevel=${data.gradeLevel}, name = '${data.name}'`;

        return db
          .query(insertQuery)
          .then(() => {})
          .catch((error) => {
            console.error(
              `Error inserting data: ${JSON.stringify(data)}`,
              error
            );
          });
      }
      return existingData;
    });
}

function createPropertyIfNotExists(
  classObj,
  propertyName,
  propertyType,
  linkedClassName = null
) {
  return classObj.property
    .get(propertyName)
    .then((existingProperty) => {
      if (existingProperty === null) {
        const propertyConfig = {
          name: propertyName,
          type: propertyType,
        };
        if (propertyType === "Linkset" && linkedClassName) {
          propertyConfig.linkedClass = linkedClassName;
        }
        return classObj.property
          .create(propertyConfig)
          .then((createdProperty) => createdProperty);
      }
      return existingProperty;
    })
    .catch((error) => {
      console.error("Error getting/creating property:", error);
      throw error;
    });
}

function createDataIfNotExistsClassrooms(
  db,
  className,
  data,
  keyName,
  keyValue
) {
  return db
    .select()
    .from(className)
    .where({ [keyName]: keyValue })
    .one()
    .then((existingData) => {
      if (!existingData) {
        const insertQuery = `INSERT INTO ${className} SET ${keyName}=${keyValue}, classroomId='${data.classroomId}', name='${data.name}', type = '${data.type}'`;

        return db
          .query(insertQuery)
          .then(() => {})
          .catch((error) => {
            console.error(
              `Error inserting data: ${JSON.stringify(data)}`,
              error
            );
          });
      }
      return existingData;
    });
}

function createPropertyClassroom(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "classroomId", "Integer"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "type", "String"),
      ])
    )
    .then(() => {
      const classroomData = [
        { classroomId: 1, name: "Gamma", type: "Seminar" },
        { classroomId: 2, name: "Pi", type: "Seminar" },
        { classroomId: 3, name: "Lambda", type: "Seminar" },
        { classroomId: 4, name: "E", type: "Seminar" },
        { classroomId: 5, name: "Multimedia", type: "Seminar" },
        { classroomId: 6, name: "A320", type: "Seminar" },
        { classroomId: 7, name: "A321", type: "Seminar" },
        { classroomId: 8, name: "A323", type: "Seminar" },
        { classroomId: 9, name: "A324", type: "Seminar" },
        { classroomId: 10, name: "L320", type: "Laboratory" },
        { classroomId: 11, name: "L321", type: "Laboratory" },
        { classroomId: 12, name: "L322", type: "Laboratory" },
        { classroomId: 13, name: "L323", type: "Laboratory" },
        { classroomId: 14, name: "2/I", type: "Course" },
        { classroomId: 15, name: "5/I", type: "Course" },
        { classroomId: 16, name: "7/I", type: "Course" },
        { classroomId: 17, name: "9/I", type: "Course" },
        { classroomId: 18, name: "6/II", type: "Course" },
      ];

      const classroomPromises = classroomData.map((classroom) =>
        createDataIfNotExistsClassrooms(
          db,
          className,
          classroom,
          "classroomId",
          classroom.classroomId
        )
      );

      return Promise.all(classroomPromises);
    })
    .catch((error) => {
      console.error("Error creating properties for Classroom:", error);
    });
}

function createPropertyGroups(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "gradeLevel", "Integer"),
        createPropertyIfNotExists(classObj, "name", "String"),
      ])
    )
    .then(() => {
      const groupData = [
        { id: "611", gradeLevel: 1, name: "Mathematics Computer Science" },
        { id: "621", gradeLevel: 2, name: "Mathematics Computer Science" },
        { id: "631", gradeLevel: 3, name: "Mathematics Computer Science" },
        { id: "511", gradeLevel: 1, name: "Computer Science" },
        { id: "512", gradeLevel: 1, name: "Computer Science" },
        { id: "513", gradeLevel: 1, name: "Computer Science" },
        { id: "514", gradeLevel: 1, name: "Computer Science" },
        { id: "521", gradeLevel: 2, name: "Computer Science" },
        { id: "522", gradeLevel: 2, name: "Computer Science" },
        { id: "523", gradeLevel: 2, name: "Computer Science" },
        { id: "524", gradeLevel: 2, name: "Computer Science" },
        { id: "531", gradeLevel: 3, name: "Computer Science" },
        { id: "532", gradeLevel: 3, name: "Computer Science" },
        { id: "533", gradeLevel: 3, name: "Computer Science" },
        { id: "534", gradeLevel: 3, name: "Computer Science" },
        { id: "411", gradeLevel: 1, name: "Mathematics" },
        { id: "421", gradeLevel: 2, name: "Mathematics" },
        { id: "431", gradeLevel: 3, name: "Mathematics" },
      ];

      const groupPromises = groupData.map((group) =>
        createDataIfNotExistsGroups(db, className, group, "id", group.id, [
          "gradeLevel",
        ])
      );

      return Promise.all(groupPromises);
    })
    .catch((error) => {
      console.error("Error creating properties for Groups:", error);
    });
}

function createPropertySubjects(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "type", "String"),
      ])
    )
    .catch((error) => {
      console.error("Error creating properties for Subjects:", error);
    });
}

function createPropertyTeachers(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "credit", "Integer"),
        createPropertyIfNotExists(classObj, "personal", "Linkset", "Personal"),
      ])
    )
    .catch((error) => {
      console.error("Error creating properties for Teachers:", error);
    });
}

function createPropertyStudents(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "group", "String"),
        createPropertyIfNotExists(classObj, "personal", "Linkset", "Personal"),
      ])
    )
    .catch((error) => {
      console.error("Error creating properties for Students:", error);
    });
}

function createPropertyPersonal(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "profilePicture", "String"),
        createPropertyIfNotExists(classObj, "email", "String"),
        createPropertyIfNotExists(classObj, "address", "String"),
        createPropertyIfNotExists(classObj, "phone", "String"),
      ])
    )
    .catch((error) => {
      console.error("Error creating properties for Students:", error);
    });
}

function createPropertyWishlists(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "wishlistId", "String"),
        createPropertyIfNotExists(classObj, "teacherId", "String"),
        createPropertyIfNotExists(classObj, "day", "String"),
        createPropertyIfNotExists(classObj, "start", "String"),
        createPropertyIfNotExists(classObj, "end", "String"),
      ])
    )
    .catch((error) => {
      console.error("Error creating properties for Wishlists:", error);
    });
}

function createPropertyUser(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "userId", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "password", "String"),
        createPropertyIfNotExists(classObj, "type", "String"),
      ])
    )
    .then(() => {
      const userData = {
        userId: "admin01",
        name: "Admin",
        password:
          "$2b$10$PWTYAlbeqyHwbbMxgrGsB.kgk.IeukIce0dcAMkRjfY861u8iHLRS",
        type: "Admin",
      };

      return createDataIfNotExists(
        db,
        className,
        userData,
        "userId",
        "admin01"
      );
    })
    .catch((error) => {
      console.error("Error creating properties for Users:", error);
    });
}

function createPropertyTeachings(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "teacherId", "String"),
        createPropertyIfNotExists(classObj, "subjectId", "String"),
        createPropertyIfNotExists(classObj, "groupId", "String"),
      ])
    )
    .catch((error) => {
      console.error("Error creating properties for Subjects:", error);
    });
}

function createPropertyTimetable(db, className) {
  return db.class
    .get(`${className}`)
    .then((classObj) =>
      Promise.all([
        createPropertyIfNotExists(classObj, "timetableId", "String"),
        createPropertyIfNotExists(classObj, "teacherId", "String"),
        createPropertyIfNotExists(classObj, "subjectId", "String"),
        createPropertyIfNotExists(classObj, "groupId", "String"),
        createPropertyIfNotExists(classObj, "day", "String"),
        createPropertyIfNotExists(classObj, "start", "String"),
        createPropertyIfNotExists(classObj, "end", "String"),
        createPropertyIfNotExists(classObj, "classroomName", "String"),
      ])
    )
    .catch((error) => {
      console.error("Error creating properties for Subjects:", error);
    });
}

function createProperty(db) {
  return Promise.all([
    createPropertyTeachers(db, "Teachers"),
    createPropertySubjects(db, "Subjects"),
    createPropertyGroups(db, "Groups"),
    createPropertyWishlists(db, "Wishlists"),
    createPropertyClassroom(db, "Classrooms"),
    createPropertyUser(db, "Users"),
    createPropertyTeachings(db, "Teachings"),
    createPropertyStudents(db, "Students"),
    createPropertyTimetable(db, "Timetable"),
    createPropertyPersonal(db, "Personal"),
  ]);
}

export default createProperty;
