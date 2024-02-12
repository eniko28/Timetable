document
  .getElementById("addSubjects")
  .addEventListener("submit", function (event) {
    var code = document.getElementById("code").value.trim();
    var name = document.getElementById("name").value.trim();
    var type = document.getElementById("type").value;

    var codeError = document.getElementById("codeError");
    var nameError = document.getElementById("nameError");
    var typeError = document.getElementById("typeError");

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
