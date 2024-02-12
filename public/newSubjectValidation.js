document
  .getElementById("addSubjects")
  .addEventListener("submit", function (event) {
    var code = document.getElementById("code").value.trim();
    var name = document.getElementById("name").value.trim();
    var type = document.getElementById("type").value;

    if (code === "" || name === "") {
      alert("Please fill in all fields");
      event.preventDefault();
    }
    if (code.length < 1) {
      alert("Subject Id must be at least 1 character long");
      event.preventDefault();
    }
    if (type !== "Course" && type !== "Seminar" && type !== "Laboratory") {
      alert("Please select a valid type");
      event.preventDefault();
    }
    if (name.length > 50) {
      alert("Name must be maximum 50 characters long");
      event.preventDefault();
    }
    if (!/^[A-Za-z0-9]+$/.test(code)) {
      alert("Subject Id can only contain letters and numbers");
      this.focus();
    }
  });
