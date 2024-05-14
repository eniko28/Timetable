document.getElementById("assignTeacher").addEventListener("submit", (event) => {
  const teacherCode = document.getElementById("teacherCode").value.trim();
  const subjectCode = document.getElementById("subjectCode").value.trim();

  const teacherIdError = document.getElementById("teacherIdError");
  const subjectIdError = document.getElementById("subjectIdError");

  teacherIdError.textContent = "";
  subjectIdError.textContent = "";

  if (teacherCode === "") {
    teacherIdError.textContent = "Please select a teacher";
    event.preventDefault();
  }
  if (subjectCode === "") {
    subjectIdError.textContent = "Please select a subject";
    event.preventDefault();
  }
});
