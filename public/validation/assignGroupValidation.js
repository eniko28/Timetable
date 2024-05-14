document.getElementById("assignGroup").addEventListener("submit", (event) => {
  const groupCode = document.getElementById("groupCode").value.trim();
  const subjectCode = document.getElementById("subjectCode").value.trim();

  const groupIdError = document.getElementById("groupIdError");
  const subjectIdError = document.getElementById("subjectIdError");

  groupIdError.textContent = "";
  subjectIdError.textContent = "";

  if (groupCode === "") {
    groupIdError.textContent = "Please select a group";
    event.preventDefault();
  }
  if (subjectCode === "") {
    subjectIdError.textContent = "Please select a subject";
    event.preventDefault();
  }
});
