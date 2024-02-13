document.addEventListener("DOMContentLoaded", function () {
  var subjectIdInput = document.getElementsByName("subjectId")[0].id;
  var classroomCodeSelect = document.getElementById("classroomName");

  fetch("/getClassroomBySubject?subjectId=" + subjectIdInput)
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
    .catch((error) => console.error("Error fetching classrooms:", error));
});
