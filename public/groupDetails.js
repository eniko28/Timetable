document.addEventListener("DOMContentLoaded", function () {
  var selectedGroupId;
  var listItems = document.querySelectorAll("#groups-list li");
  var teacherInput = document.getElementById("teacherInput");
  var subjectInput = document.getElementById("subjectInput");
  var timetableCells = document.querySelectorAll("#timetable td");
  var formContainer = document.getElementById("form-container");

  listItems.forEach(function (item) {
    item.addEventListener("click", function () {
      listItems.forEach(function (item) {
        item.classList.remove("selected-group");
      });
      item.classList.add("selected-group");
    });
  });

  function updateTimetable(timetable) {
    timetableCells.forEach(function (cell) {
      cell.classList.remove("group-time");
    });

    timetable.forEach(function (slot) {
      var day = slot.day;
      var start = slot.start;
      var end = slot.end;

      switch (day) {
        case "Monday":
          day = "day1";
          break;
        case "Tuesday":
          day = "day2";
          break;
        case "Wednesday":
          day = "day3";
          break;
        case "Thursday":
          day = "day4";
          break;
        case "Friday":
          day = "day5";
          break;
        default:
          break;
      }

      var startCell = document.getElementById(day + "-hour" + start);
      var endCell = document.getElementById(day + "-hour" + end);

      if (startCell) {
        startCell.classList.add("group-time");
      }
    });
  }

  function updateTeacherInput(teachers) {
    teacherInput.innerHTML =
      "<option disabled selected>Select a teacher...</option>";
    const uniqueTeachers = [
      ...new Set(teachers.map((teacher) => teacher.teacherId)),
    ];
    uniqueTeachers.forEach(function (teacher) {
      var option = document.createElement("option");
      option.text = teacher;
      teacherInput.add(option);
    });
  }

  function updateSubjectInput(subjects) {
    subjectInput.innerHTML =
      "<option disabled selected>Select a subject...</option>";
    const uniqueSubjects = [
      ...new Set(subjects.map((subject) => subject.subjectId)),
    ];
    uniqueSubjects.forEach(function (subject) {
      var option = document.createElement("option");
      option.text = subject;
      subjectInput.add(option);
    });
  }

  listItems.forEach(function (item) {
    item.addEventListener("click", function () {
      listItems.forEach(function (item) {
        item.classList.remove("selected-group");
      });
      item.classList.add("selected-group");

      var previousTeacherWishlistCells =
        document.querySelectorAll(".start-time");
      previousTeacherWishlistCells.forEach(function (cell) {
        cell.classList.remove("start-time");
      });

      var groupId = item.getAttribute("data-groupid");
      selectedGroupId = item.getAttribute("data-groupid");

      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/group/" + groupId + "/details", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);

          if (response.teachers.length > 0) {
            updateTeacherInput(response.teachers);

            teacherInput.addEventListener("change", function () {
              timetableCells.forEach(function (cell) {
                cell.classList.remove("start-time");
              });

              var selectedTeacher = teacherInput.value;
              var filteredSubjects = response.subjects.filter(function (
                subject
              ) {
                return subject.teacherId === selectedTeacher;
              });

              updateSubjectInput(filteredSubjects);

              var teacherId = teacherInput.value;
              var teacherWishlists = response.wishlists.filter(function (
                wishlist
              ) {
                return wishlist.teacherId === teacherId;
              });

              teacherWishlists.forEach(function (wishlist) {
                var day = wishlist.day;
                var start = wishlist.start;
                var end = wishlist.end;

                switch (day) {
                  case "Monday":
                    day = "day1";
                    break;
                  case "Tuesday":
                    day = "day2";
                    break;
                  case "Wednesday":
                    day = "day3";
                    break;
                  case "Thursday":
                    day = "day4";
                    break;
                  case "Friday":
                    day = "day5";
                    break;
                  default:
                    break;
                }

                var startCell = document.getElementById(day + "-hour" + start);
                var endCell = document.getElementById(day + "-hour" + end);

                if (startCell) {
                  startCell.classList.add("start-time");
                }
              });

              updateTimetable(response.timetable);
            });
          } else {
            teacherInput.innerHTML =
              "<option disabled selected>No teachers in this group</option>";
          }
          updateTimetable(response.timetable);
        }
      };
      xhr.send();
    });
  });

  const dayMappings = {
    day1: "Monday",
    day2: "Tuesday",
    day3: "Wednesday",
    day4: "Thursday",
    day5: "Friday",
  };
  timetableCells.forEach(function (cell) {
    cell.addEventListener("click", function () {
      formContainer.style.display = "block";
      var cellId = cell.id.split("-");
      var selectedDay = dayMappings[cellId[0]];
      var startTime = cellId[1]
        .replace("hour", "")
        .padStart(4, "0")
        .replace(/(..)(..)/, "$1$2");
      var endTime =
        (parseInt(startTime.split(":")[0]) + 2).toString().padStart(2, "0") +
        ":00";

      var form = document.getElementById("classroomForm");
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var selectedClassroom =
          document.getElementById("classroomSelect").value;
        var selectedTeacher = document.getElementById("teacherInput").value;
        var selectedSubject = document.getElementById("subjectInput").value;

        switch (selectedDay) {
          case "day1":
            selectedDay = "Monday";
            break;
          case "day2":
            selectedDay = "Tuesday";
            break;
          case "day3":
            selectedDay = "Wednesday";
            break;
          case "day4":
            selectedDay = "Thursday";
            break;
          case "day5":
            selectedDay = "Friday";
            break;
          default:
            break;
        }

        const data = {
          groupId: selectedGroupId,
          teacherId: selectedTeacher,
          subjectId: selectedSubject,
          day: selectedDay,
          start: startTime,
          end: endTime,
          classroomName: selectedClassroom,
        };

        sendWishlist(data);
      });
    });
  });

  function updateSubjects(subjects) {
    subjectInput.innerHTML =
      "<option disabled selected>Select a subject...</option>";
    const uniqueSubjects = [
      ...new Set(subjects.map((subject) => subject.subjectId)),
    ];
    uniqueSubjects.forEach(function (subject) {
      var option = document.createElement("option");
      option.text = subject;
      subjectInput.add(option);
    });
  }

  function sendWishlist(data) {
    fetch("/wishlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Wishlist data sent successfully!");
        } else {
          if (response.headers.get("content-type").includes("text/html")) {
            response.text().then((errorMessage) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(errorMessage, "text/html");
              const message = doc.body.textContent.trim();

              alert(message);
            });
          } else {
            response.json().then((errorData) => {
              alert(errorData.message);
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error sending wishlist data:", error);
      });
  }
});
