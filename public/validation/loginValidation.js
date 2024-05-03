document.getElementById("login").addEventListener("submit", (event) => {
  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();
  const type = document.getElementById("user").value;

  const userIdError = document.getElementById("userIdError");
  const passwordError = document.getElementById("passwordError");
  const userTypeError = document.getElementById("userTypeError");

  userIdError.textContent = "";
  passwordError.textContent = "";
  userTypeError.textContent = "";

  if (userId === "") {
    userIdError.textContent = "Please fill in User Id field";
    event.preventDefault();
  }
  if (userId.length < 1) {
    userIdError.textContent = "User ID must be at least 1 character long";
    event.preventDefault();
  }
  if (
    type !== "Admin" &&
    type !== "Teacher" &&
    type !== "Student" &&
    type !== "Scheduler"
  ) {
    userTypeError.textContent = "Please select a valid user type";
    event.preventDefault();
  }
  if (password.length === 0) {
    passwordError.textContent = "Please fill in Password field";
    event.preventDefault();
  }
  if (password.length > 20) {
    passwordError.textContent = "Password must be maximum 20 characters long";
    event.preventDefault();
  }
  if (!/^[A-Za-z0-9]+$/.test(userId)) {
    userIdError.textContent = "User Id can only contain letters and numbers";
    event.preventDefault();
    document.getElementById("userId").focus();
  }
});
