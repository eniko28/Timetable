document.getElementById("register").addEventListener("submit", (event) => {
  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value.trim();
  const userId = document.getElementById("userId").value.trim();
  const type = document.getElementById("type").value;

  const nameError = document.getElementById("nameError");
  const passwordError = document.getElementById("passwordError");
  const userIdError = document.getElementById("userIdError");
  const typeError = document.getElementById("typeError");

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

function showAdditionalFields() {
  const type = document.getElementById("type").value;
  const additionalFields = document.getElementById("additionalFields");

  if (type === "Student") {
    additionalFields.style.display = "block";
  } else {
    additionalFields.style.display = "none";
  }
}

window.onload = function func() {
  const typeSelect = document.getElementById("type");
  typeSelect.addEventListener("change", showAdditionalFields);
};
