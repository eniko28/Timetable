document
  .getElementById("register")
  .addEventListener("submit", function (event) {
    var name = document.getElementById("name").value.trim();
    var password = document.getElementById("password").value.trim();
    var userId = document.getElementById("userId").value.trim();
    var type = document.getElementById("type").value;

    var nameError = document.getElementById("nameError");
    var passwordError = document.getElementById("passwordError");
    var userIdError = document.getElementById("userIdError");
    var typeError = document.getElementById("typeError");

    nameError.textContent = "";
    passwordError.textContent = "";
    userIdError.textContent = "";
    typeError.textContent = "";

    if (name === "") {
      nameError.textContent = "Please fill in the Name field";
      event.preventDefault();
    }
    if (password === "") {
      passwordError.textContent = "Please fill in the Password field";
      event.preventDefault();
    }
    if (userId === "") {
      userIdError.textContent = "Please fill in the User Id field";
      event.preventDefault();
    }
    if (type === "") {
      typeError.textContent = "Please select a User Type";
      event.preventDefault();
    }
  });
