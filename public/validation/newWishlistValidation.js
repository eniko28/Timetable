function isValidTime(time) {
  const pattern = /^(0[8-9]|1[0-9]|20):[0-5][0-9]$/;
  return pattern.test(time);
}

function isWithinWorkingHours(time) {
  const parts = time.split(":");
  const hours = parseInt(parts[0], 10);
  return hours >= 8 && hours < 20;
}

function convertTimeToMinutes(time) {
  const parts = time.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}

function isStartBeforeEnd(start, end) {
  const startTime = convertTimeToMinutes(start);
  const endTime = convertTimeToMinutes(end);
  return startTime < endTime;
}

function updateGroups() {
  const subjectCode = document.getElementById("subjectCode").value;
  fetch(`/getGroups?subjectCode=${subjectCode}`)
    .then((response) => response.json())
    .then((data) => {
      const groupDropdown = document.getElementById("groupCode");
      groupDropdown.innerHTML = "";
      data.forEach((group) => {
        const option = document.createElement("option");
        option.text = group.groupId;
        option.value = group.groupId;
        groupDropdown.add(option);
      });
    });
}
document.getElementById("addWishlists").addEventListener("submit", (event) => {
  const start = document.getElementsByName("start")[0].value.trim();
  const end = document.getElementsByName("end")[0].value.trim();
  const groupId = document.getElementsByName("groupCode")[0].value;
  const subjectId = document.getElementsByName("subjectCode")[0].value;

  const startError = document.getElementById("startError");
  const endError = document.getElementById("endError");

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
});

document.getElementById("subjectCode").addEventListener("change", updateGroups);
