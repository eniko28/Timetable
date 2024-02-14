function createPropertyClassroom(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "classroomId", "Integer"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "type", "String"),
      ]);
    })
    .then(function (properties) {
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

      const classroomPromises = classroomData.map((classroom) => {
        return createDataIfNotExistsClassrooms(
          db,
          className,
          classroom,
          "classroomId",
          classroom.classroomId
        );
      });

      return Promise.all(classroomPromises);
    })
    .catch(function (error) {
      console.error("Error creating properties for Classroom:", error);
    });
}

function createPropertyGroups(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "id", "Integer"),
        createPropertyIfNotExists(classObj, "gradeLevel", "Integer"),
        createPropertyIfNotExists(classObj, "subjectId", "EmbeddedList"),
      ]);
    })
    .then(function (properties) {
      const groupData = [
        { id: 611, gradeLevel: 1 },
        { id: 621, gradeLevel: 2 },
        { id: 631, gradeLevel: 3 },
        { id: 511, gradeLevel: 1 },
        { id: 512, gradeLevel: 1 },
        { id: 513, gradeLevel: 1 },
        { id: 514, gradeLevel: 1 },
        { id: 521, gradeLevel: 2 },
        { id: 522, gradeLevel: 2 },
        { id: 523, gradeLevel: 2 },
        { id: 524, gradeLevel: 2 },
        { id: 531, gradeLevel: 3 },
        { id: 532, gradeLevel: 3 },
        { id: 533, gradeLevel: 3 },
        { id: 534, gradeLevel: 3 },
        { id: 411, gradeLevel: 1 },
        { id: 421, gradeLevel: 2 },
        { id: 423, gradeLevel: 3 },
      ];

      const groupPromises = groupData.map((group) => {
        return createDataIfNotExistsGroups(
          db,
          className,
          group,
          "id",
          group.id,
          ["gradeLevel"]
        );
      });

      return Promise.all(groupPromises);
    })
    .catch(function (error) {
      console.error("Error creating properties for Groups:", error);
    });
}

function createPropertySubjects(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "type", "Linkset", "SubjectTypes"),
      ]);
    })
    .catch(function (error) {
      console.error("Error creating properties for Subjects:", error);
    });
}

function createPropertySubjectTypes(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "type", "String"),
      ]);
    })
    .then(function (properties) {
      const subjectTypesData = [
        { id: "course01", type: "Course" },
        { id: "seminar01", type: "Seminar" },
        { id: "laboratory01", type: "Laboratory" },
      ];
      const subjectTypesPromises = subjectTypesData.map((subjectTypes) => {
        return createDataIfNotExistsSubjectTypes(
          db,
          className,
          subjectTypes,
          "id",
          subjectTypes.id
        );
      });

      return Promise.all(subjectTypesPromises);
    })
    .catch(function (error) {
      console.error("Error creating properties for SubjectTypes:", error);
      return Promise.reject(error);
    });
}

function createPropertyTeachers(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "subjectId", "EmbeddedList"),
      ]);
    })
    .catch(function (error) {
      console.error("Error creating properties for Teachers:", error);
    });
}

function createPropertyStudents(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "group", "Linkset", "Groups"),
      ]);
    })
    .catch(function (error) {
      console.error("Error creating properties for Students:", error);
    });
}

function createPropertyWishlists(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "wishlistId", "String"),
        createPropertyIfNotExists(classObj, "teacherId", "String"),
        createPropertyIfNotExists(classObj, "subjectId", "String"),
        createPropertyIfNotExists(classObj, "groupId", "Integer"),
        createPropertyIfNotExists(classObj, "day", "String"),
        createPropertyIfNotExists(classObj, "start", "String"),
        createPropertyIfNotExists(classObj, "end", "String"),
        createPropertyIfNotExists(classObj, "approved", "Boolean"),
      ]);
    })
    .catch(function (error) {
      console.error("Error creating properties for Wishlists:", error);
    });
}

function createPropertyUser(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "userId", "String"),
        createPropertyIfNotExists(classObj, "name", "String"),
        createPropertyIfNotExists(classObj, "password", "String"),
        createPropertyIfNotExists(classObj, "type", "String"),
      ]);
    })
    .then(function (property) {
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
    .catch(function (error) {
      console.error("Error creating properties for Users:", error);
    });
}

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
      } else {
      }
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
        const insertQuery = `INSERT INTO ${className} SET ${keyName}=${keyValue}, id='${data.id}', gradeLevel='${data.gradeLevel}'`;

        return db
          .query(insertQuery)
          .then(() => {})
          .catch((error) => {
            console.error(
              `Error inserting data: ${JSON.stringify(data)}`,
              error
            );
          });
      } else {
      }
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
    .catch(function (error) {
      console.error("Error getting/creating property:", error);
      throw error;
    });
}

function createPropertyTeachings(db, className) {
  return db.class
    .get(`${className}`)
    .then(function (classObj) {
      return Promise.all([
        createPropertyIfNotExists(classObj, "id", "String"),
        createPropertyIfNotExists(classObj, "teacherId", "String"),
        createPropertyIfNotExists(classObj, "subjectId", "String"),
        createPropertyIfNotExists(classObj, "groupId", "Integer"),
        createPropertyIfNotExists(classObj, "day", "String"),
        createPropertyIfNotExists(classObj, "start", "String"),
        createPropertyIfNotExists(classObj, "end", "String"),
      ]);
    })
    .catch(function (error) {
      console.error("Error creating properties for Subjects:", error);
    });
}

function createDataIfNotExistsSubjectTypes(
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
        const insertQuery = `INSERT INTO ${className} SET ${keyName}='${keyValue}', type ='${data.type}'`;

        return db
          .query(insertQuery)
          .then(() => {})
          .catch((error) => {
            console.error(
              `Error inserting data: ${JSON.stringify(data)}`,
              error
            );
            return Promise.reject(error);
          });
      }
    })
    .catch((error) => {
      console.error("Error checking existing data:", error);
      return Promise.reject(error);
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
      } else {
      }
    });
}

function createProperty(db) {
  return Promise.all([
    createPropertyTeachers(db, "Teachers"),
    createPropertySubjects(db, "Subjects"),
    createPropertySubjectTypes(db, "SubjectTypes"),
    createPropertyGroups(db, "Groups"),
    createPropertyWishlists(db, "Wishlists"),
    createPropertyClassroom(db, "Classrooms"),
    createPropertyUser(db, "Users"),
    createPropertyTeachings(db, "Teachings"),
    createPropertyStudents(db, "Students"),
  ]);
}

export default createProperty;
