document.getElementById("addSubjects").addEventListener("submit", (event) => {
  const code = document.getElementById("code").value.trim();
  const name = document.getElementById("name").value.trim();
  const type = document.getElementById("type").value;

  const codeError = document.getElementById("codeError");
  const nameError = document.getElementById("nameError");
  const typeError = document.getElementById("typeError");

  codeError.textContent = "";
  nameError.textContent = "";
  typeError.textContent = "";

  if (code === "") {
    codeError.textContent = "Please fill in Subject Id field";
    event.preventDefault();
  }
  if (code.length < 1) {
    codeError.textContent = "Subject Id must be at least 1 character long";
    event.preventDefault();
  }
  if (!/^[A-Za-z0-9]+$/.test(code)) {
    codeError.textContent = "Subject Id can only contain letters and numbers";
    event.preventDefault();
    document.getElementById("code").focus();
  }
  if (name === "") {
    nameError.textContent = "Please fill in Name field";
    event.preventDefault();
  }
  if (name.length > 50) {
    nameError.textContent = "Name must be maximum 50 characters long";
    event.preventDefault();
  }
  if (type === "") {
    typeError.textContent = "Please select a Type";
    event.preventDefault();
  }
});
