document
  .getElementById("addWishlists")
  .addEventListener("submit", function (event) {
    var start = document.getElementsByName("start")[0].value.trim();
    var end = document.getElementsByName("end")[0].value.trim();
    var groupId = document.getElementsByName("groupCode")[0].value;
    var subjectId = document.getElementsByName("subjectCode")[0].value;

    var startError = document.getElementById("startError");
    var endError = document.getElementById("endError");

    startError.textContent = "";
    endError.textContent = "";

    if (start === "" || end === "" || groupId === "" || subjectId === "") {
      startError.textContent = "Please fill in all fields";
      event.preventDefault();
    }
    if (!isValidTime(start) || !isValidTime(end)) {
      startError.textContent = "Please enter valid start and end times (HH:mm)";
      event.preventDefault();
    }
    if (!isWithinWorkingHours(start) || !isWithinWorkingHours(end)) {
      startError.textContent = "Please enter times between 08:00 and 20:00";
      event.preventDefault();
    }
    if (!isStartBeforeEnd(start, end)) {
      startError.textContent = "Start time must be before end time";
      event.preventDefault();
    }
    if (!isValidDay(day)) {
      startError.textContent = "Please select a valid day";
      event.preventDefault();
    }
  });

function isValidTime(time) {
  var pattern = /^(0[8-9]|1[0-9]|20):[0-5][0-9]$/;
  return pattern.test(time);
}

function isWithinWorkingHours(time) {
  var parts = time.split(":");
  var hours = parseInt(parts[0]);
  return hours >= 8 && hours < 20;
}

function isStartBeforeEnd(start, end) {
  var startTime = convertTimeToMinutes(start);
  var endTime = convertTimeToMinutes(end);
  return startTime < endTime;
}

function convertTimeToMinutes(time) {
  var parts = time.split(":");
  var hours = parseInt(parts[0]);
  var minutes = parseInt(parts[1]);
  return hours * 60 + minutes;
}

function isValidDay(day) {
  var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return daysOfWeek.includes(day);
}

function updateGroups() {
  var subjectCode = document.getElementById("subjectCode").value;
  fetch("/getGroups?subjectCode=" + subjectCode)
    .then((response) => response.json())
    .then((data) => {
      var groupDropdown = document.getElementById("groupCode");
      groupDropdown.innerHTML = "";
      data.forEach((group) => {
        var option = document.createElement("option");
        option.text = group.groupId;
        option.value = group.groupId;
        groupDropdown.add(option);
      });
    });
}

document.getElementById("subjectCode").addEventListener("change", updateGroups);

function showSubgroups(value) {
  const additionalFields = document.getElementById("additionalFields");
  const selectedSubgroupSelect = document.getElementById("selectedSubgroup");

  if (value === "yes") {
    additionalFields.style.display = "block";
  } else {
    additionalFields.style.display = "none";
  }
}

function showTeacherInfo(selectedTeacherId) {
  var allTeacherDivs = document.querySelectorAll(".teacher-info");
  for (var i = 0; i < allTeacherDivs.length; i++) {
    allTeacherDivs[i].style.display = "none";
  }
  var selectedTeacherDiv = document.querySelectorAll(
    '.teacher-info[data-teacher-id="' + selectedTeacherId + '"]'
  );
  for (var j = 0; j < selectedTeacherDiv.length; j++) {
    selectedTeacherDiv[j].style.display = "block";
  }
}
