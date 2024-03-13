document.addEventListener("DOMContentLoaded", function () {
  var subjectIdInputs = document.getElementsByName("subjectId");
  var classroomCodeSelects = document.querySelectorAll("select#classroomName");

  subjectIdInputs.forEach((subjectIdInput, index) => {
    var classroomCodeSelect = classroomCodeSelects[index];
    var subjectId = subjectIdInput.id;

    fetch("/getClassroomBySubject?subjectId=" + subjectId)
      .then((response) => response.json())
      .then((classrooms) => {
        classroomCodeSelect.innerHTML = "";
        classrooms.forEach(function (classroom) {
          var option = document.createElement("option");
          option.value = classroom.name;
          option.textContent = classroom.name;
          classroomCodeSelect.appendChild(option);
        });
      })
      .catch((error) =>
        console.error(
          "Error fetching classrooms for subjectId:",
          subjectId,
          error
        )
      );
  });
});
